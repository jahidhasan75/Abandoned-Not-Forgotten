import React, { useState } from 'react';
import { spaceAudio } from '../utils/audio';
import { Lightbulb, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface FactItem {
  id: number;
  tag: string;
  headline: string;
  body: string;
  sourceRef: string;
}

const FACTS: FactItem[] = [
  {
    id: 1,
    tag: 'MILLIONS OF KILOMETERS AWAY',
    headline: 'Some spacecraft remain active on worlds millions of kilometers away.',
    body: 'The twin Voyager probes, launched in 1977, have exited our solar bubble and entered interstellar space. On Mars and the Moon, over 100 metric tons of human-crafted hardware rests silently under the stars.',
    sourceRef: 'NASA Deep Space Network Archive',
  },
  {
    id: 2,
    tag: 'SPACE ARCHAEOLOGY',
    headline: 'A robot becomes a cultural archaeological artifact the moment its mission concludes.',
    body: 'Just as maritime archaeologists study centuries-old shipwrecks at the bottom of the Atlantic, planetary archaeologists study how cosmic rays, lunar diurnal temperature swings of 300°C, and micro-meteoroids age human materials.',
    sourceRef: 'International Council on Monuments and Sites (ICOMOS)',
  },
  {
    id: 3,
    tag: 'STILL ACTIVE TODAY',
    headline: 'Laser mirrors left on the Moon in 1969 are still actively used today without any batteries.',
    body: 'The quartz prism retroreflectors left by Apollo 11, 14, and 15 need zero electricity. Modern observatories in France and the United States fire green laser pulses at them every week to calculate the Moon’s orbital drift down to millimeter precision.',
    sourceRef: 'Apache Point Observatory Lunar Laser-ranging Operation',
  },
  {
    id: 4,
    tag: 'DISCARDED FOR ROCKS',
    headline: 'Apollo astronauts threw their lunar overshoes out the hatch to make room for moon rocks.',
    body: 'Because of the strict rocket mass equation, Neil Armstrong and Buzz Aldrin literally tossed their lunar overshoes, television cameras, urine collection bags, and empty food canisters onto the lunar surface before closing the hatch so they could carry back 21.5 kg of priceless lunar samples.',
    sourceRef: 'Apollo 11 Surface Operations Debrief',
  },
  {
    id: 5,
    tag: 'ACCIDENTAL DISCOVERY',
    headline: 'Spirit discovered ancient volcanic hot springs because one of its wheels jammed.',
    body: 'When Spirit’s right-front steering actuator failed in 2006, the rover had to drive backwards, dragging the seized wheel. The rut it dug in the sand scraped away the brown dust to reveal brilliant white silica—the classic fingerprint of ancient hydrothermal vents where microbes thrive on Earth.',
    sourceRef: 'Science Magazine / NASA MER Investigation Team',
  },
];

export const DidYouKnow: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleNext = () => {
    spaceAudio.playTelemetryPing(950, 0.04);
    setCurrentIndex((prev) => (prev + 1) % FACTS.length);
  };

  const handlePrev = () => {
    spaceAudio.playTelemetryPing(900, 0.04);
    setCurrentIndex((prev) => (prev - 1 + FACTS.length) % FACTS.length);
  };

  const activeFact = FACTS[currentIndex];

  return (
    <section className="relative py-24 bg-[#05070B] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-hud tracking-widest text-[#62D9FF] mb-2">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>ARCHAEOLOGICAL DISCOVERIES</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold font-hud uppercase tracking-tight text-white">
              Did You Know?
            </h2>
            <p className="mt-2 text-base text-[#8D98A8] max-w-xl font-light">
              Fascinating historical facts about humanity’s technological footprints scattered across the
              solar system.
            </p>
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono-data text-[#62D9FF]">
              0{currentIndex + 1} / 0{FACTS.length}
            </span>
            <div className="flex items-center gap-1 bg-[#0B1018] border border-white/20 p-1 rounded-lg">
              <button
                onClick={handlePrev}
                aria-label="Previous fact"
                className="p-1.5 text-[#8D98A8] hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next fact"
                className="p-1.5 text-[#8D98A8] hover:text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Fact Card Display */}
        <div className="relative rounded-2xl border border-white/15 bg-[#0B1018] p-8 sm:p-12 shadow-2xl min-h-[280px] flex flex-col justify-between overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#62D9FF]/5 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-2 text-xs font-mono-data text-[#F3B562] tracking-widest uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{activeFact.tag}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold font-hud text-white leading-snug max-w-4xl">
              “{activeFact.headline}”
            </h3>

            <p className="mt-4 text-base text-[#D9DDE3] leading-relaxed max-w-3xl font-light">
              {activeFact.body}
            </p>
          </div>

          <div className="pt-6 mt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono-data text-[#8D98A8]">
            <span>VERIFIED ARCHIVE REFERENCE: {activeFact.sourceRef}</span>
            <button
              onClick={handleNext}
              className="text-[#62D9FF] hover:text-white transition-colors font-hud font-semibold uppercase text-xs self-start sm:self-auto cursor-pointer"
            >
              NEXT FACT ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
