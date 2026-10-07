import React, { useState, useEffect } from 'react';
import { Destination } from '../types/mission';
import { spaceAudio } from '../utils/audio';
import { Volume2, VolumeX, Menu, X } from 'lucide-react';

interface NavbarProps {
  activePlanet: Destination;
  onSelectPlanet: (planet: Destination) => void;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePlanet,
  onSelectPlanet,
  onNavigate,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [audioActive, setAudioActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = spaceAudio.subscribe((state) => {
      setAudioActive(state.isPlaying);
    });
    return () => unsubscribe();
  }, []);

  const toggleSound = () => {
    spaceAudio.togglePlay();
  };

  const navLinks = [
    { label: 'Explore', target: 'explore' },
    { label: 'Map', target: 'archaeology-map' },
    { label: '3D Timeline', target: 'timeline-3d' },
    { label: 'Machines', target: 'machines' },
    { label: 'Science', target: 'science' },
    { label: 'Archive', target: 'archive' },
    { label: 'Young Explorers', target: 'explorers' },
  ];

  const handleLinkClick = (target: string) => {
    spaceAudio.playTelemetryPing(1200, 0.05);
    onNavigate(target);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#05070B]/90 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => handleLinkClick('hero')}
          className="text-left font-hud text-lg sm:text-xl font-bold tracking-wider text-white hover:text-[#62D9FF] transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#62D9FF]"
        >
          ABANDONED <span className="text-white/30">//</span> NOT FORGOTTEN
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-[#8D98A8]">
          {navLinks.map((link) => (
            <button
              key={link.target}
              onClick={() => handleLinkClick(link.target)}
              className="hover:text-white transition-colors cursor-pointer py-1 relative group whitespace-nowrap focus:outline-none focus-visible:ring-1 focus-visible:ring-[#62D9FF]"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#62D9FF] transition-all duration-200 group-hover:w-full" />
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary Actions (Segmented Planet Switcher & Telemetry Audio) */}
        <div className="flex items-center gap-3">
          {/* Planet Switcher Segmented Control */}
          <div className="flex items-center p-1 bg-[#0B1018] border border-white/15 rounded-lg">
            <button
              onClick={() => {
                spaceAudio.playTelemetryPing(800, 0.05);
                onSelectPlanet('MOON');
              }}
              className={`px-3 py-1 text-xs font-hud font-semibold rounded-md transition-all whitespace-nowrap ${
                activePlanet === 'MOON'
                  ? 'bg-[#D9DDE3] text-[#05070B] shadow-sm'
                  : 'text-[#8D98A8] hover:text-white'
              }`}
            >
              MOON
            </button>
            <button
              onClick={() => {
                spaceAudio.playTelemetryPing(950, 0.05);
                onSelectPlanet('MARS');
              }}
              className={`px-3 py-1 text-xs font-hud font-semibold rounded-md transition-all whitespace-nowrap ${
                activePlanet === 'MARS'
                  ? 'bg-[#B85C38] text-white shadow-sm'
                  : 'text-[#8D98A8] hover:text-white'
              }`}
            >
              MARS
            </button>
          </div>

          {/* Audio Telemetry Toggle */}
          <button
            onClick={toggleSound}
            title={audioActive ? 'Mute space telemetry audio' : 'Enable ambient space audio'}
            aria-label={audioActive ? 'Mute space telemetry audio' : 'Enable ambient space audio'}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              audioActive
                ? 'bg-[#62D9FF]/15 border-[#62D9FF]/40 text-[#62D9FF]'
                : 'bg-[#0B1018] border-white/15 text-[#8D98A8] hover:text-white hover:border-white/30'
            }`}
          >
            {audioActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-[#0B1018] border border-white/15 text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B1018]/95 border-b border-white/10 px-6 py-4 space-y-3 backdrop-blur-xl animate-fadeIn">
          {navLinks.map((link) => (
            <button
              key={link.target}
              onClick={() => handleLinkClick(link.target)}
              className="block w-full text-left py-2 text-base font-medium text-[#F5F7FA] hover:text-[#62D9FF] border-b border-white/5"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 text-xs text-[#8D98A8] flex items-center justify-between">
            <span>NASA Space Apps Challenge 2026</span>
            <span className="font-hud uppercase text-[#62D9FF]">{activePlanet} ARCHIVE</span>
          </div>
        </div>
      )}
    </header>
  );
};
