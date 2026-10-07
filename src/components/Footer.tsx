import React from 'react';
import { spaceAudio } from '../utils/audio';
import { ArrowUp, Compass, ExternalLink } from 'lucide-react';

interface FooterProps {
  onScrollToTop: () => void;
  onExploreAgain: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToTop, onExploreAgain }) => {
  return (
    <footer className="relative bg-[#05070B] border-t border-white/10 overflow-hidden">
      {/* Cinematic Callout Section */}
      <div className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <p className="text-xs font-mono-data text-[#62D9FF] tracking-widest uppercase">
            SOLAR SYSTEM ARCHAEOLOGY MANIFESTO
          </p>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold font-hud uppercase tracking-tight text-white leading-tight">
            The machines may be silent.
          </h2>

          <p className="text-xl sm:text-3xl md:text-4xl font-light text-[#D9DDE3] max-w-3xl mx-auto leading-snug">
            “But the questions they helped answer are still moving us forward.”
          </p>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => {
              spaceAudio.playTelemetryPing(880, 0.08);
              onExploreAgain();
            }}
            className="px-8 py-3.5 bg-gradient-to-r from-[#B85C38] to-[#9c4c2c] hover:from-[#c9653e] hover:to-[#B85C38] text-white font-hud font-semibold text-sm tracking-wider uppercase rounded-lg shadow-lg shadow-[#B85C38]/20 transition-all cursor-pointer flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-[#62D9FF]" />
            <span>Explore The Archive Again</span>
          </button>

          <button
            onClick={onScrollToTop}
            aria-label="Scroll back to top"
            className="p-3.5 bg-white/5 hover:bg-white/10 border border-white/15 rounded-lg text-white transition-colors cursor-pointer"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Institutional Legal & Accuracy Footnote */}
      <div className="border-t border-white/10 bg-[#0B1018] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs text-[#8D98A8]">
          <div className="space-y-2 max-w-2xl">
            <div className="font-hud font-bold text-sm tracking-wider text-white">
              ABANDONED <span className="text-white/30">//</span> NOT FORGOTTEN
            </div>
            <p className="font-light leading-relaxed">
              A 2026 NASA Space Apps Challenge Project. Built as an interactive digital museum and
              space archaeology educational tool for students, teachers, and space enthusiasts worldwide.
            </p>
            <p className="text-[11px] font-mono-data text-[#8D98A8]/80 leading-relaxed pt-1">
              DATA ACCURACY NOTICE: Mission parameters, coordinates, and historical events are grounded in
              official NASA JPL, NSSDC, and Apollo Flight Journals. Visualizations and 3D schematics marked
              DEMO use illustrative reconstructions for educational storytelling.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 text-xs font-mono-data">
            <a
              href="https://www.spaceappschallenge.org"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>NASA Space Apps 2026</span>
              <ExternalLink className="w-3 h-3 text-[#62D9FF]" />
            </a>
            <span className="text-white/20 hidden sm:inline">|</span>
            <span>MOON & MARS REPOSITORY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
