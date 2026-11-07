import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Destination } from '../types/mission';
import { spaceAudio } from '../utils/audio';
import { Volume2, VolumeX, Menu, X, Languages, Sun, Moon } from 'lucide-react';
import { useTheme } from '../lib/theme';
import logo from '../assets/brand/exoarchive-logo.webp';
import headerSky from '../assets/brand/header-earth-limb.webp';
import { useI18n } from '../i18n/I18nProvider';

const navLinks = [
  { key: 'nav.explore', target: 'explore' },
  { key: 'nav.map', target: 'archaeology-map' },
  { key: 'nav.timeline', target: 'timeline-3d' },
  { key: 'nav.machines', target: 'machines' },
  { key: 'nav.science', target: 'science' },
  { key: 'nav.archive', target: 'archive' },
  { key: 'nav.sources', target: 'data-sources' },
  { key: 'nav.explorers', target: 'explorers' },
] as const;

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
  const { t, lang, toggleLang } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [audioActive, setAudioActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const { theme, toggleTheme } = useTheme();
  const linkRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState<{ x: number; w: number } | null>(null);

  // The accent underline slides from the old link to the new one instead of jumping.
  useLayoutEffect(() => {
    const place = () => {
      const el = linkRefs.current[activeSection];
      setIndicator(el && el.offsetWidth ? { x: el.offsetLeft, w: el.offsetWidth } : null);
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [activeSection, lang]);

  useEffect(() => {
    const handleScroll = () => {
      const next = window.scrollY > 40;
      setScrolled((prev) => (prev === next ? prev : next));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Highlight the nav link for the section in the middle of the viewport
  useEffect(() => {
    const ids = ['hero', ...navLinks.map((l) => l.target)];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    const observeAll = () => {
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    };
    observeAll();
    // The 3D timeline section is lazy-loaded, so observe again once it has mounted
    const retry = window.setTimeout(observeAll, 1500);
    return () => {
      window.clearTimeout(retry);
      observer.disconnect();
    };
  }, []);

  // Close the mobile drawer with Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  useEffect(() => {
    const unsubscribe = spaceAudio.subscribe((state) => {
      setAudioActive(state.isPlaying);
    });
    return () => unsubscribe();
  }, []);

  const toggleSound = () => {
    spaceAudio.togglePlay();
  };

  const handleLinkClick = (target: string) => {
    spaceAudio.playTelemetryPing(1200, 0.05);
    onNavigate(target);
    setActiveSection(target);
    setMobileMenuOpen(false);
    // Mark the arriving section: a thin accent rule draws across its top once (CSS: [data-arrive]).
    const el = document.getElementById(target);
    if (el && target !== 'hero') {
      el.removeAttribute('data-arrive');
      void el.offsetWidth;
      el.setAttribute('data-arrive', '');
      window.setTimeout(() => el.removeAttribute('data-arrive'), 1600);
    }
  };

  return (
    <header
      className={`theme-dark fixed top-0 left-0 right-0 z-50 bg-ink border-b transition-[padding,border-color] ${
        scrolled ? 'border-line py-2' : 'border-transparent py-3 sm:py-4'
      }`}
    >
      {/* Earth's limb against the stars (the team's artwork, cropped to a thin band so the glowing
          horizon runs along the bottom of the header). A neutral scrim keeps the menu readable.
          Decoration only. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <img src={headerSky} alt="" decoding="async" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/60 to-ink/20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Zone 1: logo */}
        <button
          onClick={() => handleLinkClick('hero')}
          className="flex flex-col items-start shrink-0 rounded"
          aria-label={t('brand.home')}
        >
          <img
            src={logo}
            alt=""
            width={720}
            height={114}
            className={`w-auto transition-[height] ${scrolled ? 'h-5 sm:h-6' : 'h-5 sm:h-7'}`}
          />
          <span className={`text-xs text-fg-2 mt-1 whitespace-nowrap ${scrolled ? 'hidden' : 'hidden sm:block'}`}>
            {t('brand.tagline')}
          </span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav
          aria-label="Primary"
          className="hidden xl:flex relative items-center gap-5 text-sm text-fg"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.target;
            return (
              <button
                key={link.target}
                ref={(el) => {
                  linkRefs.current[link.target] = el;
                }}
                onClick={() => handleLinkClick(link.target)}
                aria-current={isActive ? 'location' : undefined}
                className="nav-link transition-colors py-2 whitespace-nowrap text-fg"
              >
                {t(link.key)}
              </button>
            );
          })}
          <span
            aria-hidden="true"
            className="nav-indicator absolute bottom-0 left-0 h-0.5 bg-accent"
            style={{
              width: indicator?.w ?? 0,
              transform: `translateX(${indicator?.x ?? 0}px)`,
              opacity: indicator ? 1 : 0,
            }}
          />
        </nav>

        {/* Zone 3: Primary Actions (Segmented Planet Switcher & Telemetry Audio) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Planet Switcher Segmented Control */}
          <div className="hidden sm:flex items-center p-1 border border-line rounded-lg">
            <button
              onClick={() => {
                spaceAudio.playTelemetryPing(800, 0.05);
                onSelectPlanet('MOON');
              }}
              className={`px-3 py-1 text-xs rounded transition-colors whitespace-nowrap ${
                activePlanet === 'MOON' ? 'bg-raised text-fg' : 'text-fg-2 hover:text-fg'
              }`}
            >
              {t('body.MOON')}
            </button>
            <button
              onClick={() => {
                spaceAudio.playTelemetryPing(950, 0.05);
                onSelectPlanet('MARS');
              }}
              className={`px-3 py-1 text-xs rounded transition-colors whitespace-nowrap ${
                activePlanet === 'MARS' ? 'bg-raised text-fg' : 'text-fg-2 hover:text-fg'
              }`}
            >
              {t('body.MARS')}
            </button>
          </div>

          {/* Language toggle: English <-> Bangla */}
          <button
            onClick={() => {
              spaceAudio.playTelemetryPing(1150, 0.05);
              toggleLang();
            }}
            aria-label={t('lang.toggleAria')}
            title={t('lang.toggleAria')}
            lang={lang === 'en' ? 'bn' : 'en'}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-line text-sm text-fg-2 hover:text-fg hover:bg-raised transition-colors"
          >
            <Languages className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
            {t('lang.toggle')}
          </button>

          {/* Dark / light theme */}
          <button
            onClick={() => {
              spaceAudio.playTelemetryPing(1000, 0.05);
              toggleTheme();
            }}
            aria-label={theme === 'dark' ? t('theme.toLight') : t('theme.toDark')}
            title={theme === 'dark' ? t('theme.toLight') : t('theme.toDark')}
            className="p-2 rounded-lg border border-line text-fg-2 hover:text-fg hover:bg-raised transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
            )}
          </button>

          {/* Audio Telemetry Toggle */}
          <button
            onClick={toggleSound}
            title={audioActive ? t('nav.audioOff') : t('nav.audioOn')}
            aria-label={audioActive ? t('nav.audioOff') : t('nav.audioOn')}
            aria-pressed={audioActive}
            className={`hidden sm:inline-flex p-2 rounded-lg border transition-colors cursor-pointer ${
              audioActive
                ? 'bg-raised border-line-strong text-fg'
                : 'border-line text-fg-2 hover:text-fg hover:bg-raised'
            }`}
          >
            {audioActive ? <Volume2 className="w-4 h-4" strokeWidth={1.5} /> : <VolumeX className="w-4 h-4" strokeWidth={1.5} />}
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg border border-line text-fg hover:bg-raised transition-colors"
            aria-label={t('nav.menu')}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav"
          className="relative xl:hidden bg-ink border-b border-line px-6 py-4 animate-fadeIn max-h-[calc(100vh-72px)] overflow-y-auto"
        >
          {navLinks.map((link) => (
            <button
              key={link.target}
              onClick={() => handleLinkClick(link.target)}
              aria-current={activeSection === link.target ? 'location' : undefined}
              className={`block w-full text-left py-3 text-base border-b border-line transition-colors ${
                activeSection === link.target ? 'text-fg' : 'text-fg-2 hover:text-fg'
              }`}
            >
              {t(link.key)}
            </button>
          ))}
          {/* Planet switch lives inside the drawer on phones */}
          <div className="sm:hidden grid grid-cols-2 gap-2 pt-4">
            {(['MOON', 'MARS'] as const).map((planet) => (
              <button
                key={planet}
                onClick={() => {
                  spaceAudio.playTelemetryPing(planet === 'MOON' ? 800 : 950, 0.05);
                  onSelectPlanet(planet);
                }}
                aria-pressed={activePlanet === planet}
                className={`py-2 rounded-lg text-sm border transition-colors ${
                  activePlanet === planet ? 'bg-raised text-fg border-line-strong' : 'text-fg-2 border-line'
                }`}
              >
                {t(`body.${planet}`)}
              </button>
            ))}
          </div>
          <div className="pt-4 text-xs text-fg-2 flex items-center justify-between">
            <span>{t('nav.challenge')}</span>
            <span className="text-fg">{t('nav.archiveOf', { planet: t(`body.${activePlanet}`) })}</span>
          </div>
        </div>
      )}
    </header>
  );
};
