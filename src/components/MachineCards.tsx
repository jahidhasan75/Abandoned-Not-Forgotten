import React, { useState } from 'react';
import { Destination, MissionArtifact } from '../types/mission';
import { MISSIONS_DATA } from '../data/missionsData';
import { spaceAudio } from '../utils/audio';
import { ArrowUpRight, Cpu } from 'lucide-react';

interface MachineCardsProps {
  onOpenDetails: (artifact: MissionArtifact) => void;
  activePlanetFilter?: Destination;
}

export const MachineCards: React.FC<MachineCardsProps> = ({ onOpenDetails, activePlanetFilter }) => {
  const [filter, setFilter] = useState<'ALL' | 'MOON' | 'MARS' | 'ROVER' | 'LANDER' | 'INSTRUMENT'>(
    activePlanetFilter || 'ALL'
  );

  const filteredMachines = MISSIONS_DATA.filter((m) => {
    if (filter === 'ALL') return true;
    if (filter === 'MOON') return m.destination === 'MOON';
    if (filter === 'MARS') return m.destination === 'MARS';
    if (filter === 'ROVER') return m.category === 'ROVER';
    if (filter === 'LANDER') return m.category === 'LANDER' || m.category === 'HISTORIC_SITE';
    if (filter === 'INSTRUMENT') return m.category === 'INSTRUMENT';
    return true;
  });

  const filterOptions = [
    { id: 'ALL', label: 'All Artifacts' },
    { id: 'MOON', label: 'Moon' },
    { id: 'MARS', label: 'Mars' },
    { id: 'ROVER', label: 'Rovers' },
    { id: 'LANDER', label: 'Landers' },
    { id: 'INSTRUMENT', label: 'Instruments' },
  ] as const;

  const handleCardClick = (machine: MissionArtifact) => {
    spaceAudio.playTelemetryPing(1080, 0.07);
    onOpenDetails(machine);
  };

  return (
    <section id="machines" className="relative py-24 bg-[#05070B] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-hud tracking-widest text-[#62D9FF] mb-2">
              <Cpu className="w-3.5 h-3.5" />
              <span>PRIMARY ARTIFACT REGISTRY</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold font-hud uppercase tracking-tight text-white">
              Meet the Machines
            </h2>
            <p className="mt-2 text-base text-[#8D98A8] max-w-xl font-light">
              Each machine was forged to test the boundary of human capability. Here is the hardware that
              laid the cornerstone of solar system archaeology.
            </p>
          </div>

          {/* Interactive Filter Tabs (functional buttons) */}
          <div className="flex items-center gap-1 p-1 bg-[#0B1018] border border-white/20 rounded-xl overflow-x-auto max-w-full">
            {filterOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  spaceAudio.playTelemetryPing(850, 0.04);
                  setFilter(opt.id);
                }}
                className={`px-4 py-2 text-xs font-hud font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  filter === opt.id
                    ? 'bg-white text-[#05070B] shadow-sm'
                    : 'text-[#8D98A8] hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Artifact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredMachines.map((machine) => (
            <div
              key={machine.id}
              onClick={() => handleCardClick(machine)}
              className="group relative rounded-xl border border-white/15 bg-[#0B1018] hover:border-white/40 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1"
            >
              {/* Top Image Preview Banner */}
              <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-[#07090e]">
                <img
                  src={machine.image}
                  alt={machine.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75 group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1018] via-transparent to-black/40" />

                {/* Top Corner Unboxed Metadata Overlay */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono-data text-white/90">
                  <span className="bg-[#05070B]/80 px-2 py-0.5 rounded border border-white/10 backdrop-blur-sm">
                    {machine.artifactId}
                  </span>
                  <span className="bg-[#05070B]/80 px-2 py-0.5 rounded border border-white/10 backdrop-blur-sm">
                    {machine.landingYear} CE
                  </span>
                </div>

                {/* Demo Label badge as required by prompt */}
                <div className="absolute bottom-2 left-3 text-[10px] font-mono-data text-[#8D98A8] bg-[#05070B]/80 px-2 py-0.5 rounded">
                  DEMO ARCHAEOLOGICAL RECONSTRUCTION
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  {/* Clean unboxed metadata kicker */}
                  <div className="flex items-center gap-2 text-xs font-mono-data text-[#8D98A8] mb-1.5">
                    <span className={machine.destination === 'MARS' ? 'text-[#B85C38]' : 'text-[#D9DDE3]'}>
                      {machine.destination}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{machine.mission}</span>
                    <span aria-hidden="true">·</span>
                    <span>{machine.role}</span>
                  </div>

                  {/* Machine Title */}
                  <h3 className="text-xl font-bold font-hud text-white group-hover:text-[#62D9FF] transition-colors leading-snug">
                    {machine.name}
                  </h3>

                  {/* Story Excerpt */}
                  <p className="mt-3 text-xs text-[#8D98A8] leading-relaxed line-clamp-3 font-light">
                    {machine.story}
                  </p>
                </div>

                {/* Science Made Possible Highlights */}
                <div className="pt-3 border-t border-white/10">
                  <span className="text-[10px] font-hud uppercase tracking-wider text-[#62D9FF] block mb-1.5">
                    Science Made Possible:
                  </span>
                  <ul className="space-y-1 text-xs text-[#D9DDE3] font-light">
                    {machine.scienceContribution.slice(0, 2).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 line-clamp-1">
                        <span className="text-[#62D9FF]">›</span>
                        <span className="truncate">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Card Footer */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  {/* Status Indicator */}
                  <div className="flex items-center gap-1.5 font-hud">
                    <span className="w-2 h-2 rounded-full bg-[#F3B562]" />
                    <span className="font-semibold text-white tracking-wider">{machine.status}</span>
                  </div>

                  <span className="inline-flex items-center gap-1 font-hud text-xs text-[#62D9FF] group-hover:text-white transition-colors">
                    <span>EXPLORE DOSSIER</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
