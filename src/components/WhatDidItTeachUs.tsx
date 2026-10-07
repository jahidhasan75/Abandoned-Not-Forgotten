import React, { useState } from 'react';
import { spaceAudio } from '../utils/audio';
import { Wrench, Atom, Heart, Shield, Compass, Sparkles, BookOpen } from 'lucide-react';

interface PillarCategory {
  id: 'ENGINEERING' | 'SCIENCE' | 'HUMANITY';
  title: string;
  question: string;
  summary: string;
  icon: React.ReactNode;
  accentColor: string;
  insights: {
    heading: string;
    description: string;
    exampleMission: string;
  }[];
}

const PILLARS: PillarCategory[] = [
  {
    id: 'ENGINEERING',
    title: 'ENGINEERING',
    question: 'How did humans make a machine survive another world?',
    summary: 'Planetary environments are ruthlessly hostile: vacuum, cosmic radiation, abrasive dust, -130°C nights, and a 20-minute communication lag that forbids real-time joystick control.',
    icon: <Wrench className="w-5 h-5 text-[#62D9FF]" />,
    accentColor: '#62D9FF',
    insights: [
      {
        heading: 'Rocker-Bogie Passive Mobility',
        description: 'Engineers designed a suspension with zero springs, linking wheels via differential rocker arms so all six wheels always stay in contact with irregular boulders without tipping.',
        exampleMission: 'Sojourner (1997) & Opportunity (2004)',
      },
      {
        heading: 'Nuclear Heat & Power (RTGs)',
        description: 'Using natural radioactive decay of Plutonium-238 to supply constant heat and electricity through 14-day dark lunar nights and fierce Martian dust storms.',
        exampleMission: 'Apollo ALSEP Stations & Viking Landers',
      },
      {
        heading: 'Autonomous Hazard Avoidance',
        description: 'Because radio signals take 5 to 20 minutes to reach Mars, rovers had to compute their own 3D stereo terrain maps and autonomously steer away from cliffs and sand dunes.',
        exampleMission: 'Spirit & Opportunity Autonav Software',
      },
    ],
  },
  {
    id: 'SCIENCE',
    title: 'SCIENCE',
    question: 'What did the machines discover?',
    summary: 'Every discarded machine acted as humanity’s remote sensory organ, transforming speculative theories into hard empirical chemical and geological proof.',
    icon: <Atom className="w-5 h-5 text-[#F3B562]" />,
    accentColor: '#F3B562',
    insights: [
      {
        heading: 'The Ancient Wet History of Mars',
        description: 'Opportunity’s chemical discovery of jarosite and hematite proved that liquid water—warm and acidic—once covered the Martian surface for hundreds of millions of years.',
        exampleMission: 'Opportunity at Meridiani Planum',
      },
      {
        heading: 'Hydrothermal Hot Springs for Life',
        description: 'Spirit’s broken wheel uncovered 90% pure amorphous silica, the distinctive terrestrial marker of ancient volcanic vents where microbial organisms thrive on Earth.',
        exampleMission: 'Spirit at Home Plate (Columbia Hills)',
      },
      {
        heading: 'Deep Extraterrestrial Seismology',
        description: 'InSight listened to over 1,300 marsquakes, revealing that Mars has a molten metallic core and a crust that rings with seismic tremors from meteorite impacts.',
        exampleMission: 'InSight SEIS Seismometer (2018–2022)',
      },
    ],
  },
  {
    id: 'HUMANITY',
    title: 'HUMANITY',
    question: 'Why did we send them there?',
    summary: 'Space exploration is an expression of fundamental human curiosity: answering whether Earth is the only cradle of life and testing our species’ capacity to reach beyond our home planet.',
    icon: <Heart className="w-5 h-5 text-[#B85C38]" />,
    accentColor: '#B85C38',
    insights: [
      {
        heading: 'Extending Human Presence Across the Void',
        description: 'These machines became robotic avatars for thousands of scientists, engineers, students, and citizens on Earth who spent decades following their tire tracks.',
        exampleMission: 'Over 1,000 wake-up songs beamed to Opportunity',
      },
      {
        heading: 'Inspiring Generations of Explorers',
        description: 'The students who watched Sojourner roll onto Mars in 1997 grew up to design the sky crane for Curiosity, the Ingenuity helicopter, and the Artemis lunar bases.',
        exampleMission: 'The Apollo & MER Generation of Scientists',
      },
      {
        heading: 'Preserving Cosmic Archaeological Heritage',
        description: 'Understanding that our machines are the first cultural artifacts on other celestial bodies teaches humanity to view the solar system with stewardship and reverence.',
        exampleMission: 'Apollo 11 Tranquility Base Plaque: "We Came In Peace"',
      },
    ],
  },
];

