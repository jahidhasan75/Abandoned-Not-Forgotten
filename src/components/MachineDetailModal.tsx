import React, { useEffect } from 'react';
import { MissionArtifact } from '../types/mission';
import { spaceAudio } from '../utils/audio';
import { X, Calendar, MapPin, Gauge, Compass, Lightbulb, Quote, ShieldAlert } from 'lucide-react';

interface MachineDetailModalProps {
  artifact: MissionArtifact | null;
  onClose: () => void;
}

export const MachineDetailModal: React.FC<MachineDetailModalProps> = ({ artifact, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (artifact) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [artifact, onClose]);

  if (!artifact) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Modal Container */}
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0B1018] border border-white/20 rounded-2xl shadow-2xl overflow-y-auto flex flex-col focus:outline-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Top Sticky Header */}
        <div className="sticky top-0 z-30 bg-[#0B1018]/95 backdrop-blur-md px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono-data text-[#62D9FF] tracking-wider uppercase">
              {artifact.artifactId}
            </span>
            <span className="text-white/20">|</span>
            <span
              className={`text-xs font-hud font-bold uppercase tracking-wider ${
                artifact.destination === 'MARS' ? 'text-[#B85C38]' : 'text-[#D9DDE3]'
              }`}
            >
              {artifact.destination} SECTOR
            </span>
          </div>

          <button
            onClick={() => {
              spaceAudio.playTelemetryPing(700, 0.04);
              onClose();
            }}
            aria-label="Close artifact dossier"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#8D98A8] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Hero Image */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#07090e] shrink-0">
          <img
            src={artifact.image}
            alt={artifact.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1018] via-transparent to-black/30" />
          <div className="absolute bottom-3 left-6 right-6 flex items-center justify-between text-[11px] font-mono-data text-[#8D98A8]">
            <span className="bg-[#05070B]/85 px-2.5 py-1 rounded backdrop-blur-sm border border-white/10 text-white">
              {artifact.imageCaption}
            </span>
            <span className="hidden sm:inline bg-[#05070B]/85 px-2.5 py-1 rounded backdrop-blur-sm border border-white/10">
              DEMO ARCHAEOLOGICAL RECONSTRUCTION
            </span>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Main Title & Role */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-data text-[#8D98A8] mb-1">
              <span>{artifact.mission}</span>
              <span aria-hidden="true">·</span>
              <span>{artifact.category}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#F3B562] font-semibold">{artifact.status}</span>
            </div>
            <h2 id="modal-title" className="text-2xl sm:text-4xl font-bold font-hud text-white">
              {artifact.name}
            </h2>
            <p className="text-sm text-[#D9DDE3] mt-1 font-light italic">
              “{artifact.role}”
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-white/5 border border-white/10 text-xs font-mono-data">
            <div>
              <span className="text-[#8D98A8] block text-[10px] uppercase">Landing Year</span>
              <span className="text-white font-bold text-sm flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-[#62D9FF]" />
                {artifact.landingYear} CE
              </span>
            </div>
            <div>
              <span className="text-[#8D98A8] block text-[10px] uppercase">Days Active</span>
              <span className="text-white font-bold text-sm flex items-center gap-1 mt-0.5">
                <Gauge className="w-3.5 h-3.5 text-[#F3B562]" />
                {artifact.daysActive} {typeof artifact.daysActive === 'number' ? 'Sols / Days' : ''}
              </span>
            </div>
            <div>
              <span className="text-[#8D98A8] block text-[10px] uppercase">Location</span>
              <span className="text-white font-bold text-sm flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-[#B85C38]" />
                {artifact.locationName.split('(')[0]}
              </span>
            </div>
            <div>
              <span className="text-[#8D98A8] block text-[10px] uppercase">Coordinates</span>
              <span className="text-[#62D9FF] font-bold text-sm block mt-0.5">
                {artifact.coordinates.lat}, {artifact.coordinates.lng}
              </span>
            </div>
          </div>

          {/* Historical Narrative */}
          <div className="space-y-3">
            <h3 className="text-sm font-hud font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#62D9FF]" />
              <span>Mission Narrative & Archaeology</span>
            </h3>
            <p className="text-sm text-[#D9DDE3] leading-relaxed font-light">
              {artifact.story}
            </p>
          </div>

          {/* Historical Quote if available */}
          {artifact.historicalQuote && (
            <div className="p-4 rounded-xl bg-[#62D9FF]/10 border border-[#62D9FF]/30 space-y-2">
              <div className="flex items-start gap-2">
                <Quote className="w-5 h-5 text-[#62D9FF] shrink-0 mt-0.5" />
                <p className="text-sm text-white italic font-light">
                  “{artifact.historicalQuote.text}”
                </p>
              </div>
              <p className="text-[11px] font-mono-data text-[#8D98A8] text-right">
                — {artifact.historicalQuote.author}
              </p>
            </div>
          )}

          {/* Science Made Possible */}
          <div className="space-y-3">
            <h3 className="text-sm font-hud font-bold uppercase tracking-wider text-[#62D9FF] flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              <span>Science Made Possible</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {artifact.scienceContribution.map((sc, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-lg bg-white/5 border border-white/10 text-xs text-[#D9DDE3] flex items-start gap-2"
                >
                  <span className="text-[#62D9FF] font-bold">›</span>
                  <span>{sc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subsystems Dissection */}
          <div className="space-y-3">
            <h3 className="text-sm font-hud font-bold uppercase tracking-wider text-white">
              Subsystems & Engineering Innovations
            </h3>
            <div className="space-y-3">
              {artifact.subsystems.map((sub, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-hud font-bold text-white text-sm">
                      {sub.name}
                    </span>
                    <span className="text-[10px] font-mono-data text-[#62D9FF]">
                      SUBSYSTEM 0{i + 1}
                    </span>
                  </div>
                  <p className="text-[#8D98A8]">{sub.description}</p>
                  <p className="text-[#D9DDE3] pt-1">
                    <strong className="text-[#F3B562]">Significance:</strong> {sub.significance}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Why Left Behind */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-hud font-bold uppercase tracking-wider text-[#F3B562]">
              <ShieldAlert className="w-4 h-4" />
              <span>Why Was This Hardware Left Behind?</span>
            </div>
            <p className="text-xs text-[#8D98A8] leading-relaxed">
              {artifact.whyLeftBehind}
            </p>
          </div>

          {/* Fun Facts */}
          {artifact.funFacts.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-hud font-bold uppercase tracking-wider text-[#8D98A8]">
                Expedition Notes & Trivia
              </h3>
              <ul className="space-y-2 text-xs text-[#D9DDE3]">
                {artifact.funFacts.map((fact, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#F3B562] mt-0.5">●</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Bottom Sticky Close Bar */}
        <div className="sticky bottom-0 z-30 bg-[#0B1018]/95 backdrop-blur-md px-6 py-4 border-t border-white/10 flex items-center justify-between text-xs">
          <span className="text-[#8D98A8] font-mono-data">
            PRESS ESCAPE TO CLOSE
          </span>
          <button
            onClick={() => {
              spaceAudio.playTelemetryPing(700, 0.04);
              onClose();
            }}
            className="px-6 py-2 rounded-lg bg-white text-black font-hud font-semibold uppercase text-xs tracking-wider hover:bg-white/90 cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
