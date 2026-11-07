import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Destination, MissionArtifact } from '../types/mission';
import { MISSIONS_DATA } from '../data/missionsData';
import { STATUS_COLORS } from '../data/status';
import { spaceAudio } from '../utils/audio';
import { CatalogueTag } from './CatalogueTag';
import type { GlobeBody } from './PlanetGlobe';
import { useI18n } from '../i18n/I18nProvider';

// Three.js and the 4K textures load in their own chunk, only when this section is near view.
const PlanetGlobe = lazy(() => import('./PlanetGlobe'));

interface PlanetSelectorProps {
  activePlanet: Destination;
  onSelectPlanet: (planet: Destination) => void;
  onOpenDetails: (artifact: MissionArtifact) => void;
}

// Text for each world lives in strings.json (globe.tagline.*, globe.distance.*, globe.credit.*)
const BODY_INFO: Record<GlobeBody, { gravity: string; creditUrl: string }> = {
  EARTH: { gravity: '1.000 g', creditUrl: 'https://nasa-gibs.github.io/gibs-api-docs/' },
  MOON: { gravity: '0.166 g', creditUrl: 'https://trek.nasa.gov/moon/' },
  MARS: { gravity: '0.379 g', creditUrl: 'https://trek.nasa.gov/mars/' },
};

const TABS: GlobeBody[] = ['EARTH', 'MOON', 'MARS'];

