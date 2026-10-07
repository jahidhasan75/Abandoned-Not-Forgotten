import React, { useState } from 'react';
import { spaceAudio } from '../utils/audio';
import { Rocket, Sparkles, Navigation, Microscope, BatteryCharging, Flag } from 'lucide-react';

interface JourneyStep {
  year: string;
  badge: string;
  title: string;
  description: string;
  technicalFact: string;
  icon: React.ReactNode;
}

interface MachineJourneyData {
  id: string;
  name: string;
  destination: string;
  subtitle: string;
  steps: JourneyStep[];
}

const JOURNEYS: MachineJourneyData[] = [
  {
    id: 'sojourner',
    name: 'Sojourner Rover',
    destination: 'MARS',
    subtitle: 'The 11.5-kg microwave-sized robot that conquered the Red Planet',
    steps: [
      {
        year: 'DECEMBER 1996',
        badge: 'LAUNCH',
        title: 'Liftoff from Cape Canaveral',
        description: 'Stowed inside the tetrahedral petals of the Mars Pathfinder lander, Sojourner launched atop a McDonnell Douglas Delta II rocket on a 7-month interplanetary cruise.',
        technicalFact: 'Payload launch mass: 11.5 kg rover + 264 kg lander base station.',
        icon: <Rocket className="w-4 h-4 text-[#62D9FF]" />,
      },
      {
        year: 'JULY 4, 1997',
        badge: 'TOUCHDOWN',
        title: 'Airbag Bouncing at Ares Vallis',
        description: 'Pathfinder entered the Martian atmosphere without orbit insertion, deploying parachutes, retro-rockets, and giant 24-lobe Kevlar airbags that bounced 15 times before resting.',
        technicalFact: 'Impact velocity: 14 m/s (50 km/h) with 18g deceleration load.',
        icon: <Sparkles className="w-4 h-4 text-[#F3B562]" />,
      },
      {
        year: 'JULY 5, 1997',
        badge: 'FIRST MOVEMENT',
        title: 'Wheels on an Alien World',
        description: 'Petals unfolded and Sojourner rolled down the lander deployment ramp onto Martian soil, becoming humanity’s first ever wheeled robot to traverse another planet.',
        technicalFact: 'Top speed: 1.0 cm per second to ensure real-time autonomous obstacle detection.',
        icon: <Navigation className="w-4 h-4 text-[#62D9FF]" />,
      },
      {
        year: 'SOLS 3 – 83',
        badge: 'SCIENCE DISCOVERY',
        title: 'Tasting Rocks Barnacle Bill & Yogi',
        description: 'Sojourner pressed its Alpha Particle X-ray Spectrometer against volcanic boulders, proving Ares Vallis was shaped by catastrophic ancient floodwaters.',
        technicalFact: 'Returned 550 images and 16 chemical analyses across 83 sols of operations.',
        icon: <Microscope className="w-4 h-4 text-[#B85C38]" />,
      },
      {
        year: 'SEPTEMBER 27, 1997',
        badge: 'MISSION CONCLUDES',
        title: 'The Final Radio Silence',
        description: 'The Pathfinder lander’s silver-zinc primary battery failed, severed communication with Earth. Sojourner entered an autonomous programmed loop around its silent mothership.',
        technicalFact: 'Exceeded initial 7-day design lifespan by more than 1,180%.',
        icon: <BatteryCharging className="w-4 h-4 text-[#8D98A8]" />,
      },
      {
        year: 'PRESENT DAY',
        badge: 'ARCHAEOLOGICAL MONUMENT',
        title: 'A Solitary Sentinel at Ares Vallis',
        description: 'Sojourner remains parked beside the Carl Sagan Memorial Station on Mars, intact under the Martian sky as the pioneer that paved the way for Spirit, Opportunity, Curiosity, and Perseverance.',
        technicalFact: 'Coordinates: 19.33° N, 33.55° W. Visited only by Martian dust devils.',
        icon: <Flag className="w-4 h-4 text-[#62D9FF]" />,
      },
    ],
  },
  {
    id: 'opportunity',
    name: 'Opportunity (MER-B)',
    destination: 'MARS',
    subtitle: 'The 90-sol geologist that drove an Olympic marathon of 45.16 kilometers',
    steps: [
      {
        year: 'JULY 7, 2003',
        badge: 'LAUNCH',
        title: 'Departure into the Martian Night',
        description: 'Launched on a Delta II Heavy, carrying high-resolution panoramic stereo cameras and rock abrasion tools to Meridiani Planum.',
        technicalFact: 'Cruised 483 million kilometers over 6 months through deep interplanetary space.',
        icon: <Rocket className="w-4 h-4 text-[#62D9FF]" />,
      },
      {
        year: 'JANUARY 25, 2004',
        badge: 'INTERPLANETARY HOLE-IN-ONE',
        title: 'Bouncing into Eagle Crater',
        description: 'Airbags bounced into a 22-meter-wide crater, landing right in front of a layered bedrock outcrop of ancient Martian sediment.',
        technicalFact: 'Scientists called it the most lucky geological landing in human history.',
        icon: <Sparkles className="w-4 h-4 text-[#F3B562]" />,
      },
      {
        year: 'SOLS 30 – 1000',
        badge: 'WATER PROVEN',
        title: 'Discovery of Hematite "Blueberries"',
        description: 'Discovered millimeter-sized iron-rich spherules and jarosite sulfate minerals that form only in the presence of acidic liquid water.',
        technicalFact: 'Confirmed Mars was once a soaked world with standing bodies of water.',
        icon: <Microscope className="w-4 h-4 text-[#B85C38]" />,
      },
      {
        year: 'SOLS 1000 – 5000',
        badge: 'THE LONG EXPEDITION',
        title: 'Endurance, Victoria & Endeavour Craters',
        description: 'Drove through treacherous dunes, scaling crater walls and enduring dozens of brutal dust storms cleaned by lucky wind gusts.',
        technicalFact: 'Drove backwards with a dead steering actuator to finish a full marathon (42.195 km).',
        icon: <Navigation className="w-4 h-4 text-[#62D9FF]" />,
      },
      {
        year: 'JUNE 10, 2018',
        badge: 'FINAL TELEMETRY',
        title: 'The Great Dust Storm of 2018',
        description: 'A planet-encircling dust storm blotted out the sun over Endeavour Crater, plunging solar power output below survival thresholds.',
        technicalFact: 'Last transmission: Sol 5111. Over 1,000 recovery commands went unanswered.',
        icon: <BatteryCharging className="w-4 h-4 text-[#8D98A8]" />,
      },
      {
        year: 'PRESENT DAY',
        badge: 'ENDURING LEGACY',
        title: 'Resting on Perseverance Valley',
        description: 'Opportunity rests silently overlooking Endeavour Crater, holding the extraterrestrial driving distance record forever etched into Martian history.',
        technicalFact: 'Total distance: 45.16 km (28.06 mi). 217,594 raw images transmitted.',
        icon: <Flag className="w-4 h-4 text-[#62D9FF]" />,
      },
    ],
  },
];

