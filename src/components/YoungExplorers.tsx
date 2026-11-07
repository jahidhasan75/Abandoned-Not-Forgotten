import React, { useMemo, useState } from 'react';
import { Check } from 'lucide-react';
import { spaceAudio } from '../utils/audio';
import { useI18n } from '../i18n/I18nProvider';
import { MISSIONS_DATA } from '../data/missionsData';
import { shuffle } from '../lib/quizPick';
import { QuizPanel } from './Quiz';
import { TeacherKit } from './TeacherKit';

interface YoungExplorersProps {
  onOpenMachine: (id: string) => void;
}

type Tab = 'QUIZ' | 'MATCH' | 'BUILDER' | 'TEACHERS';
const TABS = [
  { id: 'QUIZ', key: 'explorers.tab.quiz' },
  { id: 'MATCH', key: 'explorers.tab.match' },
  { id: 'BUILDER', key: 'explorers.tab.builder' },
  { id: 'TEACHERS', key: 'explorers.tab.teachers' },
] as const satisfies readonly { id: Tab; key: string }[];

/** Match the machine: each pair is an archive object and a fact from its dossier. */
const MATCH_PAIRS = [
  { id: 'sojourner', machine: 'Sojourner', discovery: 'match.d.sojourner' },
  { id: 'spirit', machine: 'Spirit', discovery: 'match.d.spirit' },
  { id: 'insight', machine: 'InSight', discovery: 'match.d.insight' },
  { id: 'apollo15-lrv', machine: 'Apollo 15 LRV', discovery: 'match.d.lrv' },
] as const;

type Dest = 'MOON' | 'MARS';
type Power = 'SOLAR' | 'RTG';
type Vehicle = 'ROVER' | 'LANDER';
type Instrument = 'DRILL' | 'SEIS' | 'APXS';
const INSTRUMENT_KEY = { DRILL: 'drill', SEIS: 'seis', APXS: 'apxs' } as const;

/** One choice button in Build a mission. */
const Choice: React.FC<{ selected: boolean; onClick: () => void; title: string; note: string }> = ({ selected, onClick, title, note }) => (
  <button
    type="button"
    onClick={() => {
      spaceAudio.playTelemetryPing(850, 0.04);
      onClick();
    }}
    aria-pressed={selected}
    className={`p-3.5 rounded-xl border text-left transition-colors ${
      selected ? 'bg-raised border-line-strong text-fg' : 'border-line text-fg-2 hover:bg-raised'
    }`}
  >
    <span className="block text-sm text-fg">{title}</span>
    <span className="block mt-0.5 text-xs text-fg-2">{note}</span>
  </button>
);