export const PlanetSelector: React.FC<PlanetSelectorProps> = ({ activePlanet, onSelectPlanet, onOpenDetails }) => {
  const { t, tx } = useI18n();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [view, setView] = useState<GlobeBody>('EARTH');
  const [nearView, setNearView] = useState(false);
  const [hovered, setHovered] = useState<MissionArtifact | null>(null);
  const [selected, setSelected] = useState<MissionArtifact | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const hasLaunched = useRef(false);
  const [seen, setSeen] = useState(false);
  const [globeReady, setGlobeReady] = useState(false);

  // Mount the globe shortly before the section scrolls into view; the first time it is
  // actually visible, fly from Earth to the active destination.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const preload = new IntersectionObserver(([e]) => e.isIntersecting && setNearView(true), { rootMargin: '600px' });
    const launch = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.45 });
    preload.observe(el);
    launch.observe(el);
    return () => {
      preload.disconnect();
      launch.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The opening journey: once the section is on screen AND the NASA mosaics have loaded,
  // hold on Earth for a moment, then fly to the active destination.
  const activePlanetRef = useRef(activePlanet);
  activePlanetRef.current = activePlanet;
  useEffect(() => {
    if (!seen || !globeReady || hasLaunched.current) return;
    const id = window.setTimeout(() => {
      if (hasLaunched.current) return;
      hasLaunched.current = true;
      setView((v) => (v === 'EARTH' ? activePlanetRef.current : v));
    }, 1400);
    return () => window.clearTimeout(id);
  }, [seen, globeReady]);

  // Follow the global Moon/Mars switch (navbar, map, etc.)
  useEffect(() => {
    if (hasLaunched.current) setView(activePlanet);
    setSelected(null);
  }, [activePlanet]);

  const goTo = (body: GlobeBody) => {
    spaceAudio.playTelemetryPing(body === 'EARTH' ? 760 : body === 'MOON' ? 880 : 1020, 0.06);
    hasLaunched.current = true;
    setSelected(null);
    setFocusId(null);
    setView(body);
    if (body !== 'EARTH') onSelectPlanet(body);
  };

  const pickArtifact = (artifact: MissionArtifact) => {
    setSelected(artifact);
    setFocusId(null);
    // re-set so picking the same artifact twice still re-centres it
    window.requestAnimationFrame(() => setFocusId(artifact.id));
  };

  const sites = view === 'EARTH' ? [] : MISSIONS_DATA.filter((m) => m.destination === view);
  const info = BODY_INFO[view];
  const label = hovered ?? selected;

  return (
    <section ref={sectionRef} id="explore" className="relative py-12 sm:py-20 lg:py-24 bg-page border-t border-line overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <p className="section-label">{t('globe.kicker')}</p>
            <h2 className="mt-2 text-2xl sm:text-3xl text-fg">{t('globe.title')}</h2>
            <p className="mt-3 text-base text-fg-2 max-w-xl">
              {t('globe.intro')}
            </p>
          </div>

          <div role="tablist" aria-label={t('globe.tabsAria')} className="inline-flex items-center p-1 border border-line rounded-xl self-start md:self-auto">
            {TABS.map((id) => {
              const tab = { id };
              const count = tab.id === 'EARTH' ? null : MISSIONS_DATA.filter((m) => m.destination === tab.id).length;
              const active = view === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => goTo(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                    active ? 'bg-raised text-fg' : 'text-fg-2 hover:text-fg'
                  }`}
                >
                  {t(`body.${tab.id}`)}
                  {count !== null && <span className="font-mono-data text-fg-2">{count}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Globe stage + site list */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 relative h-112 sm:h-140 rounded-2xl border border-line bg-ink overflow-hidden">
            {nearView ? (
              <Suspense fallback={<div className="absolute inset-0 bg-card/60" />}>
                <PlanetGlobe
                  view={view}
                  focusArtifactId={focusId}
                  onHoverArtifact={setHovered}
                  onPickArtifact={pickArtifact}
                  onReady={() => setGlobeReady(true)}
                />
              </Suspense>
            ) : (
              <div className="absolute inset-0 bg-card/60" />
            )}

            {/* Overlay: current world */}
            <div className="absolute top-4 left-4 pointer-events-none bg-page/85 border border-line rounded-lg px-3 py-2 max-w-[75%]">
              <div className="font-serif text-fg text-lg leading-tight">{t(`body.name.${view}`)}</div>
              <div className="text-xs text-fg-2">{t(`globe.tagline.${view}`)}</div>
              <div className="mt-1 flex flex-wrap gap-x-3 text-xs font-mono-data text-fg-2">
                <span>{t(`globe.distance.${view}`)}</span>
                <span>{t('globe.gravity', { g: info.gravity })}</span>
                {view !== 'EARTH' && <span>{t('globe.sites', { n: sites.length })}</span>}
              </div>
            </div>

            {/* Hover / selection label */}
            {label && (
              <div className="absolute top-4 right-4 pointer-events-none bg-page/90 border border-line rounded-lg px-3 py-2 text-xs max-w-[55%]">
                <div className="font-medium text-fg">{label.name}</div>
                <div className="font-mono-data text-fg-2">
                  {label.coordinates.lat}, {label.coordinates.lng}
                </div>
              </div>
            )}

            {/* Interaction hint + credit */}
            <div className="absolute bottom-3 left-4 right-4 flex flex-wrap items-end justify-between gap-2 text-xs font-mono-data text-fg-2 pointer-events-none">
              <span className="bg-page/80 rounded px-2 py-1">{t('globe.hint')}</span>
              <a
                href={info.creditUrl}
                target="_blank"
                rel="noreferrer"
                className="pointer-events-auto bg-page/80 rounded px-2 py-1 hover:text-fg underline decoration-line-strong underline-offset-2 transition-colors"
              >
                {t(`globe.credit.${view}`)}
              </a>
            </div>
          </div>

          {/* Site list (keyboard-accessible twin of the globe markers) */}
          <aside className="lg:col-span-4 rounded-2xl border border-line bg-card p-5 flex flex-col max-h-140">
            {view === 'EARTH' ? (
              <div className="flex-1 flex flex-col justify-center gap-3 text-sm text-fg-2">
                <p className="text-fg-2">{t('globe.earthIntro')}</p>
                <button onClick={() => goTo('MOON')} className="btn-secondary w-full">
                  {t('globe.flyMoon')}
                </button>
                <button onClick={() => goTo('MARS')} className="btn-secondary w-full">
                  {t('globe.flyMars')}
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-sm text-fg-2 mb-3">
                  {t('globe.hardwareOn', { body: t(`body.name.${view}`) })}
                </h3>
                <ul className="space-y-1 overflow-y-auto pr-1 flex-1">
                  {sites.map((m) => {
                    const isSel = selected?.id === m.id;
                    return (
                      <li key={m.id}>
                        <button
                          onClick={() => {
                            spaceAudio.playTelemetryPing(1100, 0.06);
                            pickArtifact(m);
                          }}
                          onMouseEnter={() => setHovered(m)}
                          onMouseLeave={() => setHovered(null)}
                          aria-pressed={isSel}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-3 ${
                            isSel ? 'bg-raised' : 'hover:bg-raised'
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLORS[m.status] }} aria-hidden="true" />
                          <span className="flex-1 min-w-0">
                            <span className="block text-fg truncate">{m.name}</span>
                            <span className="block text-xs text-fg-2">
                              {m.landingYear} · {t(`status.${m.status}`)}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {selected && (
                  <div className="mt-4 pt-4 border-t border-line">
                    <CatalogueTag artifact={selected} />
                    <p className="text-sm text-fg-2 mt-2 line-clamp-3">{tx(selected, 'statusDescription')}</p>
                    <button onClick={() => onOpenDetails(selected)} className="btn-primary mt-4 w-full">
                      {t('globe.openDossier')}
                    </button>
                  </div>
                )}
              </>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
};
