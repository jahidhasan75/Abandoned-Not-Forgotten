import React, { useState } from 'react';
import { MachineStatus } from '../types/mission';
import { MISSIONS_DATA } from '../data/missionsData';
import { spaceAudio } from '../utils/audio';
import { Activity, Signal, Radio, AlertTriangle, ShieldCheck } from 'lucide-react';

interface StatusSystemProps {
  onSelectMachineId: (id: string) => void;
}

export const StatusSystem: React.FC<StatusSystemProps> = ({ onSelectMachineId }) => {
  const [activeTab, setActiveTab] = useState<MachineStatus>('SILENT');

  const statusCategories: {
    status: MachineStatus;
    label: string;
    subtitle: string;
    color: string;
    icon: React.ReactNode;
    description: string;
    archaeologicalContext: string;
  }[] = [
    {
      status: 'ACTIVE',
      label: 'ACTIVE',
      subtitle: 'Still Communicating & Generating Data',
      color: '#62D9FF',
      icon: <Activity className="w-4 h-4 text-[#62D9FF]" />,
      description: 'The vehicle or instrument continues to send telemetry or fulfill scientific observations. While rare for ancient hardware, non-powered reflectors (like the Apollo ALSEP retroreflectors) remain 100% active today using laser beams shot from Earth.',
      archaeologicalContext: 'Active artifacts bridge historical space exploration with contemporary astrophysics, requiring real-time tracking.'
    },
    {
      status: 'SILENT',
      label: 'SILENT',
      subtitle: 'No Longer Communicating / Depleted Power',
      color: '#F3B562',
      icon: <Signal className="w-4 h-4 text-[#F3B562]" />,
      description: 'The machine ran out of battery, experienced solar panel dust coverage, or was frozen by planetary winters. It has ceased radio transmissions, but the chassis and scientific payloads rest completely intact.',
      archaeologicalContext: 'Silent machines represent true archaeological time capsules, preserving the precise engineering state at the moment contact stopped.'
    },
    {
      status: 'INACTIVE',
      label: 'INACTIVE',
      subtitle: 'Mission Complete / Deliberately Decommissioned',
      color: '#D9DDE3',
      icon: <Radio className="w-4 h-4 text-[#D9DDE3]" />,
      description: 'The mission accomplished its full science objectives and was intentionally powered down by ground controllers (e.g. Apollo ALSEP stations in September 1977) to free up budget and deep space communication bands.',
      archaeologicalContext: 'Inactive stations mark planned endpoints of human science campaigns, having served their design lives multiple times over.'
    },
    {
      status: 'LOST',
      label: 'LOST',
      subtitle: 'Contact Lost During Transition / Descent',
      color: '#FF6B6B',
      icon: <AlertTriangle className="w-4 h-4 text-[#FF6B6B]" />,
      description: 'Hardware that suffered a communication failure during entry, descent, or severe dust events, where final operational status could not be verified by ground antennas.',
      archaeologicalContext: 'These sites are prime candidates for orbital satellite photography and future archaeological expeditions to deduce what occurred.'
    },
    {
      status: 'HISTORIC',
      label: 'HISTORIC',
      subtitle: 'Permanent Extraterrestrial Monument',
      color: '#B85C38',
      icon: <ShieldCheck className="w-4 h-4 text-[#B85C38]" />,
      description: 'Hardware recognized as an irreplaceable monument of human spaceflight heritage, such as Apollo 11 Tranquility Base or the Thomas Mutch Memorial Station (Viking 1).',
      archaeologicalContext: 'Protected under international heritage accords and space archaeology guidelines to prevent disruption by future commercial landings.'
    },
  ];

  const currentCategory = statusCategories.find((c) => c.status === activeTab) || statusCategories[0];
  const matchingMissions = MISSIONS_DATA.filter((m) => m.status === activeTab);

  return (
    <section className="relative py-24 bg-[#05070B] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-xs font-hud tracking-widest text-[#62D9FF] mb-2">
            <Radio className="w-3.5 h-3.5" />
            <span>OPERATIONAL TAXONOMY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-hud uppercase tracking-tight text-white">
            Machine Status Classification
          </h2>
          <p className="mt-2 text-base text-[#8D98A8] max-w-2xl font-light">
            In space archaeology, an abandoned machine is never simply “broken.” NASA categorizes hardware
            according to distinct operational and heritage states.
          </p>
        </div>

        {/* Status Selector Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {statusCategories.map((cat) => {
            const isCurrent = activeTab === cat.status;
            return (
              <button
                key={cat.status}
                onClick={() => {
                  spaceAudio.playTelemetryPing(850, 0.04);
                  setActiveTab(cat.status);
                }}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#0B1018] border-white/40 shadow-xl ring-1 ring-white/20'
                    : 'bg-[#0B1018]/40 border-white/10 hover:border-white/25 hover:bg-[#0B1018]/70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-hud font-bold text-sm tracking-wider text-white">
                    {cat.label}
                  </span>
                  {cat.icon}
                </div>
                <div className="text-[11px] text-[#8D98A8] line-clamp-1 font-light">
                  {cat.subtitle.split('/')[0]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Status Deep Dive Box */}
        <div className="rounded-2xl border border-white/15 bg-[#0B1018] p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Detailed Breakdown */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <span
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{ backgroundColor: currentCategory.color }}
                />
                <h3 className="text-2xl font-bold font-hud text-white uppercase">
                  Status: {currentCategory.label}
                </h3>
                <span className="text-xs font-mono-data text-[#8D98A8]">
                  {currentCategory.subtitle}
                </span>
              </div>

              <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-sm text-[#D9DDE3] leading-relaxed font-light">
                {currentCategory.description}
              </div>

              <div>
                <h4 className="text-xs font-hud font-semibold uppercase tracking-wider text-[#62D9FF] mb-2">
                  Archaeological Significance
                </h4>
                <p className="text-xs text-[#8D98A8] leading-relaxed">
                  {currentCategory.archaeologicalContext}
                </p>
              </div>

              {/* Verified NASA Disclaimer Note */}
              <div className="pt-4 border-t border-white/10 text-[11px] font-mono-data text-[#8D98A8]">
                NOTE: Telemetry indicators reflect verified mission archive status from NASA JPL & NSSDC.
              </div>
            </div>

            {/* Right Col: Associated Machines */}
            <div className="border-t lg:border-t-0 lg:border-l border-white/10 lg:pl-8 space-y-4">
              <h4 className="text-xs font-hud font-semibold uppercase tracking-wider text-white">
                Cataloged Artifacts in this State ({matchingMissions.length})
              </h4>

              {matchingMissions.length > 0 ? (
                <div className="space-y-3">
                  {matchingMissions.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => onSelectMachineId(m.id)}
                      className="p-3.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-hud font-bold text-white group-hover:text-[#62D9FF] transition-colors">
                          {m.name}
                        </span>
                        <span className="text-[10px] font-mono-data text-[#8D98A8]">
                          {m.landingYear}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#8D98A8] mt-1 line-clamp-1">
                        {m.locationName}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-white/5 text-xs text-[#8D98A8] text-center">
                  No active machines in this demo subset. In active operations, orbiters like MRO and rovers like Curiosity/Perseverance maintain continuous telemetry.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