export const OneMachineJourney: React.FC = () => {
  const [selectedMachine, setSelectedMachine] = useState<string>('sojourner');

  const currentJourney = JOURNEYS.find((j) => j.id === selectedMachine) || JOURNEYS[0];

  return (
    <section className="relative py-24 bg-[#05070B] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 text-xs font-hud tracking-widest text-[#62D9FF] mb-2">
              <Navigation className="w-3.5 h-3.5" />
              <span>CHRONOLOGICAL BIOGRAPHY</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold font-hud uppercase tracking-tight text-white">
              One Machine. One Journey.
            </h2>
            <p className="mt-2 text-base text-[#8D98A8] max-w-xl font-light">
              Follow the life arc of a single machine from roaring launch fire to eternal silence on an alien
              plain.
            </p>
          </div>

          {/* Machine Picker */}
          <div className="flex items-center p-1 bg-[#0B1018] border border-white/20 rounded-xl">
            {JOURNEYS.map((j) => (
              <button
                key={j.id}
                onClick={() => {
                  spaceAudio.playTelemetryPing(920, 0.05);
                  setSelectedMachine(j.id);
                }}
                className={`px-5 py-2 rounded-lg font-hud text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                  selectedMachine === j.id
                    ? 'bg-white text-black shadow-sm'
                    : 'text-[#8D98A8] hover:text-white'
                }`}
              >
                {j.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Machine Sub-Header Card */}
        <div className="mb-12 p-6 rounded-xl bg-[#0B1018] border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono-data text-[#62D9FF] tracking-wider uppercase">
              {currentJourney.destination} EXPEDITION ARCHIVE
            </div>
            <h3 className="text-2xl font-bold font-hud text-white mt-1">
              {currentJourney.name}
            </h3>
            <p className="text-sm text-[#8D98A8] font-light mt-0.5">
              {currentJourney.subtitle}
            </p>
          </div>
          <span className="text-xs font-mono-data px-3 py-1.5 rounded bg-white/5 border border-white/10 text-white self-start sm:self-auto">
            6 STAGES DOCUMENTED
          </span>
        </div>

        {/* Vertical Timeline */}
        <div className="relative pl-6 sm:pl-10 border-l border-white/20 space-y-12 max-w-4xl mx-auto">
          {currentJourney.steps.map((step, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline Bullet Node */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-8 h-8 rounded-full bg-[#05070B] border-2 border-white/40 group-hover:border-[#62D9FF] group-hover:scale-110 transition-all flex items-center justify-center shadow-lg">
                {step.icon}
              </div>

              {/* Step Content Card */}
              <div className="p-6 sm:p-8 rounded-xl bg-[#0B1018] border border-white/10 group-hover:border-white/30 transition-all space-y-3 shadow-xl">
                {/* Step Metadata Kicker */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-data">
                  <div className="flex items-center gap-2">
                    <span className="font-hud font-bold text-[#62D9FF] tracking-wider">
                      {step.badge}
                    </span>
                    <span className="text-white/30">·</span>
                    <span className="text-[#8D98A8]">{step.year}</span>
                  </div>
                  <span className="text-[#F3B562] font-semibold">STAGE 0{idx + 1}</span>
                </div>

                {/* Step Title */}
                <h4 className="text-xl sm:text-2xl font-bold font-hud text-white">
                  {step.title}
                </h4>

                {/* Step Story Prose */}
                <p className="text-sm text-[#D9DDE3] leading-relaxed font-light">
                  {step.description}
                </p>

                {/* Technical Fact Callout */}
                <div className="pt-3 border-t border-white/10 flex items-start gap-2 text-xs font-mono-data text-[#8D98A8]">
                  <span className="text-[#62D9FF] font-bold">TECH SPEC:</span>
                  <span>{step.technicalFact}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
