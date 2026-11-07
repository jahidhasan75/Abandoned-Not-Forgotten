import React, { useEffect, useRef, useState } from 'react';
import { spaceAudio } from '../utils/audio';
import { useI18n } from '../i18n/I18nProvider';

interface JourneyStep {
  year: string;
  badge: string;
  title: string;
  description: string;
  technicalFact?: string;
}

interface MachineJourneyData {
  id: string;
  name: string;
  destination: 'MOON' | 'MARS';
  subtitle: string;
  steps: JourneyStep[];
}

const JOURNEYS: MachineJourneyData[] = [
  {
    id: 'sojourner',
    name: 'Sojourner Rover',
    destination: 'MARS',
    subtitle: 'The 11.5-kg, microwave-sized rover of Mars Pathfinder',
    steps: [
      {
        year: 'December 1996',
        badge: 'Launch',
        title: 'Liftoff from Cape Canaveral',
        description: 'Stowed inside the tetrahedral petals of the Mars Pathfinder lander, Sojourner launched atop a McDonnell Douglas Delta II rocket on a 7-month interplanetary cruise.',
        technicalFact: 'Rover mass: about 11.5 kg.',
      },
      {
        year: 'July 4, 1997',
        badge: 'Touchdown',
        title: 'Airbag Bouncing at Ares Vallis',
        description: 'Pathfinder entered the Martian atmosphere without orbit insertion, deploying parachutes, retro-rockets, and giant 24-lobe Kevlar airbags that bounced 15 times before resting.',
        technicalFact: 'First airbag impact at about 14 m/s (50 km/h).',
      },
      {
        year: 'July 5, 1997',
        badge: 'First movement',
        title: 'Wheels on an Alien World',
        description: 'Petals unfolded and Sojourner rolled down the lander deployment ramp onto Martian soil, becoming the first wheeled rover to drive on Mars.',
        technicalFact: 'Top speed: 1.0 cm per second to ensure real-time autonomous obstacle detection.',
      },
      {
        year: 'Sols 3–83',
        badge: 'Science discovery',
        title: 'Tasting Rocks Barnacle Bill & Yogi',
        description: 'Sojourner pressed its Alpha Particle X-ray Spectrometer against volcanic boulders, to measure what the rocks around Ares Vallis are made of.',
        technicalFact: 'The rover returned about 550 images and more than 15 chemical analyses of rocks and soil.',
      },
      {
        year: 'September 27, 1997',
        badge: 'Mission concludes',
        title: 'The Final Radio Silence',
        description: 'Contact with the Pathfinder lander, Sojourner’s only link to Earth, was lost. The cause was never confirmed; the lander’s battery is the most likely suspect.',
        technicalFact: 'Worked about 12 times longer than its 7-sol design life (83 sols).',
      },
      {
        year: 'Present day',
        badge: 'Archaeological monument',
        title: 'A Solitary Sentinel at Ares Vallis',
        description: 'Sojourner rests somewhere near the Carl Sagan Memorial Station (the Pathfinder lander), the pioneer that paved the way for Spirit, Opportunity, Curiosity and Perseverance.',
        technicalFact: 'Coordinates: 19.33° N, 33.55° W.',
      },
    ],
  },
  {
    id: 'opportunity',
    name: 'Opportunity (MER-B)',
    destination: 'MARS',
    subtitle: 'Built for 90 sols, it drove 45.16 kilometers',
    steps: [
      {
        year: 'July 7, 2003',
        badge: 'Launch',
        title: 'Launch from Cape Canaveral',
        description: 'Launched on a Delta II Heavy, carrying high-resolution panoramic stereo cameras and rock abrasion tools to Meridiani Planum.',
        technicalFact: 'About six and a half months of cruise to Mars.',
      },
      {
        year: 'January 25, 2004',
        badge: 'Interplanetary hole-in-one',
        title: 'Bouncing into Eagle Crater',
        description: 'Airbags bounced into a 22-meter-wide crater, landing right in front of a layered bedrock outcrop of ancient Martian sediment.',
      },
      {
        year: 'Sols 30–1000',
        badge: 'Signs of water',
        title: 'Discovery of Hematite "Blueberries"',
        description: 'Discovered millimeter-sized iron-rich spherules and jarosite sulfate minerals that form only in the presence of acidic liquid water.',
      },
      {
        year: 'Sols 1000–5000',
        badge: 'The long expedition',
        title: 'Endurance, Victoria & Endeavour Craters',
        description: 'Drove on to Endurance, Victoria and Endeavour craters, exploring their rims and walls; wind gusts occasionally cleared dust from its solar panels.',
        technicalFact: 'In March 2015 its odometer passed a full marathon distance (42.195 km).',
      },
      {
        year: 'June 10, 2018',
        badge: 'Final telemetry',
        title: 'The Great Dust Storm of 2018',
        description: 'A planet-encircling dust storm blotted out the sun over Endeavour Crater, plunging solar power output below survival thresholds.',
        technicalFact: 'Last transmission: Sol 5111. Over 1,000 recovery commands went unanswered.',
      },
      {
        year: 'Present day',
        badge: 'Enduring legacy',
        title: 'Resting on Perseverance Valley',
        description: 'Opportunity rests silently overlooking Endeavour Crater, holding the record for the longest distance driven on another world.',
        technicalFact: 'Total distance: 45.16 km (28.06 mi). 217,594 raw images transmitted.',
      },
    ],
  },
];

