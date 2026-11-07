import React, { useState } from 'react';
import { MachineStatus } from '../types/mission';
import { MISSIONS_DATA } from '../data/missionsData';
import { spaceAudio } from '../utils/audio';
import { useI18n } from '../i18n/I18nProvider';
import { STATUS_COLORS } from '../data/status';

interface StatusSystemProps {
  onSelectMachineId: (id: string) => void;
}

export const StatusSystem: React.FC<StatusSystemProps> = ({ onSelectMachineId }) => {
  const { t, tx } = useI18n();
  const [activeTab, setActiveTab] = useState<MachineStatus>('SILENT');

  const statusCategories: {
    status: MachineStatus;
    label: string;
    subtitle: string;
    description: string;
    archaeologicalContext: string;
  }[] = [
    {
      status: 'ACTIVE',
      label: 'ACTIVE',
      subtitle: 'Still Communicating & Generating Data',
      description: 'The vehicle or instrument continues to send telemetry or fulfill scientific observations. While rare for ancient hardware, non-powered reflectors (like the Apollo ALSEP retroreflectors) remain 100% active today using laser beams shot from Earth.',
      archaeologicalContext: 'Active artifacts bridge historical space exploration with contemporary astrophysics, requiring real-time tracking.'
    },
    {
      status: 'SILENT',
      label: 'SILENT',
      subtitle: 'No Longer Communicating / Depleted Power',
      description: 'The machine ran out of battery, experienced solar panel dust coverage, or was frozen by planetary winters. It has ceased radio transmissions, but the chassis and scientific payloads rest completely intact.',
      archaeologicalContext: 'Silent machines represent true archaeological time capsules, preserving the precise engineering state at the moment contact stopped.'
    },
    {
      status: 'INACTIVE',
      label: 'INACTIVE',
      subtitle: 'Mission Complete / Deliberately Decommissioned',
      description: 'The mission accomplished its full science objectives and was intentionally powered down by ground controllers (e.g. Apollo ALSEP stations in September 1977) to free up budget and deep space communication bands.',
      archaeologicalContext: 'Inactive stations mark planned endpoints of human science campaigns, having served their design lives multiple times over.'
    },
    {
      status: 'LOST',
      label: 'LOST',
      subtitle: 'Contact Lost During Transition / Descent',
      description: 'Hardware that suffered a communication failure during entry, descent, or severe dust events, where final operational status could not be verified by ground antennas.',
      archaeologicalContext: 'These sites are prime candidates for orbital satellite photography and future archaeological expeditions to deduce what occurred.'
    },
    {
      status: 'HISTORIC',
      label: 'HISTORIC',
      subtitle: 'Permanent Extraterrestrial Monument',
      description: 'Hardware recognized as an irreplaceable monument of human spaceflight heritage, such as Apollo 11 Tranquility Base or the Thomas Mutch Memorial Station (Viking 1).',
      archaeologicalContext: 'Protected under international heritage accords and space archaeology guidelines to prevent disruption by future commercial landings.'
    },
  ];

  const currentCategory = statusCategories.find((c) => c.status === activeTab) || statusCategories[0];
  const matchingMissions = MISSIONS_DATA.filter((m) => m.status === activeTab);

  return (
    <section className="relative py-12 sm:py-20 lg:py-24 bg-page border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="section-label">{t('status.kicker')}</p>
          <h2 className="mt-2 text-2xl sm:text-3xl text-fg">{t('status.title')}</h2>
          <p className="mt-3 text-base text-fg-2 max-w-2xl">{t('status.intro')}</p>
        </div>

        {/* A legend on the left (dot + word, like a map key), the chosen state on the right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <ul className="lg:col-span-4 border-y border-line divide-y divide-line" role="list">
            {statusCategories.map((cat) => {
              const isCurrent = activeTab === cat.status;
              return (
                <li key={cat.status}>
                  <button
                    onClick={() => {
                      spaceAudio.playTelemetryPing(850, 0.04);
                      setActiveTab(cat.status);
                    }}
                    aria-pressed={isCurrent}
                    className={`relative w-full text-left pl-4 pr-3 py-4 flex items-start gap-3 transition-colors ${
                      isCurrent ? 'bg-state-sel' : 'hover:bg-state-hover'
                    }`}
                  >
                    {/* The chosen state: a violet bar on the left edge (team palette) */}
                    <span
                      className={`absolute left-0 inset-y-0 w-1 bg-state-bar transition-opacity ${isCurrent ? 'opacity-100' : 'opacity-0'}`}
                      aria-hidden="true"
                    />
                    <span className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLORS[cat.status] }} aria-hidden="true" />
                    <span className="flex-1 min-w-0">
                      <span className={`block text-base ${isCurrent ? 'text-fg' : 'text-fg-2'}`}>{t(`status.${cat.status}`)}</span>
                      <span className="block text-sm text-fg-2 mt-0.5">{t(`status.sub.${cat.status}`)}</span>
                    </span>
                    <span className={`font-mono-data text-xs mt-1 text-fg-2`}>
                      {MISSIONS_DATA.filter((m) => m.status === cat.status).length}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-3">
              <h3 className="font-serif text-2xl text-fg flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[currentCategory.status] }} aria-hidden="true" />
                {t(`status.${currentCategory.status}`)}
              </h3>
              <p className="mt-4 text-base text-fg leading-relaxed">{t(`status.desc.${currentCategory.status}`)}</p>
              <h4 className="mt-6 text-sm text-fg-2">{t('status.significance')}</h4>
              <p className="mt-2 text-base text-fg-2 leading-relaxed">{t(`status.sig.${currentCategory.status}`)}</p>
              <p className="mt-6 pt-4 border-t border-line text-xs text-fg-2">{t('status.note')}</p>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-sm text-fg-2 mb-3">{t('status.inState', { n: matchingMissions.length })}</h4>
              {matchingMissions.length > 0 ? (
                <ul className="space-y-1">
                  {matchingMissions.map((m) => (
                    <li key={m.id}>
                      <button
                        type="button"
                        onClick={() => onSelectMachineId(m.id)}
                        className="block w-full text-left px-3 py-2 -mx-3 rounded-lg hover:bg-card transition-colors"
                      >
                        <span className="flex items-baseline justify-between gap-3">
                          <span className="text-sm text-fg">{m.name}</span>
                          <span className="text-xs font-mono-data text-fg-2">{m.landingYear}</span>
                        </span>
                        <span className="block text-xs text-fg-2 mt-0.5 line-clamp-1">{tx(m, 'locationName')}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-fg-2">
                  No active machines in this demo subset. In active operations, orbiters like MRO and rovers like Curiosity/Perseverance maintain continuous telemetry.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
