/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { Destination, MissionArtifact } from './types/mission';
import { MISSIONS_DATA } from './data/missionsData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PlanetSelector } from './components/PlanetSelector';
import { ArchaeologyMap } from './components/ArchaeologyMap';
import { MachineCards } from './components/MachineCards';
import { StatusSystem } from './components/StatusSystem';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { LiveBand } from './components/LiveBand';
import { ImpactStrip } from './components/ImpactStrip';
import { useI18n } from './i18n/I18nProvider';
import { Footer } from './components/Footer';
import { MachineDetailModal } from './components/MachineDetailModal';
import { SoundscapeController } from './components/SoundscapeController';

// Sections further down the page load in their own chunks right after the first paint, so the
// first download is smaller. Each placeholder keeps the section id, so menu links still work.
const OneMachineJourney = lazy(() => import('./components/OneMachineJourney').then((m) => ({ default: m.OneMachineJourney })));
const ScienceConstellation = lazy(() => import('./components/ScienceConstellation').then((m) => ({ default: m.ScienceConstellation })));
const ArchaeologyArchive = lazy(() => import('./components/ArchaeologyArchive').then((m) => ({ default: m.ArchaeologyArchive })));
const DataSources = lazy(() => import('./components/DataSources').then((m) => ({ default: m.DataSources })));
const YoungExplorers = lazy(() => import('./components/YoungExplorers').then((m) => ({ default: m.YoungExplorers })));

const SectionPlaceholder: React.FC<{ id: string; minHeight: number }> = ({ id, minHeight }) => (
  <section id={id} className="relative bg-page border-t border-line" style={{ minHeight }} aria-busy="true" />
);

// Three.js is large (~500 kB), so the 3D timeline loads in its own chunk.
const Timeline3D = lazy(() =>
  import('./components/Timeline3D').then((m) => ({ default: m.Timeline3D }))
);

const TimelinePlaceholder = React.forwardRef<HTMLElement>((_, ref) => (
  <section
    ref={ref}
    id="timeline-3d"
    className="relative py-12 sm:py-20 lg:py-24 bg-page border-t border-line"
    aria-busy="true"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="h-184 rounded-2xl border border-line bg-card/60" />
    </div>
  </section>
));

/** Three.js is only fetched once the timeline is about a screen away, so the first page load stays light. */
const DeferredTimeline3D: React.FC<{ onOpenDetails: (a: MissionArtifact) => void }> = ({ onOpenDetails }) => {
  const ref = useRef<HTMLElement | null>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '800px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  if (!near) return <TimelinePlaceholder ref={ref} />;
  return (
    <Suspense fallback={<TimelinePlaceholder />}>
      <Timeline3D onOpenDetails={onOpenDetails} />
    </Suspense>
  );
};

/**
 * Thin fixed gradient bar tracking scroll depth. It lives in its own component and updates the DOM
 * directly, so scrolling no longer re-renders the whole page.
 */
const ScrollProgressBar: React.FC = () => {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / totalHeight)) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      className="theme-dark fixed top-0 left-0 right-0 h-0.5 z-[60] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <div
        ref={barRef}
        className="h-full origin-left bg-fg-3 will-change-transform"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
};

