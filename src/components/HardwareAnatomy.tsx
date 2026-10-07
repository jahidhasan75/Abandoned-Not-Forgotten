import React, { useState } from 'react';
import { spaceAudio } from '../utils/audio';
import { Crosshair, Camera, Sun, Disc, Radio, Microscope, Cpu, Flame } from 'lucide-react';

interface ComponentSubsystem {
  id: string;
  name: string;
  icon: React.ReactNode;
  coords: { x: number; y: number };
  purpose: string;
  engineeringChallenge: string;
  scienceContribution: string;
}

const ROVER_COMPONENTS: ComponentSubsystem[] = [
  {
    id: 'camera',
    name: 'Pancam & Stereo Mast',
    icon: <Camera className="w-4 h-4 text-[#62D9FF]" />,
    coords: { x: 50, y: 18 },
    purpose: 'Stereoscopic multispectral eyes 1.5 meters above the ground, capturing full 360-degree panoramas.',
    engineeringChallenge: 'Must withstand dust abrasion and wild diurnal temperature fluctuations (-100°C to +20°C) without optical fogging or actuator freezing.',
    scienceContribution: 'Identified mineral composition across horizons and enabled 3D digital elevation terrain models for navigation.',
  },
  {
    id: 'power',
    name: 'Gallium Arsenide Solar Arrays',
    icon: <Sun className="w-4 h-4 text-[#F3B562]" />,
    coords: { x: 50, y: 42 },
    purpose: 'Converts dim Martian sunlight (about 43% of terrestrial intensity) into 140 Watts of electrical power.',
    engineeringChallenge: 'Martian atmospheric dust steadily falls onto the panels, degrading power by up to 80% unless cleaned by lucky atmospheric dust devils.',
    scienceContribution: 'Provided continuous energy for Opportunity to survive 14 years and 5,111 sols of continuous exploration.',
  },
  {
    id: 'antenna',
    name: 'High-Gain Parabolic Antenna',
    icon: <Radio className="w-4 h-4 text-[#62D9FF]" />,
    coords: { x: 68, y: 35 },
    purpose: 'Steerable directional microwave dish that beamed telemetry and imagery directly to Earth’s Deep Space Network across 200 million km.',
    engineeringChallenge: 'Had to automatically track Earth’s position in the sky while parked on tilted crater walls without wasting battery power.',
    scienceContribution: 'Transmitted over 217,000 raw scientific images and terabytes of spectrometry files to global laboratories.',
  },
  {
    id: 'wheels',
    name: 'Rocker-Bogie 6-Wheel Mobility',
    icon: <Disc className="w-4 h-4 text-[#B85C38]" />,
    coords: { x: 26, y: 76 },
    purpose: 'Six motorized aluminum wheels linked by differential pivots that allow climbing rocks larger than the wheel diameter.',
    engineeringChallenge: 'No grease or fluid lubricants could be used because planetary vacuum boils off liquids; dry molybdenum disulfide coatings were required.',
    scienceContribution: 'Enabled Opportunity to drive 45.16 kilometers across dunes, crater rims, and gravel slopes.',
  },
  {
    id: 'instruments',
    name: 'Robotic Arm & Science Turret',
    icon: <Microscope className="w-4 h-4 text-[#F3B562]" />,
    coords: { x: 24, y: 48 },
    purpose: 'Instrument Deployment Device (IDD) carrying the Rock Abrasion Tool, Mössbauer Spectrometer, and Microscopic Imager.',
    engineeringChallenge: 'Five degrees of freedom with positional accuracy within 1 millimeter, deployed directly onto jagged bedrock.',
    scienceContribution: 'Ground away weathered surface rinds to taste unweathered bedrock, discovering hematite "blueberries" formed in water.',
  },
  {
    id: 'computer',
    name: 'Radiation-Hardened Avionics',
    icon: <Cpu className="w-4 h-4 text-[#62D9FF]" />,
    coords: { x: 50, y: 55 },
    purpose: 'Central nervous system running VxWorks real-time operating system on a 20 MHz RAD6000 radiation-hardened processor.',
    engineeringChallenge: 'Cosmic rays and solar flares would instantly corrupt commercial computer chips; circuit traces used redundant gallium radiation shielding.',
    scienceContribution: 'Calculated real-time autonomous pathfinding, stereoscopic depth maps, and error-correcting telemetry transmission.',
  },
  {
    id: 'thermal',
    name: 'Thermal Aerogel & RHU Heaters',
    icon: <Flame className="w-4 h-4 text-[#FF6B6B]" />,
    coords: { x: 74, y: 64 },
    purpose: 'Warm Electronics Box (WEB) insulated with porous silica aerogel (the lightest solid on Earth) and 8 Radioisotope Heater Units.',
    engineeringChallenge: 'Nighttime temperatures on Mars plummet to -120°C, which would shatter lithium batteries without constant core heat.',
    scienceContribution: 'Kept internal electronics warm for thousands of consecutive Martian nights, outlasting its planned mission by 55 times.',
  },
];