export const WhatDidItTeachUs: React.FC = () => {
  const [activePillar, setActivePillar] = useState<'ENGINEERING' | 'SCIENCE' | 'HUMANITY'>('ENGINEERING');

  const current = PILLARS.find((p) => p.id === activePillar) || PILLARS[0];

  return (
    <section id="science" className="relative py-24 bg-[#05070B] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-hud tracking-widest text-[#62D9FF] mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>KNOWLEDGE SYNTHESIS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-hud uppercase tracking-tight text-white">
            What Did It Teach Us?
          </h2>
          <p className="mt-2 text-base text-[#8D98A8] font-light">
            Every discarded machine left behind an invisible treasure: breakthroughs in how we build,
            what we understand about the universe, and why exploration matters.
          </p>
        </div>

        {/* 3 Interactive Pillar Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {PILLARS.map((pillar) => {
            const isSelected = activePillar === pillar.id;
            return (
              <button
                key={pillar.id}
                onClick={() => {
                  spaceAudio.playTelemetryPing(900, 0.05);
                  setActivePillar(pillar.id);
                }}
                className={`p-6 sm:p-8 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[220px] ${
                  isSelected
                    ? 'bg-[#0B1018] border-white/40 ring-1 ring-white/30 shadow-2xl scale-[1.02]'
                    : 'bg-[#0B1018]/50 border-white/10 hover:border-white/25 hover:bg-[#0B1018]/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-hud font-bold tracking-widest text-[#8D98A8] uppercase">
                      PILLAR // 0{PILLARS.indexOf(pillar) + 1}
                    </span>
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      {pillar.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold font-hud text-white uppercase">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#8D98A8] mt-2 font-light italic">
                    “{pillar.question}”
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-hud">
                  <span className="text-white/60">3 CORE LESSONS</span>
                  <span
                    className="font-semibold tracking-wider"
                    style={{ color: pillar.accentColor }}
                  >
                    {isSelected ? 'EXAMINING NOW' : 'EXPLORE ›'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Pillar Expanded Details */}
        <div className="rounded-2xl border border-white/15 bg-[#0B1018] p-6 sm:p-10 shadow-2xl">
          <div className="max-w-3xl mb-8">
            <span
              className="text-xs font-hud font-bold tracking-widest uppercase block mb-1"
              style={{ color: current.accentColor }}
            >
              {current.title} INVESTIGATION
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-hud text-white">
              {current.question}
            </h3>
            <p className="mt-2 text-sm text-[#D9DDE3] leading-relaxed font-light">
              {current.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {current.insights.map((ins, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="text-xs font-mono-data text-[#8D98A8] mb-1">
                    BREAKTHROUGH 0{idx + 1}
                  </div>
                  <h4 className="text-base font-bold font-hud text-white leading-snug">
                    {ins.heading}
                  </h4>
                  <p className="text-xs text-[#8D98A8] mt-2 leading-relaxed font-light">
                    {ins.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 text-[11px] font-mono-data text-[#62D9FF]">
                  <span className="text-[#8D98A8] block text-[10px]">CASE STUDY</span>
                  {ins.exampleMission}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
