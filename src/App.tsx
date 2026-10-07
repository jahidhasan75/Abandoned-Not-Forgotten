/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Destination, MissionArtifact } from './types/mission';
import { MISSIONS_DATA } from './data/missionsData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PlanetSelector } from './components/PlanetSelector';
import { ArchaeologyMap } from './components/ArchaeologyMap';
import { Timeline3D } from './components/Timeline3D';
import { MachineCards } from './components/MachineCards';
import { StatusSystem } from './components/StatusSystem';
import { OneMachineJourney } from './components/OneMachineJourney';
import { WhatDidItTeachUs } from './components/WhatDidItTeachUs';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { ScienceConstellation } from './components/ScienceConstellation';
import { HardwareAnatomy } from './components/HardwareAnatomy';
import { WhyLeaveItBehind } from './components/WhyLeaveItBehind';
import { ArchaeologyArchive } from './components/ArchaeologyArchive';
import { DidYouKnow } from './components/DidYouKnow';
import { YoungExplorers } from './components/YoungExplorers';
import { Footer } from './components/Footer';
import { MachineDetailModal } from './components/MachineDetailModal';
import { SoundscapeController } from './components/SoundscapeController';

export default function App() {
  const [activePlanet, setActivePlanet] = useState<Destination>('MARS');
  const [selectedArtifact, setSelectedArtifact] = useState<MissionArtifact | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectMachineById = (id: string) => {
    const found = MISSIONS_DATA.find((m) => m.id === id);
    if (found) {
      setSelectedArtifact(found);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] selection:bg-[#B85C38] selection:text-white relative">
      {/* Thin fixed gradient progress bar tracking scroll depth (#62D9FF to #B85C38) */}
      <div
        className="fixed top-0 left-0 right-0 h-[2.5px] z-[100] bg-white/5 pointer-events-none overflow-hidden"
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Scroll depth indicator"
      >
        <div
          className="h-full bg-gradient-to-r from-[#62D9FF] to-[#B85C38] shadow-[0_0_8px_rgba(98,217,255,0.6)] transition-[width] duration-100 ease-out will-change-[width]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

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
        />

        {/* 2. Interactive Planet Selector ("WHERE STORIES REMAIN") */}
        <PlanetSelector
          activePlanet={activePlanet}
          onSelectPlanet={setActivePlanet}
          onExplorePlanet={() => handleNavigate('archaeology-map')}
        />

        {/* 3. Space Archaeology Surface Map */}
        <ArchaeologyMap
          activePlanet={activePlanet}
          onSelectPlanet={setActivePlanet}
          onOpenDetails={setSelectedArtifact}
        />

        {/* 4. Immersive 3D Flight Timeline Feature (Three.js) */}
        <Timeline3D onOpenDetails={setSelectedArtifact} />

        {/* 5. "Meet the Machines" Story Cards */}
        <MachineCards
          onOpenDetails={setSelectedArtifact}
          activePlanetFilter={activePlanet}
        />

        {/* 6. Machine Status System */}
        <StatusSystem onSelectMachineId={handleSelectMachineById} />

        {/* 7. "One Machine. One Journey." Cinematic Timeline */}
        <OneMachineJourney />

        {/* 8. "What Did It Teach Us?" (Engineering, Science, Humanity) */}
        <WhatDidItTeachUs />

        {/* 9. Before & After Draggable Comparison Slider */}
        <BeforeAfterSlider />

        {/* 10. Science Impact Constellation */}
        <ScienceConstellation />

        {/* 11. Hardware Anatomy Interactive Subsystems */}
        <HardwareAnatomy />

        {/* 12. Why Leave It Behind? */}
        <WhyLeaveItBehind />

        {/* 13. Space Archaeology Master Archive */}
        <ArchaeologyArchive onOpenDetails={setSelectedArtifact} />

        {/* 14. Did You Know? Educational Fact Cards */}
        <DidYouKnow />

        {/* 15. For Young Explorers (Quiz, Match, Build a Mission) */}
        <YoungExplorers />
      </main>

      {/* 16. Final Cinematic Section & Institutional Footer */}
      <Footer
        onScrollToTop={() => handleNavigate('hero')}
        onExploreAgain={() => handleNavigate('explore')}
      />

      {/* Full Archaeological Dossier Dialog Modal */}
      <MachineDetailModal
        artifact={selectedArtifact}
        onClose={() => setSelectedArtifact(null)}
      />

      {/* Mission Control Ambient Soundscape Controller */}
      <SoundscapeController
        activePlanet={activePlanet}
        onSyncPlanet={setActivePlanet}
      />
    </div>
  );
}