export const OneMachineJourney: React.FC = () => {
  const { t } = useI18n();
  const [selectedMachine, setSelectedMachine] = useState<string>('sojourner');

  const currentJourney = JOURNEYS.find((j) => j.id === selectedMachine) || JOURNEYS[0];

  // Scroll progress: a light runs down the timeline as the middle of the screen passes each
  // stage (blue in the light theme, green in the dark one: the --color-journey token).
  const listRef = useRef<HTMLOListElement | null>(null);
  const lineRef = useRef<HTMLSpanElement | null>(null);
  const [reached, setReached] = useState(-1);

  useEffect(() => {
    const list = listRef.current;
    const line = lineRef.current;
    if (!list || !line) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = list.getBoundingClientRect();
      const centre = window.innerHeight / 2;
      const dots = Array.from(list.querySelectorAll<HTMLElement>('[data-journey-dot]'));
      if (dots.length === 0) return;
      // Dot centres, measured from the top of the list
      const ys = dots.map((d) => d.getBoundingClientRect().top + d.offsetHeight / 2 - rect.top);
      const progress = Math.min(Math.max(centre - rect.top, 0), ys[ys.length - 1]);
      line.style.height = `${progress}px`;
      let last = -1;
      ys.forEach((y, i) => {
        if (progress >= y - 0.5) last = i;
      });
      setReached(last);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [selectedMachine]);

  return (
    <section className="relative py-12 sm:py-20 lg:py-24 bg-page border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="section-label">{t('journey.kicker')}</p>
            <h2 className="mt-2 text-2xl sm:text-3xl text-fg">{t('journey.title')}</h2>
            <p className="mt-3 text-base text-fg-2 max-w-xl">{t('journey.intro')}</p>
          </div>

          <div className="flex items-center p-1 border border-line rounded-xl" role="group" aria-label={t('journey.title')}>
            {JOURNEYS.map((j) => (
              <button
                key={j.id}
                onClick={() => {
                  spaceAudio.playTelemetryPing(920, 0.05);
                  setSelectedMachine(j.id);
                }}
                aria-pressed={selectedMachine === j.id}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  selectedMachine === j.id ? 'bg-raised text-fg' : 'text-fg-2 hover:text-fg'
                }`}
              >
                {j.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* A typeset chronology: date in the margin, the event beside it */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <h3 className="font-serif text-2xl text-fg">{currentJourney.name}</h3>
            <p className="mt-2 text-base text-fg-2">{currentJourney.subtitle}</p>
            <p className="mt-3 catalogue-tag">
              {t(`body.name.${currentJourney.destination}`)} · {currentJourney.steps.length} stages
            </p>
          </div>

          <ol ref={listRef} className="relative lg:col-span-8 border-l border-line">
            {/* The progress light, drawn over the hairline */}
            <span
              ref={lineRef}
              className="absolute top-0 -left-[1.5px] w-0.5 h-0 bg-journey transition-[height] duration-150 ease-out motion-reduce:transition-none"
              aria-hidden="true"
            />
            {currentJourney.steps.map((step, idx) => (
              <li key={idx} className="relative pl-6 sm:pl-8 pb-10 last:pb-0" aria-current={idx === reached ? 'step' : undefined}>
                <span
                  data-journey-dot
                  className={`absolute -left-1 top-2 w-2 h-2 rounded-full transition-[background-color,transform,box-shadow] duration-300 motion-reduce:transition-none ${
                    idx <= reached ? 'bg-journey scale-125' : 'bg-fg-3'
                  } ${idx === reached ? 'journey-dot-current' : ''}`}
                  aria-hidden="true"
                />
                <p className="font-mono-data text-xs text-fg-2">
                  {String(idx + 1).padStart(2, '0')} · {step.year} · {step.badge}
                </p>
                <h4 className="mt-2 text-lg text-fg font-medium">{step.title}</h4>
                <p className="mt-2 text-base text-fg-2 leading-relaxed max-w-2xl">{step.description}</p>
                {step.technicalFact && (
                  <p className="mt-2 text-sm text-fg-2 max-w-2xl">
                    <span className="text-fg">Fact: </span>
                    {step.technicalFact}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
