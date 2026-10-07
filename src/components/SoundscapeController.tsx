import React, { useState, useEffect, useRef } from 'react';
import { spaceAudio, SoundscapeType, SoundscapeState } from '../utils/audio';
import { Radio, Volume2, VolumeX, Sliders, ChevronDown, ChevronUp, Sparkles, Wind, Disc } from 'lucide-react';

interface SoundscapeControllerProps {
  activePlanet: 'MOON' | 'MARS';
  onSyncPlanet?: (planet: 'MOON' | 'MARS') => void;
}

export const SoundscapeController: React.FC<SoundscapeControllerProps> = ({
  activePlanet,
  onSyncPlanet,
}) => {
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

    const renderWaveform = () => {
      animId = requestAnimationFrame(renderWaveform);
      const analyser = spaceAudio.getAnalyser();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!analyser || !audioState.isPlaying) {
        // Flatline idle line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
        return;
      }

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      const barWidth = (canvas.width / bufferLength) * 1.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.85;

        // Lunar = cyan/silver, Mars = orange/amber
        ctx.fillStyle =
          audioState.environment === 'LUNAR'
            ? `rgba(98, 217, 255, ${0.4 + (dataArray[i] / 255) * 0.6})`
            : `rgba(184, 92, 56, ${0.4 + (dataArray[i] / 255) * 0.6})`;

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
      aria-label="Mission Control Soundscape"
      className="fixed bottom-6 right-6 z-40 select-none"
    >
      <div className="bg-[#0B1018]/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden w-[310px] sm:w-[350px]">
        {/* Compact Header Bar */}
        <div className="p-3.5 flex items-center justify-between border-b border-white/10 bg-[#05070B]/50">
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleSoundscape}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                audioState.isPlaying
                  ? audioState.environment === 'LUNAR'
                    ? 'bg-[#62D9FF]/20 text-[#62D9FF] border border-[#62D9FF]/40'
                    : 'bg-[#B85C38]/20 text-[#B85C38] border border-[#B85C38]/40'
                  : 'bg-white/5 text-[#8D98A8] border border-white/10 hover:text-white'
              }`}
              title={audioState.isPlaying ? 'Mute ambient soundscape' : 'Enable ambient soundscape'}
              aria-label={audioState.isPlaying ? 'Mute ambient soundscape' : 'Enable ambient soundscape'}
            >
              {audioState.isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-hud font-bold tracking-wider text-white">
                <Radio className={`w-3 h-3 ${audioState.isPlaying ? 'text-[#62D9FF] animate-pulse' : 'text-[#8D98A8]'}`} />
                <span>MISSION CONTROL AUDIO</span>
              </div>
              <div className="text-[11px] font-mono-data text-[#8D98A8] flex items-center gap-1.5">
                <span className={audioState.isPlaying ? 'text-white' : 'text-[#8D98A8]'}>
                  {audioState.isPlaying ? audioState.environment : 'OFFLINE'}
                </span>
                <span>·</span>
                <span>{Math.round(audioState.volume * 100)}% VOL</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Visualizer Mini Canvas in Header */}
            <canvas
              ref={canvasRef}
              width={70}
              height={22}
              className="rounded bg-black/40 border border-white/10"
            />

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? 'Collapse Mission Control Soundscape' : 'Expand Mission Control Soundscape'}
              className="p-1.5 rounded text-[#8D98A8] hover:text-white transition-colors cursor-pointer"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expanded Controls Drawer */}
        {isExpanded && (
          <div className="p-4 space-y-4 animate-fadeIn text-xs">
            {/* Environment Toggle Segmented Control */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-hud uppercase tracking-widest text-[#8D98A8] block">
                Planetary Acoustic Environment
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#05070B] border border-white/15 rounded-xl">
                <button
                  onClick={() => handleSelectEnvironment('LUNAR')}
                  className={`py-2 px-3 rounded-lg font-hud text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    audioState.environment === 'LUNAR'
                      ? 'bg-[#D9DDE3] text-[#05070B] shadow-md font-bold'
                      : 'text-[#8D98A8] hover:text-white'
                  }`}
                >
                  <Disc className="w-3.5 h-3.5" />
                  <span>Moon (Vacuum)</span>
                </button>
                <button
                  onClick={() => handleSelectEnvironment('MARTIAN')}
                  className={`py-2 px-3 rounded-lg font-hud text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    audioState.environment === 'MARTIAN'
                      ? 'bg-[#B85C38] text-white shadow-md font-bold'
                      : 'text-[#8D98A8] hover:text-white'
                  }`}
                >
                  <Wind className="w-3.5 h-3.5" />
                  <span>Mars (Wind)</span>
                </button>
              </div>
            </div>

            {/* Environmental Profile Description */}
            <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-[#8D98A8] leading-relaxed">
              {audioState.environment === 'LUNAR' ? (
                <span>
                  <strong className="text-white block font-hud mb-0.5">LUNAR ENVIRONMENT:</strong>
                  Deep 48 Hz seismic harmonic hum simulating Apollo ALSEP lunar ringing and vacuum cosmic
                  ray electrostatic resonance.
                </span>
              ) : (
                <span>
                  <strong className="text-white block font-hud mb-0.5">MARTIAN ENVIRONMENT:</strong>
                  Low-pressure atmospheric wind filter swept across 140 Hz (modeled from InSight’s SEIS
                  microphone) and 60 Hz chassis rumble.
                </span>
              )}
            </div>

            {/* Volume Slider Rail */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono-data">
                <span className="text-[#8D98A8] flex items-center gap-1">
                  <Sliders className="w-3 h-3 text-[#62D9FF]" />
                  <span>Soundscape Master Gain</span>
                </span>
                <span className="text-white">{Math.round(audioState.volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={audioState.volume}
                onChange={handleVolumeChange}
                aria-label="Soundscape Volume"
                className="w-full h-1.5 bg-[#05070B] rounded-lg appearance-none cursor-pointer accent-[#62D9FF]"
              />
            </div>

            {/* Mission Control Sound Effect Triggers */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                onClick={handleQuindarBeep}
                className="flex-1 py-1.5 px-3 bg-white/5 hover:bg-white/15 border border-white/15 rounded-lg font-hud text-[11px] text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-[#F3B562]" />
                <span>Quindar Beep (2.5 kHz)</span>
              </button>

              <button
                onClick={() => spaceAudio.playTelemetryPing(1400, 0.06)}
                className="py-1.5 px-3 bg-white/5 hover:bg-white/15 border border-white/15 rounded-lg font-hud text-[11px] text-[#62D9FF] hover:text-white transition-colors cursor-pointer"
              >
                Radio Ping
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
