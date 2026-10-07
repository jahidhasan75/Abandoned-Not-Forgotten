import React, { useState } from 'react';
import { Destination, MissionArtifact } from '../types/mission';
import { MISSIONS_DATA } from '../data/missionsData';
import { spaceAudio } from '../utils/audio';
import { MapPin, Crosshair, X, ExternalLink, Calendar, Map as MapIcon, ChevronRight } from 'lucide-react';
import { ASSET_IMAGES } from '../assets/images';

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
  const [selectedArtifact, setSelectedArtifact] = useState<MissionArtifact | null>(null);
  const [hoveredArtifact, setHoveredArtifact] = useState<MissionArtifact | null>(null);

  const filteredArtifacts = MISSIONS_DATA.filter((m) => m.destination === activePlanet);

  // Map latitude/longitude to SVG viewport percentage (0 to 100%)
  // Longitude: -180 to 180 -> 0% to 100%
  // Latitude: 90 to -90 -> 0% to 100%
  const getCoordinatesPct = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return {
      x: Math.max(8, Math.min(92, x)),
      y: Math.max(12, Math.min(88, y)),
    };
  };

  const handleMarkerClick = (artifact: MissionArtifact) => {
    spaceAudio.playTelemetryPing(1100, 0.08);
    setSelectedArtifact(artifact);
  };

  return (
    <section id="archaeology-map" className="relative py-24 bg-[#05070B] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-hud tracking-widest text-[#62D9FF] mb-2">
              <Crosshair className="w-3.5 h-3.5" />
              <span>GEOSPATIAL SURFACE CARTOGRAPHY</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold font-hud uppercase tracking-tight text-white">
              The Hardware Left Behind
            </h2>
            <p className="mt-2 text-base text-[#8D98A8] max-w-2xl font-light">
              Every marker represents a machine, instrument, or piece of technology that helped humanity
              explore another world. Select any coordinate to inspect its archaeological dossier.
            </p>
          </div>

          {/* Planet Switcher Controls */}
          <div className="flex items-center gap-3">
            <div className="inline-flex p-1 bg-[#0B1018] border border-white/20 rounded-xl">
              <button
                onClick={() => {
                  spaceAudio.playTelemetryPing(850, 0.05);
                  onSelectPlanet('MOON');
                  setSelectedArtifact(null);
                }}
                className={`px-5 py-2 rounded-lg font-hud text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                  activePlanet === 'MOON'
                    ? 'bg-[#D9DDE3] text-[#05070B] shadow-sm'
                    : 'text-[#8D98A8] hover:text-white'
                }`}
              >
                MOON SURFACE
              </button>
              <button
                onClick={() => {
                  spaceAudio.playTelemetryPing(1000, 0.05);
                  onSelectPlanet('MARS');
                  setSelectedArtifact(null);
                }}
                className={`px-5 py-2 rounded-lg font-hud text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                  activePlanet === 'MARS'
                    ? 'bg-[#B85C38] text-white shadow-sm'
                    : 'text-[#8D98A8] hover:text-white'
                }`}
              >
                MARS SURFACE
              </button>
            </div>
          </div>
        </div>

        {/* Map Container Stage */}
        <div className="relative rounded-2xl border border-white/15 bg-[#0B1018] overflow-hidden min-h-[580px] shadow-2xl flex flex-col lg:flex-row">
          {/* Main Interactive Map Area */}
          <div className="relative flex-1 h-[450px] sm:h-[520px] lg:h-[620px] overflow-hidden bg-[#07090e]">
            {/* Planetary Texture Background */}
            <div className="absolute inset-0 pointer-events-none">
              <img
                src={
                  activePlanet === 'MOON'
                    ? ASSET_IMAGES.moonLander
                    : ASSET_IMAGES.marsOpportunity
                }
                alt={`${activePlanet} surface map background`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-25 filter contrast-125"
              />
              <div className="absolute inset-0 bg-[#05070B]/60" />
            </div>

            {/* Custom Coordinate Grid Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              <defs>
                <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Latitude Equator Line */}
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#62D9FF" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
              {/* Prime Meridian */}
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#62D9FF" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
            </svg>

            {/* Scientific HUD Overlays */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-4 text-[11px] font-mono-data text-[#8D98A8] bg-[#05070B]/80 px-3 py-1.5 rounded border border-white/10 backdrop-blur-sm">
              <span className="flex items-center gap-1.5 text-white font-medium">
                <MapIcon className="w-3 h-3 text-[#62D9FF]" />
                {activePlanet === 'MOON' ? 'LUNAR CARTOGRAPHY' : 'AREOGRAPHIC CARTOGRAPHY'}
              </span>
              <span>PROJECTION: CYLINDRICAL EQUIDISTANT</span>
              <span className="hidden sm:inline text-[#62D9FF]">GRID: 15° INTERVALS</span>
            </div>

            <div className="absolute top-4 right-4 z-10 text-[11px] font-mono-data text-[#8D98A8] bg-[#05070B]/80 px-3 py-1.5 rounded border border-white/10 backdrop-blur-sm">
              <span>{filteredArtifacts.length} SITES PLOTTED</span>
            </div>

            {/* Interactive Markers */}
            {filteredArtifacts.map((artifact) => {
              const pos = getCoordinatesPct(artifact.coordinates.latNum, artifact.coordinates.lngNum);
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
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-2.5 bg-[#05070B]/95 border border-white/20 rounded-lg text-left text-xs shadow-2xl pointer-events-none z-30 backdrop-blur-md">
                      <div className="font-hud font-bold text-white truncate">{artifact.name}</div>
                      <div className="text-[#8D98A8] text-[11px] flex items-center gap-2 mt-0.5">
                        <span>{artifact.mission}</span>
                        <span>·</span>
                        <span>{artifact.landingYear}</span>
                      </div>
                      <div className="text-[#62D9FF] text-[10px] font-mono-data mt-1">
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
                    className={`relative p-2 rounded-full cursor-pointer transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#62D9FF] ${
                      isSelected
                        ? 'scale-125'
                        : 'hover:scale-115'
                    }`}
                  >
                    {/* Pulsing ring */}
                    <span
                      className={`absolute inset-0 rounded-full animate-ping opacity-35 ${
                        activePlanet === 'MARS' ? 'bg-[#B85C38]' : 'bg-[#62D9FF]'
                      }`}
                    />
                    {/* Outer border ring */}
                    <span
                      className={`relative flex items-center justify-center w-7 h-7 rounded-full border shadow-lg transition-colors ${
                        isSelected
                          ? 'bg-white text-[#05070B] border-white'
                          : activePlanet === 'MARS'
                          ? 'bg-[#B85C38] text-white border-white/40'
                          : 'bg-[#D9DDE3] text-[#05070B] border-white/40'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </span>
                  </button>

                  {/* Marker Tag Text */}
                  <span
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 px-1.5 py-0.5 rounded text-[10px] font-hud tracking-wider whitespace-nowrap pointer-events-none transition-colors ${
                      isSelected
                        ? 'bg-white text-black font-bold'
                        : 'bg-[#05070B]/80 text-[#D9DDE3] border border-white/10'
                    }`}
                  >
                    {artifact.name.split(' ')[0]}
                  </span>
                </div>
              );
            })}

            {/* Bottom Scale & Orientation */}
            <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3 text-[11px] font-mono-data text-[#8D98A8] bg-[#05070B]/80 px-3 py-1.5 rounded border border-white/10">
              <span className="text-white">LAT / LONG COORDINATE SYSTEM</span>
              <span className="text-white/20">|</span>
              <span>EQUATORIAL DATUM</span>
            </div>
          </div>

          {/* Dossier Side Panel */}
          <div className="w-full lg:w-[380px] xl:w-[420px] bg-[#0B1018] border-t lg:border-t-0 lg:border-l border-white/15 p-6 flex flex-col justify-between overflow-y-auto max-h-[620px]">
            {selectedArtifact ? (
              <div className="space-y-5 animate-fadeIn">
                {/* Dossier Header */}
                <div className="flex items-start justify-between pb-3 border-b border-white/10">
                  <div>
                    <span className="text-[11px] font-mono-data text-[#62D9FF] tracking-widest uppercase">
                      {selectedArtifact.artifactId}
                    </span>
                    <h3 className="text-xl font-bold font-hud text-white mt-0.5">
                      {selectedArtifact.name}
                    </h3>
                    <p className="text-xs text-[#8D98A8]">{selectedArtifact.mission}</p>
                  </div>
                  <button
                    onClick={() => setSelectedArtifact(null)}
                    aria-label="Close side panel"
                    className="p-1 rounded text-[#8D98A8] hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Status Indicator (Anti-slop text styling) */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-[#F3B562] animate-pulse" />
                  <span className="font-hud font-semibold text-white tracking-wider">
                    {selectedArtifact.status}
                  </span>
                  <span className="text-[#8D98A8]">·</span>
                  <span className="text-[#8D98A8]">{selectedArtifact.statusDescription}</span>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-white/5 rounded-lg border border-white/5 text-xs font-mono-data">
                  <div>
                    <span className="text-[#8D98A8] block text-[10px] uppercase">Landing Year</span>
                    <span className="text-white font-semibold flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3 text-[#62D9FF]" />
                      {selectedArtifact.landingYear}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8D98A8] block text-[10px] uppercase">Last Contact</span>
                    <span className="text-white font-semibold mt-0.5 block">
                      {selectedArtifact.lastContactYear}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[#8D98A8] block text-[10px] uppercase">Coordinates</span>
                    <span className="text-[#62D9FF] font-semibold mt-0.5 block">
                      {selectedArtifact.coordinates.lat}, {selectedArtifact.coordinates.lng} ({selectedArtifact.locationName})
                    </span>
                  </div>
                </div>

                {/* Archaeological Story */}
                <div>
                  <h4 className="text-xs font-hud font-semibold uppercase text-white tracking-wider mb-1">
                    Archaeological Summary
                  </h4>
                  <p className="text-xs text-[#D9DDE3] leading-relaxed font-light">
                    {selectedArtifact.story}
                  </p>
                </div>

                {/* Science Contribution */}
                <div>
                  <h4 className="text-xs font-hud font-semibold uppercase text-[#62D9FF] tracking-wider mb-1.5">
                    Science Made Possible
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#8D98A8]">
                    {selectedArtifact.scienceContribution.map((sc, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#62D9FF] mt-0.5">›</span>
                        <span>{sc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Full Dossier Deep Dive Button */}
                <button
                  onClick={() => onOpenDetails(selectedArtifact)}
                  className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-hud font-semibold tracking-wider text-white uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Open Full Artifact Dossier</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#62D9FF]" />
                </button>
              </div>
            ) : (
              <div className="h-full flex flex-col justify-center items-center text-center text-[#8D98A8] p-4 space-y-4">
                <div className="w-12 h-12 rounded-full border border-white/15 flex items-center justify-center text-white/50">
                  <Crosshair className="w-6 h-6 text-[#62D9FF]" />
                </div>
                <div>
                  <h4 className="font-hud text-sm font-semibold uppercase text-white tracking-wider">
                    Select a Surface Coordinate
                  </h4>
                  <p className="text-xs mt-1 text-[#8D98A8] max-w-xs">
                    Click any marker on the {activePlanet.toLowerCase()} surface map to view its mission history,
                    scientific instruments, and current state.
                  </p>
                </div>
                {filteredArtifacts.length > 0 && (
                  <div className="pt-2 w-full text-left space-y-1">
                    <span className="text-[10px] font-hud text-[#62D9FF] uppercase tracking-wider block">
                      Quick Selection:
                    </span>
                    {filteredArtifacts.slice(0, 3).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleMarkerClick(item)}
                        className="w-full text-left p-2 rounded bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-white flex items-center justify-between group transition-colors"
                      >
                        <span className="truncate">{item.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#8D98A8] group-hover:text-white transition-colors" />
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