export const HardwareAnatomy: React.FC = () => {
  const [selectedSubsystem, setSelectedSubsystem] = useState<ComponentSubsystem>(ROVER_COMPONENTS[0]);

  const handleSelect = (comp: ComponentSubsystem) => {
    spaceAudio.playTelemetryPing(1050, 0.05);
    setSelectedSubsystem(comp);
  };

  return (
    <section className="relative py-24 bg-[#05070B] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-hud tracking-widest text-[#62D9FF] mb-2">
              <Crosshair className="w-3.5 h-3.5" />
              <span>ROBOTIC DISSECTION & SUBSYSTEMS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold font-hud uppercase tracking-tight text-white">
              What Was Inside?
            </h2>
            <p className="mt-2 text-base text-[#8D98A8] max-w-xl font-light">
              Click any highlighted hotspot on the stylized Mars exploration rover diagram to understand the
              purpose, engineering challenge, and scientific contribution of each subsystem.
            </p>
          </div>

          <div className="text-xs font-mono-data text-[#8D98A8]">
            MODEL: MARS EXPLORATION CLASS (MER) · 1:1 CAD RECONSTRUCTION
          </div>
        </div>

        {/* Main Stage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left / Center: Interactive Stylized Rover Schematic (7 cols) */}
          <div className="lg:col-span-7 relative bg-[#0B1018] rounded-2xl border border-white/15 p-6 sm:p-10 shadow-2xl overflow-hidden min-h-[440px] flex items-center justify-center">
            {/* Background Grid */}
            <div className="absolute inset-0 subtle-scanlines opacity-40 pointer-events-none" />

            {/* Stylized Rover Technical SVG */}
            <div className="relative w-full max-w-lg aspect-[4/3]">
              <svg viewBox="0 0 500 375" className="w-full h-full">
                {/* Ground Line */}
                <line x1="40" y1="330" x2="460" y2="330" stroke="#8D98A8" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />

                {/* Rocker-Bogie Suspension Lines */}
                <path d="M 140 280 L 220 230 L 320 240 L 380 290" fill="none" stroke="#8D98A8" strokeWidth="3" opacity="0.6" />
                <path d="M 220 230 L 250 200" fill="none" stroke="#8D98A8" strokeWidth="2.5" opacity="0.6" />

                {/* Wheels */}
                <circle cx="130" cy="290" r="22" fill="#0B1018" stroke="#B85C38" strokeWidth="3" />
                <circle cx="240" cy="290" r="22" fill="#0B1018" stroke="#B85C38" strokeWidth="3" />
                <circle cx="390" cy="290" r="22" fill="#0B1018" stroke="#B85C38" strokeWidth="3" />
                {/* Treads */}
                <circle cx="130" cy="290" r="14" fill="none" stroke="#B85C38" strokeWidth="1" strokeDasharray="2 2" />
                <circle cx="240" cy="290" r="14" fill="none" stroke="#B85C38" strokeWidth="1" strokeDasharray="2 2" />
                <circle cx="390" cy="290" r="14" fill="none" stroke="#B85C38" strokeWidth="1" strokeDasharray="2 2" />

                {/* Warm Electronics Box Chassis */}
                <polygon points="180,180 340,180 320,230 190,230" fill="#141B26" stroke="#D9DDE3" strokeWidth="2" />

                {/* Solar Array Wings */}
                <polygon points="120,170 380,170 360,185 140,185" fill="#1E293B" stroke="#F3B562" strokeWidth="1.5" />
                <line x1="160" y1="170" x2="160" y2="185" stroke="#F3B562" strokeWidth="1" opacity="0.5" />
                <line x1="220" y1="170" x2="220" y2="185" stroke="#F3B562" strokeWidth="1" opacity="0.5" />
                <line x1="280" y1="170" x2="280" y2="185" stroke="#F3B562" strokeWidth="1" opacity="0.5" />
                <line x1="340" y1="170" x2="340" y2="185" stroke="#F3B562" strokeWidth="1" opacity="0.5" />

                {/* Camera Mast */}
                <line x1="250" y1="170" x2="250" y2="70" stroke="#62D9FF" strokeWidth="2.5" />
                <rect x="235" y="55" width="30" height="18" rx="3" fill="#141B26" stroke="#62D9FF" strokeWidth="2" />
                <circle cx="243" cy="64" r="4" fill="#62D9FF" />
                <circle cx="257" cy="64" r="4" fill="#62D9FF" />

                {/* High Gain Dish Antenna */}
                <ellipse cx="340" cy="130" rx="18" ry="8" fill="#141B26" stroke="#D9DDE3" strokeWidth="1.5" />
                <line x1="330" y1="170" x2="340" y2="135" stroke="#D9DDE3" strokeWidth="2" />

                {/* Robotic Arm (Front) */}
                <path d="M 180 200 L 140 220 L 120 190" fill="none" stroke="#F3B562" strokeWidth="2" />
                <circle cx="120" cy="190" r="7" fill="#141B26" stroke="#F3B562" strokeWidth="2" />
              </svg>

              {/* Clickable Hotspots overlay */}
              {ROVER_COMPONENTS.map((comp) => {
                const isSelected = selectedSubsystem.id === comp.id;
                return (
                  <button
                    key={comp.id}
                    onClick={() => handleSelect(comp)}
                    style={{ left: `${comp.coords.x}%`, top: `${comp.coords.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-full cursor-pointer transition-all duration-300 group z-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#62D9FF] ${
                      isSelected ? 'scale-125' : 'hover:scale-110'
                    }`}
                    aria-label={`Select ${comp.name}`}
                  >
                    <span className="absolute inset-0 rounded-full bg-[#62D9FF] animate-ping opacity-30" />
                    <span
                      className={`relative flex items-center justify-center w-7 h-7 rounded-full border shadow-lg transition-colors ${
                        isSelected
                          ? 'bg-[#62D9FF] text-[#05070B] border-white'
                          : 'bg-[#05070B] text-white border-white/40 group-hover:border-[#62D9FF]'
                      }`}
                    >
                      {comp.icon}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Subsystem Detailed Card (5 cols) */}
          <div className="lg:col-span-5 bg-[#0B1018] rounded-2xl border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono-data text-[#62D9FF] tracking-wider uppercase">
                SUBSYSTEM DIAGNOSTIC
              </span>
              <span className="text-xs font-mono-data text-[#8D98A8]">
                REF: {selectedSubsystem.id.toUpperCase()}-01
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                {selectedSubsystem.icon}
              </div>
              <h3 className="text-2xl font-bold font-hud text-white leading-tight">
                {selectedSubsystem.name}
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[#8D98A8] font-hud uppercase tracking-wider block mb-1">
                  1. Purpose & Function
                </span>
                <p className="text-[#D9DDE3] leading-relaxed font-light">
                  {selectedSubsystem.purpose}
                </p>
              </div>

              <div className="pt-2 border-t border-white/10">
                <span className="text-[#F3B562] font-hud uppercase tracking-wider block mb-1">
                  2. Engineering Challenge
                </span>
                <p className="text-[#8D98A8] leading-relaxed font-light">
                  {selectedSubsystem.engineeringChallenge}
                </p>
              </div>

              <div className="pt-2 border-t border-white/10">
                <span className="text-[#62D9FF] font-hud uppercase tracking-wider block mb-1">
                  3. Science Contribution
                </span>
                <p className="text-[#8D98A8] leading-relaxed font-light">
                  {selectedSubsystem.scienceContribution}
                </p>
              </div>
            </div>

            {/* Quick Picker Bar */}
            <div className="pt-4 border-t border-white/10">
              <span className="text-[10px] font-hud uppercase tracking-wider text-[#8D98A8] block mb-2">
                Quick Select Subsystem:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {ROVER_COMPONENTS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelect(c)}
                    className={`px-2.5 py-1 rounded text-[11px] font-hud transition-colors cursor-pointer ${
                      selectedSubsystem.id === c.id
                        ? 'bg-white text-black font-semibold'
                        : 'bg-white/5 text-[#8D98A8] hover:text-white'
                    }`}
                  >
                    {c.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
