import React, { useState, useMemo, useEffect } from 'react';
import { MissionArtifact, Destination, MachineStatus } from '../types/mission';
import { MISSIONS_DATA } from '../data/missionsData';
import { spaceAudio } from '../utils/audio';
import { useI18n } from '../i18n/I18nProvider';
import { STATUS_COLORS } from '../data/status';
import { Search } from 'lucide-react';

interface ArchaeologyArchiveProps {
  onOpenDetails: (artifact: MissionArtifact) => void;
}

export const ArchaeologyArchive: React.FC<ArchaeologyArchiveProps> = ({ onOpenDetails }) => {
  const { t, tx } = useI18n();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<
    'ALL' | 'MOON' | 'MARS' | 'ROVER' | 'LANDER' | 'INSTRUMENT' | 'HISTORIC' | 'PARTS'
  >('ALL');

  const filteredArtifacts = useMemo(() => {
    return MISSIONS_DATA.filter((m) => {
      // Filter category
      let matchesFilter = true;
      if (activeFilter === 'MOON') matchesFilter = m.destination === 'MOON';
      else if (activeFilter === 'MARS') matchesFilter = m.destination === 'MARS';
      else if (activeFilter === 'ROVER') matchesFilter = m.category === 'ROVER';
      else if (activeFilter === 'LANDER')
        matchesFilter = m.category === 'LANDER' || m.category === 'HISTORIC_SITE';
      else if (activeFilter === 'INSTRUMENT') matchesFilter = m.category === 'INSTRUMENT';
      else if (activeFilter === 'PARTS')
        matchesFilter = m.category === 'ENTRY_HARDWARE' || m.category === 'IMPACT_SITE';
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

  // Six rows first; a search or "Show all" shows every match. A new filter starts collapsed again.
  const PREVIEW = 6;
  const [expanded, setExpanded] = useState(false);
  useEffect(() => setExpanded(false), [activeFilter]);
  const searching = searchQuery.trim() !== '';
  const rows = expanded || searching ? filteredArtifacts : filteredArtifacts.slice(0, PREVIEW);

  const filterButtons = [
    { id: 'ALL', label: 'All Artifacts' },
    { id: 'MOON', label: 'Moon' },
    { id: 'MARS', label: 'Mars' },
    { id: 'ROVER', label: 'Rovers' },
    { id: 'LANDER', label: 'Landers' },
    { id: 'INSTRUMENT', label: 'Instruments' },
    { id: 'PARTS', label: 'Discarded parts' },
    { id: 'HISTORIC', label: 'Historic Sites' },
  ] as const;

  return (
    <section id="archive" className="relative py-12 sm:py-20 lg:py-24 bg-page border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="section-label">{t('archive.kicker')}</p>
            <h2 className="mt-2 text-2xl sm:text-3xl text-fg">
              {t('archive.title')}
            </h2>
            <p className="mt-3 text-base text-fg-2 max-w-xl">
              {t('archive.intro')}
            </p>
          </div>

          <div className="text-xs font-mono-data text-fg-2">
            {t('archive.count', { n: filteredArtifacts.length, total: MISSIONS_DATA.length })}
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="space-y-4 mb-6">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-fg-2" strokeWidth={1.5} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('archive.search')}
              aria-label={t('archive.search')}
              className="w-full pl-11 pr-16 py-3 bg-card border border-line rounded-lg text-base text-fg placeholder-fg-3 focus:outline-none focus:border-line-strong transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-fg-2 hover:text-fg transition-colors"
              >
                {t('archive.clear')}
              </button>
            )}
          </div>

          {/* Filter Pills / Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1" role="group" aria-label={t('archive.kicker')}>
            {filterButtons.map((btn) => (
              <button
                key={btn.id}
                onClick={() => {
                  spaceAudio.playTelemetryPing(850, 0.03);
                  setActiveFilter(btn.id);
                }}
                aria-pressed={activeFilter === btn.id}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors whitespace-nowrap ${
                  activeFilter === btn.id ? 'bg-raised text-fg' : 'text-fg-2 hover:text-fg'
                }`}
              >
                {t(`filter.${btn.id}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Tabular Archive Table */}
        <div className="border-y border-line">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-line text-xs text-fg-2">
                  <th className="py-3 px-4 font-normal">{t('archive.col.id')}</th>
                  <th className="py-3 px-4 font-normal">{t('archive.col.machine')}</th>
                  <th className="py-3 px-4 font-normal">{t('archive.col.dest')}</th>
                  <th className="py-3 px-4 font-normal">{t('archive.col.year')}</th>
                  <th className="py-3 px-4 font-normal">{t('archive.col.site')}</th>
                  <th className="py-3 px-4 font-normal">{t('archive.col.status')}</th>
                  <th className="py-3 px-4 font-normal text-right">{t('archive.col.dossier')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-sm">
                {filteredArtifacts.length > 0 ? (
                  rows.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => {
                        spaceAudio.playTelemetryPing(1000, 0.05);
                        onOpenDetails(item);
                      }}
                      className="hover:bg-card transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 font-mono-data text-xs text-fg-2 whitespace-nowrap">{item.artifactId}</td>
                      <td className="py-3 px-4">
                        <span className="text-fg block">{item.name}</span>
                        <span className="text-xs text-fg-2">{item.mission}</span>
                      </td>
                      <td className="py-3 px-4 text-fg-2">{t(`body.${item.destination}`)}</td>
                      <td className="py-3 px-4 font-mono-data text-fg">{item.landingYear}</td>
                      <td className="py-3 px-4">
                        <span className="block text-fg-2 text-xs">{tx(item, 'locationName')}</span>
                        <span className="font-mono-data text-xs text-fg-2">
                          {item.coordinates.lat}, {item.coordinates.lng}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[item.status] }} aria-hidden="true" />
                          <span className="text-fg">{t(`status.${item.status}`)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            spaceAudio.playTelemetryPing(1000, 0.05);
                            onOpenDetails(item);
                          }}
                          className="px-3 py-1.5 rounded-lg border border-line text-fg text-sm hover:bg-raised transition-colors"
                        >
                          {t('archive.inspect')}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-fg-2">
                      {t('archive.empty')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {!searching && filteredArtifacts.length > PREVIEW && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => {
                spaceAudio.playTelemetryPing(900, 0.05);
                if (expanded) document.getElementById('archive')?.scrollIntoView({ block: 'start' });
                setExpanded((v) => !v);
              }}
              aria-expanded={expanded}
              className="btn-secondary"
            >
              {expanded ? t('archive.showFewer') : t('archive.showAll', { n: filteredArtifacts.length })}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