export const YoungExplorers: React.FC<YoungExplorersProps> = ({ onOpenMachine }) => {
  const { t, lang } = useI18n();
  const num = (n: number) => n.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US');
  const [activeTab, setActiveTab] = useState<Tab>('QUIZ');

  // ---------- Match the machine ----------
  const [round, setRound] = useState(0);
  const discoveries = useMemo(() => shuffle(MATCH_PAIRS, Math.random), [round]);
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [matchError, setMatchError] = useState(false);

  const pickMachine = (id: string) => {
    if (matched.includes(id)) return;
    spaceAudio.playTelemetryPing(850, 0.04);
    setSelectedMachine(id);
    setMatchError(false);
  };
  const pickDiscovery = (id: string) => {
    if (!selectedMachine) return;
    if (selectedMachine === id) {
      spaceAudio.playTelemetryPing(1100, 0.08);
      setMatched((m) => [...m, id]);
      setSelectedMachine(null);
      setMatchError(false);
    } else {
      spaceAudio.playTelemetryPing(400, 0.08);
      setMatchError(true);
    }
  };
  const resetMatch = () => {
    spaceAudio.playTelemetryPing(900, 0.05);
    setMatched([]);
    setSelectedMachine(null);
    setMatchError(false);
    setRound((r) => r + 1);
  };

  // ---------- Build a mission ----------
  const [dest, setDest] = useState<Dest>('MARS');
  const [power, setPower] = useState<Power>('SOLAR');
  const [vehicle, setVehicle] = useState<Vehicle>('ROVER');
  const [instrument, setInstrument] = useState<Instrument>('DRILL');
  const [launched, setLaunched] = useState(false);

  const similar = MISSIONS_DATA.filter((m) => m.destination === dest && m.category === vehicle);
  const label = {
    dest: dest === 'MOON' ? t('builder.moon') : t('builder.mars'),
    power: power === 'SOLAR' ? t('builder.solar') : t('builder.rtg'),
    vehicle: vehicle === 'ROVER' ? t('builder.rover') : t('builder.lander'),
    instrument: t(`builder.${INSTRUMENT_KEY[instrument]}`),
  };

  return (
    <section id="explorers" className="relative py-12 sm:py-20 lg:py-24 bg-page border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="section-label">{t('explorers.kicker')}</p>
            <h2 className="mt-2 text-2xl sm:text-3xl text-fg">{t('explorers.title')}</h2>
            <p className="mt-3 text-base text-fg-2 max-w-xl">{t('explorers.intro')}</p>
          </div>

          <div className="flex flex-wrap items-center gap-1 p-1 border border-line rounded-xl self-start md:self-auto" role="group" aria-label={t('explorers.tabsAria')}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  spaceAudio.playTelemetryPing(850, 0.04);
                  setActiveTab(tab.id);
                }}
                aria-pressed={activeTab === tab.id}
                className={`px-4 py-2 text-sm rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id ? 'bg-raised text-fg' : 'text-fg-2 hover:text-fg'
                }`}
              >
                {t(tab.key)}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'QUIZ' && <QuizPanel onOpenMachine={onOpenMachine} />}

        {activeTab === 'MATCH' && (
          <div className="rounded-2xl border border-line bg-card p-6 sm:p-10 max-w-4xl mx-auto space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-line text-sm text-fg-2">
              <span className="text-fg">{t('match.title')}</span>
              <span>{t('match.count', { n: num(matched.length), total: num(MATCH_PAIRS.length) })}</span>
            </div>

            <p aria-live="polite" className={`text-sm text-center ${matchError ? 'text-fg' : 'sr-only'}`}>
              {matchError ? t('match.wrong') : ''}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <span className="text-sm text-fg-2 block">{t('match.step1')}</span>
                {MATCH_PAIRS.map((p) => {
                  const done = matched.includes(p.id);
                  const selected = selectedMachine === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => pickMachine(p.id)}
                      disabled={done}
                      aria-pressed={selected}
                      className={`w-full p-4 rounded-xl border text-left text-sm transition-colors flex items-center justify-between ${
                        done ? 'border-accent text-fg' : selected ? 'bg-raised border-line-strong text-fg' : 'border-line hover:bg-raised text-fg'
                      }`}
                    >
                      <span>{p.machine}</span>
                      {done && <Check className="w-4 h-4 text-accent" strokeWidth={1.5} aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-3">
                <span className="text-sm text-fg-2 block">{t('match.step2')}</span>
                {discoveries.map((p) => {
                  const done = matched.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => pickDiscovery(p.id)}
                      disabled={done || !selectedMachine}
                      className={`w-full p-4 rounded-xl border text-left text-sm transition-colors flex items-center justify-between gap-3 disabled:cursor-default ${
                        done ? 'border-accent text-fg' : 'border-line hover:bg-raised text-fg-2'
                      }`}
                    >
                      <span>{t(p.discovery)}</span>
                      {done && <Check className="w-4 h-4 shrink-0 text-accent" strokeWidth={1.5} aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {matched.length === MATCH_PAIRS.length && (
              <div className="pt-6 border-t border-line text-center space-y-3 animate-fadeIn" aria-live="polite">
                <p className="font-serif text-2xl text-fg">{t('match.done')}</p>
                <button onClick={resetMatch} className="btn-primary">
                  {t('match.again')}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'BUILDER' && (
          <div className="rounded-2xl border border-line bg-card p-6 sm:p-10 max-w-4xl mx-auto space-y-8">
            <div>
              <p className="section-label">{t('explorers.tab.builder')}</p>
              <h3 className="mt-2 font-serif text-2xl sm:text-3xl text-fg">{t('builder.title')}</h3>
              <p className="text-sm text-fg-2 mt-2">{t('builder.intro')}</p>
            </div>

            {!launched ? (
              <div className="space-y-6">
                <fieldset className="space-y-2">
                  <legend className="text-sm text-fg-2 mb-2">{t('builder.dest')}</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Choice selected={dest === 'MOON'} onClick={() => setDest('MOON')} title={t('builder.moon')} note={t('builder.moon.note')} />
                    <Choice selected={dest === 'MARS'} onClick={() => setDest('MARS')} title={t('builder.mars')} note={t('builder.mars.note')} />
                  </div>
                </fieldset>
                <fieldset className="space-y-2">
                  <legend className="text-sm text-fg-2 mb-2">{t('builder.power')}</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Choice selected={power === 'SOLAR'} onClick={() => setPower('SOLAR')} title={t('builder.solar')} note={t('builder.solar.note')} />
                    <Choice selected={power === 'RTG'} onClick={() => setPower('RTG')} title={t('builder.rtg')} note={t('builder.rtg.note')} />
                  </div>
                </fieldset>
                <fieldset className="space-y-2">
                  <legend className="text-sm text-fg-2 mb-2">{t('builder.vehicle')}</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Choice selected={vehicle === 'ROVER'} onClick={() => setVehicle('ROVER')} title={t('builder.rover')} note={t('builder.rover.note')} />
                    <Choice selected={vehicle === 'LANDER'} onClick={() => setVehicle('LANDER')} title={t('builder.lander')} note={t('builder.lander.note')} />
                  </div>
                </fieldset>
                <fieldset className="space-y-2">
                  <legend className="text-sm text-fg-2 mb-2">{t('builder.instrument')}</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(['DRILL', 'SEIS', 'APXS'] as const).map((id) => (
                      <Choice
                        key={id}
                        selected={instrument === id}
                        onClick={() => setInstrument(id)}
                        title={t(`builder.${INSTRUMENT_KEY[id]}`)}
                        note={t(`builder.${INSTRUMENT_KEY[id]}.note`)}
                      />
                    ))}
                  </div>
                </fieldset>

                <div className="pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-fg-2">{t('builder.hint')}</p>
                  <button
                    onClick={() => {
                      spaceAudio.playTelemetryPing(1200, 0.1);
                      setLaunched(true);
                    }}
                    className="btn-primary"
                  >
                    {t('builder.launch')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 sm:p-8 rounded-2xl bg-raised border border-line space-y-6 animate-fadeIn">
                <div className="text-center">
                  <p className="text-sm text-fg-2">{t('builder.ready')}</p>
                  <h4 className="font-serif text-3xl text-fg mt-1">{t('builder.name')}</h4>
                </div>

                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-sm p-4 rounded-xl bg-card border border-line">
                  {(['dest', 'power', 'vehicle', 'instrument'] as const).map((k) => (
                    <div key={k}>
                      <dt className="text-xs text-fg-2">{t(`builder.l.${k}`)}</dt>
                      <dd className="text-fg mt-0.5">{label[k]}</dd>
                    </div>
                  ))}
                </dl>

                <p className="text-sm text-fg-2 max-w-xl mx-auto text-center">{t('builder.compare')}</p>

                <div className="max-w-2xl mx-auto">
                  <h5 className="text-sm text-fg-2">{t('builder.similar')}</h5>
                  {similar.length > 0 ? (
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {similar.map((m) => (
                        <li key={m.id}>
                          <button
                            type="button"
                            onClick={() => {
                              spaceAudio.playTelemetryPing(1080, 0.07);
                              onOpenMachine(m.id);
                            }}
                            className="px-3 py-1.5 rounded-lg border border-line bg-card text-sm text-fg hover:border-line-strong transition-colors"
                          >
                            {m.name} <span className="font-mono-data text-xs text-fg-2">{m.landingYear}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-fg-2">{t('builder.none')}</p>
                  )}
                </div>

                <div className="text-center">
                  <button
                    onClick={() => {
                      spaceAudio.playTelemetryPing(900, 0.05);
                      setLaunched(false);
                    }}
                    className="btn-secondary"
                  >
                    {t('builder.again')}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'TEACHERS' && <TeacherKit />}
      </div>
    </section>
  );
};
