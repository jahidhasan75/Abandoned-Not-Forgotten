import React, { useState, useEffect, useRef } from 'react';
import { spaceAudio, SoundscapeType, SoundscapeState } from '../utils/audio';
import { useI18n } from '../i18n/I18nProvider';
import { Volume2, VolumeX, ChevronDown, ChevronUp } from 'lucide-react';

interface SoundscapeControllerProps {
  activePlanet: 'MOON' | 'MARS';
  onSyncPlanet?: (planet: 'MOON' | 'MARS') => void;
}

export const SoundscapeController: React.FC<SoundscapeControllerProps> = ({
  activePlanet,
  onSyncPlanet,
}) => {
  const { t } = useI18n();
  const [audioState, setAudioState] = useState<SoundscapeState>({
    isPlaying: false,
    environment: 'MARTIAN',
    volume: 0.4,
  });
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Subscribe to audio engine state changes
  useEffect(() => {
    const unsubscribe = spaceAudio.subscribe((state) => {
      setAudioState(state);
    });
    return () => unsubscribe();
  }, []);

  // When active planet prop changes, optionally sync if soundscape is playing
  useEffect(() => {
    if (activePlanet === 'MOON' && audioState.environment !== 'LUNAR') {
      spaceAudio.setEnvironment('LUNAR');
    } else if (activePlanet === 'MARS' && audioState.environment !== 'MARTIAN') {
      spaceAudio.setEnvironment('MARTIAN');
    }
  }, [activePlanet]);

  // Real-time audio waveform visualizer using Web Audio AnalyserNode
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawFlatline = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(238, 240, 245, 0.16)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    // While muted, draw one idle line and stop: no animation loop, no AudioContext.
    const initialAnalyser = spaceAudio.peekAnalyser();
    if (!audioState.isPlaying || !initialAnalyser) {
      drawFlatline();
      return;
    }

    const dataArray = new Uint8Array(initialAnalyser.frequencyBinCount);

    const renderWaveform = () => {
      animId = requestAnimationFrame(renderWaveform);
      const analyser = spaceAudio.peekAnalyser();
      if (!analyser) {
        drawFlatline();
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bufferLength = dataArray.length;
      analyser.getByteFrequencyData(dataArray);

      const barWidth = (canvas.width / bufferLength) * 1.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.85;

        // Bars only draw while sound plays, so they take the accent; the idle line stays neutral
        ctx.fillStyle = `rgba(208, 112, 74, ${0.45 + (dataArray[i] / 255) * 0.55})`;

        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        x += barWidth;
      }
    };

    renderWaveform();

    return () => cancelAnimationFrame(animId);
  }, [audioState.isPlaying, audioState.environment]);

  const toggleSoundscape = () => {
    spaceAudio.togglePlay();
  };

  const handleSelectEnvironment = (env: SoundscapeType) => {
    spaceAudio.setEnvironment(env);
    if (onSyncPlanet) {
      onSyncPlanet(env === 'LUNAR' ? 'MOON' : 'MARS');
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    spaceAudio.setVolume(val);
  };

  const handleQuindarBeep = () => {
    spaceAudio.playQuindarTone(true);
  };

  return (
    <aside
      aria-label={t('audio.title')}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 select-none"
    >
      <div
        className={`bg-card border border-line rounded-2xl overflow-hidden ${
          isExpanded ? 'w-76 sm:w-80' : 'w-auto'
        }`}
      >
        {/* Compact Header Bar (on phones it collapses to a small pill) */}
        <div
          className={`p-2 flex items-center justify-between gap-2 ${isExpanded ? 'border-b border-line' : ''}`}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSoundscape}
              aria-pressed={audioState.isPlaying}
              className={`p-2 rounded-lg transition-colors ${
                audioState.isPlaying ? 'bg-raised text-fg' : 'text-fg-2 hover:text-fg hover:bg-raised'
              }`}
              title={audioState.isPlaying ? 'Mute ambient soundscape' : 'Enable ambient soundscape'}
              aria-label={audioState.isPlaying ? 'Mute ambient soundscape' : 'Enable ambient soundscape'}
            >
              {audioState.isPlaying ? <Volume2 className="w-4 h-4" strokeWidth={1.5} /> : <VolumeX className="w-4 h-4" strokeWidth={1.5} />}
            </button>

            <div className={isExpanded ? 'block' : 'hidden sm:block'}>
              <div className="text-xs text-fg whitespace-nowrap">{t('audio.title')}</div>
              <div className="text-xs text-fg-2 whitespace-nowrap">
                {audioState.isPlaying ? (audioState.environment === 'LUNAR' ? 'Moon' : 'Mars') : t('audio.offline')}
                <span className="font-mono-data"> · {Math.round(audioState.volume * 100)}%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Visualizer Mini Canvas in Header */}
            <canvas
              ref={canvasRef}
              width={70}
              height={22}
              className="rounded bg-ink"
              aria-hidden="true"
            />

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? 'Collapse sound controls' : 'Expand sound controls'}
              aria-expanded={isExpanded}
              className="p-2 rounded-lg text-fg-2 hover:text-fg hover:bg-raised transition-colors"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" strokeWidth={1.5} /> : <ChevronUp className="w-4 h-4" strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Expanded Controls Drawer */}
        {isExpanded && (
          <div className="p-4 space-y-4 text-xs">
            {/* Environment Toggle Segmented Control */}
            <div className="space-y-1.5">
              <p className="text-xs text-fg-2">Sound of</p>
              <div className="grid grid-cols-2 gap-1 p-1 border border-line rounded-xl" role="group" aria-label="Sound environment">
                <button
                  onClick={() => handleSelectEnvironment('LUNAR')}
                  aria-pressed={audioState.environment === 'LUNAR'}
                  className={`py-2 px-3 rounded-lg text-xs transition-colors ${
                    audioState.environment === 'LUNAR' ? 'bg-raised text-fg' : 'text-fg-2 hover:text-fg'
                  }`}
                >
                  Moon (vacuum)
                </button>
                <button
                  onClick={() => handleSelectEnvironment('MARTIAN')}
                  aria-pressed={audioState.environment === 'MARTIAN'}
                  className={`py-2 px-3 rounded-lg text-xs transition-colors ${
                    audioState.environment === 'MARTIAN' ? 'bg-raised text-fg' : 'text-fg-2 hover:text-fg'
                  }`}
                >
                  Mars (wind)
                </button>
              </div>
            </div>

            {/* Environmental Profile Description */}
            <div className="text-xs text-fg-2 leading-relaxed">
              {audioState.environment === 'LUNAR' ? (
                <span>
                  <span className="text-fg block mb-0.5">The Moon</span>
                  Deep 48 Hz seismic harmonic hum simulating Apollo ALSEP lunar ringing and vacuum cosmic
                  ray electrostatic resonance.
                </span>
              ) : (
                <span>
                  <span className="text-fg block mb-0.5">Mars</span>
                  Low-pressure atmospheric wind filter swept across 140 Hz (modeled from InSight’s SEIS
                  microphone) and 60 Hz chassis rumble.
                </span>
              )}
            </div>

            {/* Volume Slider Rail */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-fg-2">Volume</span>
                <span className="text-fg font-mono-data">{Math.round(audioState.volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={audioState.volume}
                onChange={handleVolumeChange}
                aria-label="Volume"
                className="w-full cursor-pointer accent-accent"
              />
            </div>

            {/* Mission Control Sound Effect Triggers */}
            <div className="pt-2 border-t border-line flex items-center justify-between gap-2">
              <button
                onClick={handleQuindarBeep}
                className="flex-1 py-2 px-3 border border-line rounded-lg text-xs text-fg hover:bg-raised transition-colors"
              >
                Quindar tone <span className="font-mono-data text-fg-2">2.5 kHz</span>
              </button>

              <button
                onClick={() => spaceAudio.playTelemetryPing(1400, 0.06)}
                className="py-2 px-3 border border-line rounded-lg text-xs text-fg hover:bg-raised transition-colors"
              >
                Radio ping
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