export default function App() {
  const { t } = useI18n();
  const [activePlanet, setActivePlanet] = useState<Destination>('MARS');
  const [selectedArtifact, setSelectedArtifact] = useState<MissionArtifact | null>(null);

  const handleNavigate = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }, []);

  const handleSelectMachineById = useCallback((id: string) => {
    const found = MISSIONS_DATA.find((m) => m.id === id);
    if (found) {
      setSelectedArtifact(found);
    }
  }, []);

  const handleCloseModal = useCallback(() => setSelectedArtifact(null), []);

  // Deep links: #machine=<id> opens that dossier (a teacher can send a class straight to one object).
  useEffect(() => {
    const openFromHash = () => {
      const m = window.location.hash.match(/^#machine=([\w-]+)$/);
      if (m) handleSelectMachineById(m[1]);
    };
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, [handleSelectMachineById]);

  // Keep the address in step with the open dossier, without adding history entries.
  useEffect(() => {
    const { pathname, search, hash } = window.location;
    if (selectedArtifact) {
      if (hash !== `#machine=${selectedArtifact.id}`) {
        window.history.replaceState(null, '', `${pathname}${search}#machine=${selectedArtifact.id}`);
      }
    } else if (hash.startsWith('#machine=')) {
      window.history.replaceState(null, '', `${pathname}${search}`);
    }
  }, [selectedArtifact]);

  return (
    <div className="min-h-screen bg-page text-fg selection:bg-accent selection:text-ink relative">
      <a
        href="#explore"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[110] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-fg focus:text-page focus:text-xs"
      >
        {t('skip')}
      </a>

      <ScrollProgressBar />

      {/* Global Navbar */}
      <Navbar
        activePlanet={activePlanet}
        onSelectPlanet={setActivePlanet}
        onNavigate={handleNavigate}
      />

      {/* Main Content Sections */}
      <main>
        {/* 1. Cinematic Landing Hero */}
        <Hero
          onStartExploring={() => handleNavigate('explore')}
          onOpenMap={() => handleNavigate('archaeology-map')}
          onOpenMachine={handleSelectMachineById}
        />

        {/* Who it is for, how it is used, how it grows */}
        <ImpactStrip />

        {/* Live NASA data: rovers still working, live Earth-Moon and Earth-Mars range */}
        <LiveBand onOpenMachine={handleSelectMachineById} />

        {/* 2. Interactive Planet Selector ("WHERE STORIES REMAIN") */}
        <PlanetSelector
          activePlanet={activePlanet}
          onSelectPlanet={setActivePlanet}
          onOpenDetails={setSelectedArtifact}
        />

        {/* 3. Space Archaeology Surface Map */}
        <ArchaeologyMap
          activePlanet={activePlanet}
          onSelectPlanet={setActivePlanet}
          onOpenDetails={setSelectedArtifact}
        />

        {/* 4. Immersive 3D Flight Timeline Feature (Three.js) */}
        <DeferredTimeline3D onOpenDetails={setSelectedArtifact} />

        {/* 5. "Meet the Machines" Story Cards */}
        <MachineCards
          onOpenDetails={setSelectedArtifact}
          activePlanetFilter={activePlanet}
        />

        {/* 6. Machine Status System */}
        <StatusSystem onSelectMachineId={handleSelectMachineById} />

        {/* 7. "One Machine. One Journey." Cinematic Timeline */}
        <Suspense fallback={<SectionPlaceholder id="journey" minHeight={1300} />}>
          <OneMachineJourney onOpenMachine={handleSelectMachineById} />
        </Suspense>

        {/* 9. Before & After Draggable Comparison Slider */}
        <BeforeAfterSlider />

        {/* 10. Science Impact Constellation */}
        <Suspense fallback={<SectionPlaceholder id="science" minHeight={980} />}>
          <ScienceConstellation onOpenMachine={handleSelectMachineById} />
        </Suspense>

        {/* 13. Space Archaeology Master Archive */}
        <Suspense fallback={<SectionPlaceholder id="archive" minHeight={1900} />}>
          <ArchaeologyArchive onOpenDetails={setSelectedArtifact} />
        </Suspense>

        {/* NASA data provenance: every dataset and what it is used for */}
        <Suspense fallback={<SectionPlaceholder id="data-sources" minHeight={1600} />}>
          <DataSources />
        </Suspense>

        {/* 15. For Young Explorers (Quiz, Match, Build a Mission) */}
        <Suspense fallback={<SectionPlaceholder id="explorers" minHeight={720} />}>
          <YoungExplorers onOpenMachine={handleSelectMachineById} />
        </Suspense>
      </main>

      {/* 16. Final Cinematic Section & Institutional Footer */}
      <Footer
        onScrollToTop={() => handleNavigate('hero')}
        onExploreAgain={() => handleNavigate('explore')}
      />

      {/* Full Archaeological Dossier Dialog Modal */}
      <MachineDetailModal
        artifact={selectedArtifact}
        onClose={handleCloseModal}
      />

      {/* Mission Control Ambient Soundscape Controller */}
      <SoundscapeController
        activePlanet={activePlanet}
        onSyncPlanet={setActivePlanet}
      />
    </div>
  );
}
