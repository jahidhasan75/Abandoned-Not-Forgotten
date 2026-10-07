import React, { useState } from 'react';
import { Destination } from '../types/mission';
import { MISSIONS_DATA } from '../data/missionsData';
import { spaceAudio } from '../utils/audio';
import { Globe, ArrowRight, Radio } from 'lucide-react';
import { ASSET_IMAGES } from '../assets/images';

interface PlanetSelectorProps {
  activePlanet: Destination;
  onSelectPlanet: (planet: Destination) => void;
  onExplorePlanet: (planet: Destination) => void;
}

export const PlanetSelector: React.FC<PlanetSelectorProps> = ({
  activePlanet,
  onSelectPlanet,
  onExplorePlanet,
}) => {
  const [hoveredPlanet, setHoveredPlanet] = useState<Destination | null>(null);

  const moonCount = MISSIONS_DATA.filter((m) => m.destination === 'MOON').length;
  const marsCount = MISSIONS_DATA.filter((m) => m.destination === 'MARS').length;

  const handleSelect = (planet: Destination) => {
    spaceAudio.playTelemetryPing(planet === 'MOON' ? 880 : 1020, 0.06);
    onSelectPlanet(planet);
    onExplorePlanet(planet);
  };

  return (
    <section id="explore" className="relative py-24 bg-[#05070B] border-t border-white/10 overflow-hidden">
      {/* Ambient background glow according to active planet */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
          activePlanet === 'MARS' ? 'mars-radial-glow opacity-100' : 'moon-radial-glow opacity-100'
        }`}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-hud tracking-widest text-[#62D9FF] mb-2">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>PLANETARY EXPLORATION SECTOR</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold font-hud uppercase tracking-tight text-white">
              Where Stories Remain
            </h2>
            <p className="mt-2 text-base text-[#8D98A8] max-w-xl font-light">
              Select a world to examine the hardware preserved across alien soils. Two celestial bodies,
              dozens of robotic outposts, one shared human journey.
            </p>
          </div>

          {/* Interactive Toggle Pill-free Segmented Control */}
          <div className="inline-flex items-center p-1.5 bg-[#0B1018] border border-white/20 rounded-xl self-start md:self-auto">
            <button
              onClick={() => handleSelect('MOON')}
              className={`px-6 py-2.5 rounded-lg font-hud text-sm font-semibold tracking-wider transition-all cursor-pointer ${
                activePlanet === 'MOON'
                  ? 'bg-[#D9DDE3] text-[#05070B] shadow-md shadow-white/10'
                  : 'text-[#8D98A8] hover:text-white'
              }`}
            >
              MOON ({moonCount})
            </button>
            <button
              onClick={() => handleSelect('MARS')}
              className={`px-6 py-2.5 rounded-lg font-hud text-sm font-semibold tracking-wider transition-all cursor-pointer ${
                activePlanet === 'MARS'
                  ? 'bg-[#B85C38] text-white shadow-md shadow-[#B85C38]/20'
                  : 'text-[#8D98A8] hover:text-white'
              }`}
            >
              MARS ({marsCount})
            </button>
          </div>
        </div>

        {/* Two Giant Planetary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* THE MOON */}
          <div
            onMouseEnter={() => setHoveredPlanet('MOON')}
            onMouseLeave={() => setHoveredPlanet(null)}
            onClick={() => handleSelect('MOON')}
            className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-500 min-h-[440px] flex flex-col justify-between p-8 sm:p-10 ${
              activePlanet === 'MOON'
                ? 'border-[#D9DDE3]/60 bg-[#0B1018]/90 ring-1 ring-[#D9DDE3]/40 shadow-2xl shadow-white/5'
                : 'border-white/10 bg-[#0B1018]/50 hover:border-white/30'
            }`}
          >
            {/* Background Texture & Image */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <img
                src={ASSET_IMAGES.moonLander}
                alt="Moon lunar landscape with Apollo descent stage"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center opacity-40 group-hover:opacity-55 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1018] via-[#0B1018]/70 to-transparent" />
            </div>

            {/* Top Card Bar */}
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <span className="text-xs font-mono-data text-[#8D98A8] tracking-widest uppercase">
                  DESTINATION // 01 · 384,400 KM FROM EARTH
                </span>
                <h3 className="text-3xl sm:text-4xl font-bold font-hud text-[#D9DDE3] uppercase mt-1">
                  The Moon
                </h3>
              </div>
              <div className="p-3 rounded-full bg-white/5 border border-white/15 text-[#D9DDE3]">
                <Globe className="w-6 h-6" />
              </div>
            </div>

            {/* Middle Coordinates & Teaser */}
            <div className="relative z-10 my-6 space-y-3">
              <p className="text-lg text-white/90 font-light italic">
                “Silent machines beneath the lunar sky.”
              </p>
              <p className="text-sm text-[#8D98A8] max-w-md font-light">
                Preserved in the airless lunar vacuum where footprints and tire tracks remain unchanged for
                eons. Home to Apollo descent stages, electric rovers, and laser reflectors.
              </p>

              {/* Coordinates & Metadata */}
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono-data text-[#8D98A8]">
                <span>0.67° N, 23.47° E (Tranquility)</span>
                <span aria-hidden="true">·</span>
                <span>Gravity: 0.166 g</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#62D9FF]">{moonCount} Cataloged Artifacts</span>
              </div>
            </div>

            {/* Bottom Action Button */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-hud tracking-wider text-[#8D98A8] group-hover:text-white transition-colors">
                APOLLO 11 TO 17 · SURVEYOR · ALSEP
              </span>
              <div className="inline-flex items-center gap-2 font-hud text-sm font-semibold tracking-wider text-[#D9DDE3] group-hover:text-white group-hover:translate-x-1 transition-all">
                <span>{hoveredPlanet === 'MOON' ? 'EXPLORE MOON' : 'EXAMINE LUNAR SITES'}</span>
                <ArrowRight className="w-4 h-4 text-[#62D9FF]" />
              </div>
            </div>
          </div>

          {/* MARS */}
          <div
            onMouseEnter={() => setHoveredPlanet('MARS')}
            onMouseLeave={() => setHoveredPlanet(null)}
            onClick={() => handleSelect('MARS')}
            className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-500 min-h-[440px] flex flex-col justify-between p-8 sm:p-10 ${
              activePlanet === 'MARS'
                ? 'border-[#B85C38]/70 bg-[#0B1018]/90 ring-1 ring-[#B85C38]/40 shadow-2xl shadow-[#B85C38]/10'
                : 'border-white/10 bg-[#0B1018]/50 hover:border-white/30'
            }`}
          >
            {/* Background Texture & Image */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <img
                src={ASSET_IMAGES.marsOpportunity}
                alt="Mars planetary dunes with rover memorial"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center opacity-40 group-hover:opacity-55 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1018] via-[#0B1018]/70 to-transparent" />
            </div>

            {/* Top Card Bar */}
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <span className="text-xs font-mono-data text-[#8D98A8] tracking-widest uppercase">
                  DESTINATION // 02 · 225,000,000 KM AVERAGE DISTANCE
                </span>
                <h3 className="text-3xl sm:text-4xl font-bold font-hud text-[#B85C38] uppercase mt-1">
                  Mars
                </h3>
              </div>
              <div className="p-3 rounded-full bg-[#B85C38]/15 border border-[#B85C38]/30 text-[#B85C38]">
                <Globe className="w-6 h-6" />
              </div>
            </div>

            {/* Middle Coordinates & Teaser */}
            <div className="relative z-10 my-6 space-y-3">
              <p className="text-lg text-white/90 font-light italic">
                “Robotic explorers frozen in time.”
              </p>
              <p className="text-sm text-[#8D98A8] max-w-md font-light">
                Resting under rusty skies and whispering dust devils. Small mechanical scouts that drove
                marathons, climbed alien peaks, and tasted fossil riverbeds.
              </p>

              {/* Coordinates & Metadata */}
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono-data text-[#8D98A8]">
                <span>2.28° S, 5.23° W (Endeavour)</span>
                <span aria-hidden="true">·</span>
                <span>Gravity: 0.379 g</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#B85C38]">{marsCount} Cataloged Artifacts</span>
              </div>
            </div>

            {/* Bottom Action Button */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-hud tracking-wider text-[#8D98A8] group-hover:text-white transition-colors">
                SOJOURNER · SPIRIT · OPPORTUNITY · INSIGHT
              </span>
              <div className="inline-flex items-center gap-2 font-hud text-sm font-semibold tracking-wider text-[#B85C38] group-hover:text-white group-hover:translate-x-1 transition-all">
                <span>{hoveredPlanet === 'MARS' ? 'EXPLORE MARS' : 'EXAMINE MARTIAN ROVERS'}</span>
                <ArrowRight className="w-4 h-4 text-[#B85C38]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
