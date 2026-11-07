import React, { useState, useEffect } from 'react';
import { Destination, MissionArtifact } from '../types/mission';
import { MISSIONS_DATA } from '../data/missionsData';
import { spaceAudio } from '../utils/audio';
import { useI18n } from '../i18n/I18nProvider';
import { STATUS_COLORS } from '../data/status';
import { CatalogueTag } from './CatalogueTag';
import { ArrowRight } from 'lucide-react';

interface MachineCardsProps {
  onOpenDetails: (artifact: MissionArtifact) => void;
  activePlanetFilter?: Destination;
}

export const MachineCards: React.FC<MachineCardsProps> = ({ onOpenDetails, activePlanetFilter }) => {
  const { t, tx } = useI18n();
  const [filter, setFilter] = useState<'ALL' | 'MOON' | 'MARS' | 'ROVER' | 'LANDER' | 'INSTRUMENT' | 'PARTS'>(
    activePlanetFilter || 'ALL'
  );

  // Follow the global Moon/Mars switch, while still allowing local filters afterwards
  useEffect(() => {
    if (activePlanetFilter) setFilter(activePlanetFilter);
  }, [activePlanetFilter]);

  const filteredMachines = MISSIONS_DATA.filter((m) => {
    if (filter === 'ALL') return true;
    if (filter === 'MOON') return m.destination === 'MOON';
    if (filter === 'MARS') return m.destination === 'MARS';
    if (filter === 'ROVER') return m.category === 'ROVER';
    if (filter === 'LANDER') return m.category === 'LANDER' || m.category === 'HISTORIC_SITE';
    if (filter === 'INSTRUMENT') return m.category === 'INSTRUMENT';
    if (filter === 'PARTS') return m.category === 'ENTRY_HARDWARE' || m.category === 'IMPACT_SITE';
    return true;
  });

  const filterOptions = [
    { id: 'ALL', label: 'All Artifacts' },
    { id: 'MOON', label: 'Moon' },
    { id: 'MARS', label: 'Mars' },
    { id: 'ROVER', label: 'Rovers' },
    { id: 'LANDER', label: 'Landers' },
    { id: 'INSTRUMENT', label: 'Instruments' },
    { id: 'PARTS', label: 'Discarded parts' },
  ] as const;

  const handleCardClick = (machine: MissionArtifact) => {
    spaceAudio.playTelemetryPing(1080, 0.07);
    onOpenDetails(machine);
  };

  return (
    <section id="machines" className="relative py-12 sm:py-20 lg:py-24 bg-page border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="section-label">{t('cards.kicker')}</p>
            <h2 className="mt-2 text-2xl sm:text-3xl text-fg">{t('cards.title')}</h2>
            <p className="mt-3 text-base text-fg-2 max-w-xl">{t('cards.intro')}</p>
          </div>

          <div className="flex items-center gap-1 p-1 border border-line rounded-xl overflow-x-auto max-w-full" role="group" aria-label={t('cards.kicker')}>
            {filterOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  spaceAudio.playTelemetryPing(850, 0.04);
                  setFilter(opt.id);
                }}
                aria-pressed={filter === opt.id}
                className={`px-3 py-2 text-sm rounded-lg transition-colors whitespace-nowrap ${
                  filter === opt.id ? 'bg-raised text-fg' : 'text-fg-2 hover:text-fg'
                }`}
              >
                {t(`filter.${opt.id}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Catalogue: photo, object name, catalogue tag, status. Like a museum wall label. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {filteredMachines.map((machine) => (
            <div
              key={machine.id}
              onClick={() => handleCardClick(machine)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(machine);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={t('cards.open', { name: machine.name })}
              className="animate-fadeIn group cursor-pointer rounded-xl p-2 -m-2 transition-[background-color,transform] duration-200 hover:bg-card hover:-translate-y-0.5 focus-visible:bg-card focus-visible:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0"
            >
              <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-ink">
                <img
                  src={machine.image}
                  alt={machine.name}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02] group-focus-visible:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </div>

              <div className="pt-4 px-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-serif text-xl text-fg leading-snug">{machine.name}</h3>
                  <span className="mt-1.5 flex items-center gap-2 text-xs text-fg-2 shrink-0">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[machine.status] }} aria-hidden="true" />
                    {t(`status.${machine.status}`)}
                  </span>
                </div>
                <CatalogueTag artifact={machine} className="mt-1" />
                <p className="mt-3 text-sm text-fg-2">
                  {machine.mission} · {tx(machine, 'role')}
                </p>
                <p className="mt-2 text-base text-fg leading-relaxed">{tx(machine, 'hook')}</p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="catalogue-tag text-fg-3">{t('cards.photo', { id: machine.imageNasaId })}</span>
                  <span className="flex items-center gap-1 text-sm text-fg-2 group-hover:text-fg transition-colors" aria-hidden="true">
                    {t('cards.explore')}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" strokeWidth={1.5} />
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
