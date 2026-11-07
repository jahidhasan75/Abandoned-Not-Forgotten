import React, { useEffect, useState } from 'react';
import { Destination, MissionArtifact } from '../types/mission';
import { MISSIONS_DATA } from '../data/missionsData';
import { spaceAudio } from '../utils/audio';
import { STATUS_COLORS } from '../data/status';
import { useI18n } from '../i18n/I18nProvider';
import { X, ChevronRight, Play, Pause } from 'lucide-react';
import { CatalogueTag } from './CatalogueTag';
import moonMap from '../assets/textures/moon_2k.webp';
import marsMap from '../assets/textures/mars_2k.webp';

interface ArchaeologyMapProps {
  activePlanet: Destination;
  onSelectPlanet: (p: Destination) => void;
  onOpenDetails: (artifact: MissionArtifact) => void;
}

export const ArchaeologyMap: React.FC<ArchaeologyMapProps> = ({
  activePlanet,
  onSelectPlanet,
  onOpenDetails,
}) => {
  const { t, tx, txScience } = useI18n();
  const [selectedArtifact, setSelectedArtifact] = useState<MissionArtifact | null>(null);
  const [hoveredArtifact, setHoveredArtifact] = useState<MissionArtifact | null>(null);

  // Year scrubber: show only hardware left behind up to the chosen year
  const leftYear = (m: MissionArtifact) => Number(m.leftBehind.slice(0, 4));
  const allYears = MISSIONS_DATA.map(leftYear);
  const minYear = Math.min(...allYears);
  const maxYear = Math.max(...allYears);
  const [yearCutoff, setYearCutoff] = useState<number>(maxYear);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setYearCutoff((y) => {
        if (y >= maxYear) {
          setPlaying(false);
          return maxYear;
        }
        return y + 1;
      });
    }, 320);
    return () => window.clearInterval(id);
  }, [playing, maxYear]);

  const togglePlay = () => {
    spaceAudio.playTelemetryPing(1000, 0.05);
    if (!playing && yearCutoff >= maxYear) setYearCutoff(minYear);
    setPlaying((p) => !p);
  };

  const planetArtifacts = MISSIONS_DATA.filter((m) => m.destination === activePlanet);
  const filteredArtifacts = planetArtifacts.filter((m) => leftYear(m) <= yearCutoff);
  const eventYears = Array.from(new Set(planetArtifacts.map(leftYear))).sort((a, b) => a - b);

  // Map latitude/longitude to SVG viewport percentage (0 to 100%)
  // Longitude: -180 to 180 -> 0% to 100%
  // Latitude: 90 to -90 -> 0% to 100%
  const getCoordinatesPct = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    // The basemap is a full equirectangular mosaic, so positions map 1:1 (no clamping).
    return { x, y };
  };

  // Several artifacts share one landing site (Apollo 11 + its retroreflector, Surveyor 3 +
  // the Apollo 12 ALSEP). Fan overlapping markers out sideways so each can be clicked; the
  // dossier still shows the true coordinates.
  const markerPositions = new Map<string, { x: number; y: number }>();
  const placed: { x: number; y: number }[] = [];
  filteredArtifacts.forEach((artifact) => {
    const base = getCoordinatesPct(artifact.coordinates.latNum, artifact.coordinates.lngNum);
    const neighbours = placed.filter((p) => Math.abs(p.x - base.x) < 4 && Math.abs(p.y - base.y) < 7).length;
    // Each extra marker stacks below the previous one, clear of its label
    const pos = neighbours === 0 ? base : { x: base.x + neighbours * 1.5, y: base.y + neighbours * 11 };
    placed.push(base);
    markerPositions.set(artifact.id, pos);
  });

  const handleMarkerClick = (artifact: MissionArtifact) => {
    spaceAudio.playTelemetryPing(1100, 0.08);
    setSelectedArtifact(artifact);
  };

  return (
    <section id="archaeology-map" className="relative py-12 sm:py-20 lg:py-24 bg-ink border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <p className="section-label">{t('map.kicker')}</p>
            <h2 className="mt-2 text-2xl sm:text-3xl text-fg">{t('map.title')}</h2>
            <p className="mt-3 text-base text-fg-2 max-w-2xl">
              {t('map.intro')}
            </p>
          </div>

          {/* Planet Switcher Controls */}
          <div className="flex items-center gap-3">
            <div className="inline-flex p-1 border border-line rounded-xl">
              <button
                onClick={() => {
                  spaceAudio.playTelemetryPing(850, 0.05);
                  onSelectPlanet('MOON');
                  setSelectedArtifact(null);
                }}
                aria-pressed={activePlanet === 'MOON'}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  activePlanet === 'MOON' ? 'bg-raised text-fg' : 'text-fg-2 hover:text-fg'
                }`}
              >
                {t('map.moonSurface')}
              </button>
              <button
                onClick={() => {
                  spaceAudio.playTelemetryPing(1000, 0.05);
                  onSelectPlanet('MARS');
                  setSelectedArtifact(null);
                }}
                aria-pressed={activePlanet === 'MARS'}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  activePlanet === 'MARS' ? 'bg-raised text-fg' : 'text-fg-2 hover:text-fg'
                }`}
              >
                {t('map.marsSurface')}
              </button>
            </div>
          </div>
        </div>

        {/* Map Container Stage */}
        <div className="relative rounded-2xl border border-line bg-card overflow-hidden min-h-144 flex flex-col lg:flex-row">
          {/* Main Interactive Map Area */}
          <div className="relative flex-1 bg-ink flex flex-col justify-center">
           <div className="relative w-full aspect-[2/1] overflow-hidden">
            {/* Real NASA global mosaic (equirectangular: -180..180 lon, 90..-90 lat) */}
            <div className="absolute inset-0 pointer-events-none">
              <img
                src={activePlanet === 'MOON' ? moonMap : marsMap}
                alt={
                  activePlanet === 'MOON'
                    ? 'Global map of the Moon from the LRO LROC Wide Angle Camera mosaic'
                    : 'Global colour map of Mars from the Viking MDIM 2.1 mosaic'
                }
                loading="lazy"
                decoding="async"
                className="w-full h-full object-fill"
              />
              <div className="absolute inset-0 bg-ink/20" />
            </div>

            {/* 15-degree graticule, equator and prime meridian */}
            <svg viewBox="0 0 360 180" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
              {Array.from({ length: 23 }, (_, i) => (i + 1) * 15).map((x) => (
                <line key={`v${x}`} x1={x} y1={0} x2={x} y2={180} stroke="rgba(238,240,245,0.12)" strokeWidth={0.3} vectorEffect="non-scaling-stroke" />
              ))}
              {Array.from({ length: 11 }, (_, i) => (i + 1) * 15).map((y) => (
                <line key={`h${y}`} x1={0} y1={y} x2={360} y2={y} stroke="rgba(238,240,245,0.12)" strokeWidth={0.3} vectorEffect="non-scaling-stroke" />
              ))}
              <line x1={0} y1={90} x2={360} y2={90} stroke="rgba(238,240,245,0.32)" strokeWidth={1} strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
              <line x1={180} y1={0} x2={180} y2={180} stroke="rgba(238,240,245,0.32)" strokeWidth={1} strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
            </svg>

            {/* Map labels */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-3 text-xs text-fg-2 bg-page/85 px-2 py-1 rounded">
              <span className="text-fg">{activePlanet === 'MOON' ? t('map.lunar') : t('map.areographic')}</span>
              <span className="hidden md:inline">{t('map.projection')}</span>
              <span className="hidden sm:inline">{t('map.grid')}</span>
            </div>

            <div className="absolute top-3 right-3 z-10 text-xs font-mono-data text-fg-2 bg-page/85 px-2 py-1 rounded">
              <span>
                {t('map.sitesBy', { n: filteredArtifacts.length, total: planetArtifacts.length, year: yearCutoff })}
              </span>
            </div>

            {/* Interactive Markers */}
            {filteredArtifacts.map((artifact) => {
              const pos = markerPositions.get(artifact.id)!;
              const isSelected = selectedArtifact?.id === artifact.id;
              const isHovered = hoveredArtifact?.id === artifact.id;

              return (
                <div
                  key={artifact.id}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  {/* Tooltip on Hover */}
                  {isHovered && !isSelected && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-page border border-line-strong rounded-lg text-left text-xs pointer-events-none z-30">
                      <div className="text-fg truncate">{artifact.name}</div>
                      <div className="text-fg-2 text-xs flex items-center gap-2 mt-0.5">
                        <span>{artifact.mission}</span>
                        <span>·</span>
                        <span>{artifact.landingYear}</span>
                      </div>
                      <div className="catalogue-tag mt-1">
                        {artifact.coordinates.lat}, {artifact.coordinates.lng}
                      </div>
                    </div>
                  )}

                  {/* Marker Pin Button */}
                  <button
                    onClick={() => handleMarkerClick(artifact)}
                    onMouseEnter={() => setHoveredArtifact(artifact)}
                    onMouseLeave={() => setHoveredArtifact(null)}
                    aria-label={`Inspect ${artifact.name}`}
                    aria-pressed={isSelected}
                    className="relative flex items-center justify-center w-8 h-8 rounded-full"
                  >
                    {/* Status dot with a dark keyline so it reads on any terrain; the selected
                        marker gets a light outer ring. */}
                    <span
                      className={`block w-3 h-3 rounded-full ring-2 ring-ink ${isSelected ? 'outline-2 outline-offset-2 outline-fg' : ''}`}
                      style={{ backgroundColor: STATUS_COLORS[artifact.status] }}
                    />
                  </button>

                  {/* Marker Tag Text */}
                  <span
                    className={`absolute top-full left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-xs whitespace-nowrap pointer-events-none transition-colors ${
                      isSelected ? 'bg-fg text-ink' : 'hidden sm:block bg-page/85 text-fg-2'
                    }`}
                  >
                    {artifact.shortName ?? artifact.name.split(' ')[0]}
                  </span>
                </div>
              );
            })}

            {/* Bottom Scale & Orientation */}
            <div className="absolute bottom-3 left-3 z-10 text-xs text-fg-2 bg-page/85 px-2 py-1 rounded">
              {t('map.datum')}
            </div>
           </div>

            {/* Timeline scrubber: filter by the year each object was left behind */}
            <div className="px-4 py-3 border-t border-line flex items-center gap-3">
              <button
                onClick={togglePlay}
                aria-label={playing ? t('map.pause') : t('map.play')}
                className="shrink-0 p-2 rounded-lg border border-line text-fg hover:bg-raised transition-colors"
              >
                {playing ? <Pause className="w-4 h-4" strokeWidth={1.5} /> : <Play className="w-4 h-4" strokeWidth={1.5} />}
              </button>
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <input
                    type="range"
                    min={minYear}
                    max={maxYear}
                    step={1}
                    value={yearCutoff}
                    onChange={(e) => {
                      setPlaying(false);
                      setYearCutoff(Number(e.target.value));
                    }}
                    aria-label={t('map.sliderAria')}
                    aria-valuetext={`Up to ${yearCutoff}: ${filteredArtifacts.length} sites`}
                    className="w-full accent-accent cursor-pointer"
                  />
                  {/* ticks for the years something was left on this world */}
                  <div className="relative h-2 mx-2" aria-hidden="true">
                    {eventYears.map((y) => (
                      <span
                        key={y}
                        className={`absolute top-0 w-px h-2 -translate-x-1/2 ${y <= yearCutoff ? 'bg-fg-2' : 'bg-line-strong'}`}
                        style={{ left: `${((y - minYear) / (maxYear - minYear)) * 100}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-between text-xs font-mono-data text-fg-2">
                  <span>{minYear}</span>
                  <span className="text-fg">{t('map.leftBy', { year: yearCutoff })}</span>
                  <span>{maxYear}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dossier Side Panel */}
          <div className="w-full lg:w-96 xl:w-104 bg-card border-t lg:border-t-0 lg:border-l border-line p-6 flex flex-col justify-between overflow-y-auto max-h-156">
            {selectedArtifact ? (
              <div className="space-y-5 animate-fadeIn">
                {/* Dossier Header */}
                <div className="flex items-start justify-between gap-3 pb-4 border-b border-line">
                  <div>
                    <h3 className="font-serif text-2xl text-fg leading-tight">{selectedArtifact.name}</h3>
                    <p className="text-sm text-fg-2 mt-1">{selectedArtifact.mission}</p>
                    <CatalogueTag artifact={selectedArtifact} className="mt-2" />
                  </div>
                  <button
                    onClick={() => setSelectedArtifact(null)}
                    aria-label={t('map.close')}
                    className="p-2 rounded-lg text-fg-2 hover:text-fg hover:bg-raised transition-colors"
                  >
                    <X className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>

                {/* Status Indicator (Anti-slop text styling) */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLORS[selectedArtifact.status] }} aria-hidden="true" />
                  <span className="text-fg">{t(`status.${selectedArtifact.status}`)}</span>
                  <span className="text-fg-2">·</span>
                  <span className="text-fg-2">{tx(selectedArtifact, 'statusDescription')}</span>
                </div>

                {/* Key Metrics Grid */}
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-fg-2 text-xs">{t('map.landingYear')}</dt>
                    <dd className="text-fg font-mono-data mt-1">{selectedArtifact.landingYear}</dd>
                  </div>
                  <div>
                    <dt className="text-fg-2 text-xs">{t('map.lastContact')}</dt>
                    <dd className="text-fg font-mono-data mt-1">{selectedArtifact.lastContactYear}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-fg-2 text-xs">{t('map.coordinates')}</dt>
                    <dd className="text-fg mt-1">
                      <span className="font-mono-data">{selectedArtifact.coordinates.lat}, {selectedArtifact.coordinates.lng}</span>{' '}
                      <span className="text-fg-2">({tx(selectedArtifact, 'locationName')})</span>
                    </dd>
                  </div>
                </dl>

                {/* Archaeological Story */}
                <div>
                  <h4 className="text-xs text-fg-2 mb-1">{t('map.summary')}</h4>
                  <p className="text-sm text-fg leading-relaxed">
                    {tx(selectedArtifact, 'story')}
                  </p>
                </div>

                {/* Science Contribution */}
                <div>
                  <h4 className="text-xs text-fg-2 mb-2">{t('map.science')}</h4>
                  <ul className="space-y-2 text-sm text-fg list-disc pl-4 marker:text-fg-3">
                    {txScience(selectedArtifact).map((sc, i) => (
                      <li key={i}>{sc}</li>
                    ))}
                  </ul>
                </div>

                {/* Full Dossier Deep Dive Button */}
                <button
                  onClick={() => onOpenDetails(selectedArtifact)}
                  className="btn-primary w-full"
                >
                  {t('map.openFull')}
                </button>
              </div>
            ) : (
              <div className="h-full flex flex-col justify-center text-fg-2 space-y-4">
                <div>
                  <h4 className="font-serif text-xl text-fg">{t('map.selectTitle')}</h4>
                  <p className="text-sm mt-2 text-fg-2 max-w-xs">
                    {t('map.selectBody')}
                  </p>
                </div>
                {filteredArtifacts.length > 0 && (
                  <div className="pt-2 w-full text-left space-y-1">
                    <span className="text-xs text-fg-2 block mb-2">{t('map.quick')}</span>
                    {filteredArtifacts.slice(0, 3).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleMarkerClick(item)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-raised text-sm text-fg flex items-center justify-between transition-colors"
                      >
                        <span className="truncate">{item.name}</span>
                        <ChevronRight className="w-4 h-4 text-fg-3" strokeWidth={1.5} aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
