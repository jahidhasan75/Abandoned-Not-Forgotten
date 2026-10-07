import React, { useState, useMemo } from 'react';
import { MissionArtifact, Destination, MachineStatus } from '../types/mission';
import { MISSIONS_DATA } from '../data/missionsData';
import { spaceAudio } from '../utils/audio';
import { Archive, Search, Filter, ExternalLink, Globe, CheckCircle2 } from 'lucide-react';

interface ArchaeologyArchiveProps {
  onOpenDetails: (artifact: MissionArtifact) => void;
}

export const ArchaeologyArchive: React.FC<ArchaeologyArchiveProps> = ({ onOpenDetails }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<
    'ALL' | 'MOON' | 'MARS' | 'ROVER' | 'LANDER' | 'INSTRUMENT' | 'HISTORIC'
  >('ALL');

  const filteredArtifacts = useMemo(() => {
    return MISSIONS_DATA.filter((m) => {
      // Filter category
      let matchesFilter = true;
      if (activeFilter === 'MOON') matchesFilter = m.destination === 'MOON';
      else if (activeFilter === 'MARS') matchesFilter = m.destination === 'MARS';
      else if (activeFilter === 'ROVER') matchesFilter = m.category === 'ROVER';
      else if (activeFilter === 'LANDER') matchesFilter = m.category === 'LANDER';
      else if (activeFilter === 'INSTRUMENT') matchesFilter = m.category === 'INSTRUMENT';
      else if (activeFilter === 'HISTORIC') matchesFilter = m.status === 'HISTORIC';

      // Search query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.mission.toLowerCase().includes(q) ||
        m.locationName.toLowerCase().includes(q) ||
        m.artifactId.toLowerCase().includes(q) ||
        m.destination.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [searchQuery, activeFilter]);

  const filterButtons = [
    { id: 'ALL', label: 'All Artifacts' },
    { id: 'MOON', label: 'Moon' },
    { id: 'MARS', label: 'Mars' },
    { id: 'ROVER', label: 'Rovers' },
    { id: 'LANDER', label: 'Landers' },
    { id: 'INSTRUMENT', label: 'Instruments' },
    { id: 'HISTORIC', label: 'Historic Sites' },
  ] as const;

  return (
    <section id="archive" className="relative py-24 bg-[#05070B] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-hud tracking-widest text-[#62D9FF] mb-2">
              <Archive className="w-3.5 h-3.5" />
              <span>OFFICIAL HERITAGE CATALOG</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold font-hud uppercase tracking-tight text-white">
              The Archive
            </h2>
            <p className="mt-2 text-base text-[#8D98A8] max-w-xl font-light">
              Master index of extraterrestrial hardware cataloged under the 2026 Space Archaeology
              Initiative. Search by catalog ID, mission name, or planetary target.
            </p>
          </div>

          <div className="text-xs font-mono-data text-[#8D98A8]">
            CATALOG ITEMS: {filteredArtifacts.length} / {MISSIONS_DATA.length} RECORDED
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="p-4 sm:p-6 rounded-2xl bg-[#0B1018] border border-white/15 space-y-4 mb-8 shadow-xl">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#8D98A8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search a machine, mission, or destination (e.g. Sojourner, Apollo, Endeavour)..."
              className="w-full pl-11 pr-4 py-3 bg-[#05070B] border border-white/15 rounded-xl text-sm text-white placeholder-[#8D98A8] focus:outline-none focus:border-[#62D9FF] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#8D98A8] hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Pills / Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <Filter className="w-3.5 h-3.5 text-[#8D98A8] mr-1 shrink-0" />
            {filterButtons.map((btn) => (
              <button
                key={btn.id}
                onClick={() => {
                  spaceAudio.playTelemetryPing(850, 0.03);
                  setActiveFilter(btn.id);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-hud font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeFilter === btn.id
                    ? 'bg-white text-black shadow-sm'
                    : 'bg-white/5 text-[#8D98A8] hover:text-white hover:bg-white/10'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabular Archive Table */}
        <div className="rounded-2xl border border-white/15 bg-[#0B1018] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-[11px] font-mono-data text-[#8D98A8] uppercase tracking-wider">
                  <th className="py-3.5 px-6">Artifact ID</th>
                  <th className="py-3.5 px-6">Machine & Mission</th>
                  <th className="py-3.5 px-6">Destination</th>
                  <th className="py-3.5 px-6">Landing Year</th>
                  <th className="py-3.5 px-6">Coordinates / Site</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-mono-data">
                {filteredArtifacts.length > 0 ? (
                  filteredArtifacts.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => {
                        spaceAudio.playTelemetryPing(1000, 0.05);
                        onOpenDetails(item);
                      }}
                      className="hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-6 font-semibold text-[#62D9FF]">
                        {item.artifactId}
                      </td>
                      <td className="py-4 px-6 font-sans">
                        <span className="font-hud font-bold text-white block group-hover:text-[#62D9FF] transition-colors">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-[#8D98A8]">{item.mission}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`font-hud font-semibold uppercase text-xs ${
                            item.destination === 'MARS' ? 'text-[#B85C38]' : 'text-[#D9DDE3]'
                          }`}
                        >
                          {item.destination}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-white font-medium">
                        {item.landingYear} CE
                      </td>
                      <td className="py-4 px-6 text-[#8D98A8] font-sans">
                        <span className="block text-white text-xs">{item.locationName}</span>
                        <span className="text-[11px] text-[#8D98A8]">
                          {item.coordinates.lat}, {item.coordinates.lng}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 font-hud">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F3B562]" />
                          <span className="text-white font-semibold">{item.status}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            spaceAudio.playTelemetryPing(1000, 0.05);
                            onOpenDetails(item);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white font-hud text-xs transition-colors cursor-pointer"
                        >
                          <span>Inspect</span>
                          <ExternalLink className="w-3 h-3 text-[#62D9FF]" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#8D98A8]">
                      No artifacts matched your search query. Try adjusting terms.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
