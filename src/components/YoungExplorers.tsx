import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/missionsData';
import { spaceAudio } from '../utils/audio';
import { Award, Compass, CheckCircle2, XCircle, RotateCcw, Sparkles, Send, Wrench, Shield } from 'lucide-react';

export const YoungExplorers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'QUIZ' | 'BUILDER' | 'MATCH'>('QUIZ');

  // QUIZ STATE
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // BUILD A MISSION STATE
  const [builderDestination, setBuilderDestination] = useState<'MOON' | 'MARS'>('MARS');
  const [builderPower, setBuilderPower] = useState<'SOLAR' | 'RTG'>('SOLAR');
  const [builderMobility, setBuilderMobility] = useState<'ROVER' | 'LANDER'>('ROVER');
  const [builderInstrument, setBuilderInstrument] = useState<'DRILL' | 'SEISMOMETER' | 'SPECTROMETER'>('DRILL');
  const [builderComms, setBuilderComms] = useState<'DIRECT' | 'RELAY'>('RELAY');
  const [missionLaunched, setMissionLaunched] = useState<boolean>(false);

  // MATCH THE MACHINE STATE
  const matchPairs = [
    { machine: 'Sojourner', discovery: 'First wheeled rover on Mars (1997)' },
    { machine: 'Spirit', discovery: 'Accidentally found volcanic silica with broken wheel' },
    { machine: 'InSight', discovery: 'Detected 1,300+ marsquakes and mapped core' },
    { machine: 'Apollo 15 LRV', discovery: 'First electric car driven on another world' },
  ];
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [matchError, setMatchError] = useState<boolean>(false);

  // Quiz Handlers
  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    spaceAudio.playTelemetryPing(900, 0.04);
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    const q = QUIZ_QUESTIONS[currentQuestionIdx];
    if (selectedOption === q.correctIndex) {
      spaceAudio.playTelemetryPing(1200, 0.08);
      setScore((s) => s + 1);
    } else {
      spaceAudio.playTelemetryPing(400, 0.08);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIdx((i) => i + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  // Match handler
  const handleSelectMatchMachine = (m: string) => {
    if (matchedPairs.includes(m)) return;
    spaceAudio.playTelemetryPing(850, 0.04);
    setSelectedMachine(m);
    setMatchError(false);
  };

  const handleSelectMatchDiscovery = (disc: string) => {
    if (!selectedMachine) return;
    const pair = matchPairs.find((p) => p.machine === selectedMachine);
    if (pair && pair.discovery === disc) {
      spaceAudio.playTelemetryPing(1100, 0.08);
      setMatchedPairs([...matchedPairs, selectedMachine]);
      setSelectedMachine(null);
      setMatchError(false);
    } else {
      spaceAudio.playTelemetryPing(400, 0.08);
      setMatchError(true);
      setTimeout(() => setMatchError(false), 1200);
    }
  };

  const currentQ = QUIZ_QUESTIONS[currentQuestionIdx];

  return (
    <section id="explorers" className="relative py-24 bg-[#05070B] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-hud tracking-widest text-[#62D9FF] mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>HANDS-ON EXPLORATION ACADEMY</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold font-hud uppercase tracking-tight text-white">
              Your Turn, Explorer
            </h2>
            <p className="mt-2 text-base text-[#8D98A8] max-w-xl font-light">
              Designed for young space enthusiasts, students, and teachers. Test your knowledge, match
              machines to discoveries, or architect your own extraterrestrial rover mission!
            </p>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#0B1018] border border-white/20 rounded-xl">
            <button
              onClick={() => {
                spaceAudio.playTelemetryPing(850, 0.04);
                setActiveTab('QUIZ');
              }}
              className={`px-4 py-2 text-xs font-hud font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'QUIZ' ? 'bg-white text-black shadow-sm' : 'text-[#8D98A8] hover:text-white'
              }`}
            >
              Mission Quiz
            </button>
            <button
              onClick={() => {
                spaceAudio.playTelemetryPing(850, 0.04);
                setActiveTab('MATCH');
              }}
              className={`px-4 py-2 text-xs font-hud font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'MATCH' ? 'bg-white text-black shadow-sm' : 'text-[#8D98A8] hover:text-white'
              }`}
            >
              Match the Machine
            </button>
            <button
              onClick={() => {
                spaceAudio.playTelemetryPing(850, 0.04);
                setActiveTab('BUILDER');
              }}
              className={`px-4 py-2 text-xs font-hud font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'BUILDER' ? 'bg-[#62D9FF] text-[#05070B] shadow-sm' : 'text-[#8D98A8] hover:text-white'
              }`}
            >
              Build a Mission
            </button>
          </div>
        </div>

        {/* TAB 1: MISSION QUIZ */}
        {activeTab === 'QUIZ' && (
          <div className="rounded-2xl border border-white/15 bg-[#0B1018] p-6 sm:p-10 shadow-2xl max-w-3xl mx-auto">
            {!quizFinished ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono-data">
                  <span className="text-[#62D9FF]">
                    QUESTION {currentQuestionIdx + 1} OF {QUIZ_QUESTIONS.length}
                  </span>
                  <span className="text-white">CURRENT SCORE: {score}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-hud text-white leading-snug">
                  {currentQ.question}
                </h3>

                {/* Options */}
                <div className="space-y-3 pt-2">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = isAnswerSubmitted && idx === currentQ.correctIndex;
                    const isWrong = isAnswerSubmitted && isSelected && idx !== currentQ.correctIndex;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswerSubmitted}
                        className={`w-full p-4 rounded-xl border text-left text-sm transition-all flex items-center justify-between cursor-pointer ${
                          isCorrect
                            ? 'bg-emerald-950/60 border-emerald-500 text-white'
                            : isWrong
                            ? 'bg-rose-950/60 border-rose-500 text-white'
                            : isSelected
                            ? 'bg-white/15 border-white text-white'
                            : 'bg-white/5 border-white/10 hover:border-white/25 text-[#D9DDE3]'
                        }`}
                      >
                        <span>{opt}</span>
                        {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />}
                        {isWrong && <XCircle className="w-5 h-5 text-rose-400 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation on submission */}
                {isAnswerSubmitted && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-[#D9DDE3] leading-relaxed animate-fadeIn">
                    <span className="font-hud font-bold text-[#62D9FF] block mb-1">
                      ARCHAEOLOGICAL ARCHIVE INSIGHT:
                    </span>
                    <p>{currentQ.explanation}</p>
                  </div>
                )}

                {/* Action button */}
                <div className="pt-4 flex items-center justify-end">
                  {!isAnswerSubmitted ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={selectedOption === null}
                      className="px-6 py-2.5 rounded-lg bg-white text-black font-hud font-bold text-xs uppercase tracking-wider hover:bg-white/90 disabled:opacity-30 cursor-pointer"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 rounded-lg bg-[#62D9FF] text-[#05070B] font-hud font-bold text-xs uppercase tracking-wider hover:bg-[#62D9FF]/90 cursor-pointer"
                    >
                      {currentQuestionIdx < QUIZ_QUESTIONS.length - 1 ? 'Next Question ›' : 'Complete Quiz ›'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-6 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-[#62D9FF]/20 border border-[#62D9FF]/40 text-[#62D9FF] mx-auto flex items-center justify-center">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold font-hud text-white uppercase">
                    Archaeology Quiz Completed!
                  </h3>
                  <p className="text-sm text-[#8D98A8] mt-2">
                    You scored <span className="text-[#62D9FF] font-bold text-xl">{score}</span> out of{' '}
                    <span className="text-white font-bold">{QUIZ_QUESTIONS.length}</span>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-[#D9DDE3] max-w-md mx-auto">
                  {score >= 4
                    ? 'Outstanding! You possess the knowledge of a veteran NASA flight director.'
                    : 'Great exploration! Every trial expands our understanding of the solar system.'}
                </div>

                <button
                  onClick={resetQuiz}
                  className="px-6 py-3 rounded-lg bg-white text-black font-hud font-bold text-xs uppercase tracking-wider hover:bg-white/90 cursor-pointer inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Quiz</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MATCH THE MACHINE */}
        {activeTab === 'MATCH' && (
          <div className="rounded-2xl border border-white/15 bg-[#0B1018] p-6 sm:p-10 shadow-2xl max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono-data">
              <span className="text-[#62D9FF]">MATCH HARDWARE TO DISCOVERY</span>
              <span>
                MATCHED: {matchedPairs.length} / {matchPairs.length}
              </span>
            </div>

            {matchError && (
              <div className="p-3 bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 rounded-lg text-center animate-shake">
                Incorrect match! Try again.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Left Column: Machines */}
              <div className="space-y-3">
                <span className="text-xs font-hud font-bold text-[#8D98A8] uppercase tracking-wider block">
                  1. Select a Machine
                </span>
                {matchPairs.map((p) => {
                  const isDone = matchedPairs.includes(p.machine);
                  const isSelected = selectedMachine === p.machine;
                  return (
                    <button
                      key={p.machine}
                      onClick={() => handleSelectMatchMachine(p.machine)}
                      disabled={isDone}
                      className={`w-full p-4 rounded-xl border text-left text-sm font-hud font-bold transition-all cursor-pointer flex items-center justify-between ${
                        isDone
                          ? 'bg-white/5 border-emerald-500/50 text-emerald-400 opacity-60'
                          : isSelected
                          ? 'bg-[#62D9FF]/20 border-[#62D9FF] text-white shadow-lg'
                          : 'bg-white/5 border-white/10 hover:border-white/30 text-white'
                      }`}
                    >
                      <span>{p.machine}</span>
                      {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Discoveries */}
              <div className="space-y-3">
                <span className="text-xs font-hud font-bold text-[#8D98A8] uppercase tracking-wider block">
                  2. Select Its Historic Breakthrough
                </span>
                {/* Randomly ordered/static discoveries */}
                {[...matchPairs]
                  .reverse()
                  .map((p) => {
                    const isDone = matchedPairs.includes(p.machine);
                    return (
                      <button
                        key={p.discovery}
                        onClick={() => handleSelectMatchDiscovery(p.discovery)}
                        disabled={isDone}
                        className={`w-full p-4 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                          isDone
                            ? 'bg-white/5 border-emerald-500/50 text-emerald-400 opacity-60'
                            : 'bg-white/5 border-white/10 hover:border-white/30 text-[#D9DDE3]'
                        }`}
                      >
                        {p.discovery}
                      </button>
                    );
                  })}
              </div>
            </div>

            {matchedPairs.length === matchPairs.length && (
              <div className="pt-6 border-t border-white/10 text-center space-y-3 animate-fadeIn">
                <div className="text-emerald-400 font-hud font-bold text-lg">
                  ALL MACHINES SUCCESSFULLY MATCHED!
                </div>
                <button
                  onClick={() => setMatchedPairs([])}
                  className="px-4 py-2 rounded-lg bg-white text-black text-xs font-hud font-semibold cursor-pointer"
                >
                  Play Again
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BUILD A MISSION */}
        {activeTab === 'BUILDER' && (
          <div className="rounded-2xl border border-white/15 bg-[#0B1018] p-6 sm:p-10 shadow-2xl max-w-4xl mx-auto space-y-8">
            <div>
              <div className="text-xs font-mono-data text-[#62D9FF] mb-1">
                CADET MISSION DESIGN STUDIO
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-hud text-white">
                Architect Your Planetary Explorer
              </h3>
              <p className="text-xs text-[#8D98A8] mt-1 font-light">
                Configure your destination, propulsion, mobility chassis, and science payloads. Balance the
                power and mass constraints!
              </p>
            </div>

            {!missionLaunched ? (
              <div className="space-y-6">
                {/* Step 1: Destination */}
                <div className="space-y-2">
                  <label className="text-xs font-hud font-bold uppercase tracking-wider text-white">
                    1. Destination Target
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setBuilderDestination('MOON')}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        builderDestination === 'MOON'
                          ? 'bg-[#D9DDE3] text-[#05070B] border-white font-bold'
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="font-hud block text-sm">THE MOON</span>
                      <span className="text-[11px] opacity-80">3-day transit · Airless vacuum · 0.166 g</span>
                    </button>
                    <button
                      onClick={() => setBuilderDestination('MARS')}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        builderDestination === 'MARS'
                          ? 'bg-[#B85C38] text-white border-white font-bold'
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="font-hud block text-sm">MARS</span>
                      <span className="text-[11px] opacity-80">7-month cruise · Thin CO2 atmosphere · 0.379 g</span>
                    </button>
                  </div>
                </div>

                {/* Step 2: Power Source */}
                <div className="space-y-2">
                  <label className="text-xs font-hud font-bold uppercase tracking-wider text-white">
                    2. Power Architecture
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setBuilderPower('SOLAR')}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        builderPower === 'SOLAR'
                          ? 'bg-white/15 border-[#62D9FF] text-white'
                          : 'bg-white/5 border-white/10 text-[#8D98A8]'
                      }`}
                    >
                      <span className="font-hud font-bold block text-sm text-white">GaAs Solar Array</span>
                      <span className="text-[11px] text-[#8D98A8]">Lightweight, but susceptible to dust & night</span>
                    </button>
                    <button
                      onClick={() => setBuilderPower('RTG')}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        builderPower === 'RTG'
                          ? 'bg-white/15 border-[#F3B562] text-white'
                          : 'bg-white/5 border-white/10 text-[#8D98A8]'
                      }`}
                    >
                      <span className="font-hud font-bold block text-sm text-white">SNAP-19 RTG (Nuclear)</span>
                      <span className="text-[11px] text-[#8D98A8]">Constant power 24/7, heavier mass budget</span>
                    </button>
                  </div>
                </div>

                {/* Step 3: Mobility */}
                <div className="space-y-2">
                  <label className="text-xs font-hud font-bold uppercase tracking-wider text-white">
                    3. Mobility System
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setBuilderMobility('ROVER')}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        builderMobility === 'ROVER'
                          ? 'bg-white/15 border-white text-white'
                          : 'bg-white/5 border-white/10 text-[#8D98A8]'
                      }`}
                    >
                      <span className="font-hud font-bold block text-sm text-white">6-Wheel Rocker-Bogie Rover</span>
                      <span className="text-[11px] text-[#8D98A8]">Can drive tens of kilometers across craters</span>
                    </button>
                    <button
                      onClick={() => setBuilderMobility('LANDER')}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        builderMobility === 'LANDER'
                          ? 'bg-white/15 border-white text-white'
                          : 'bg-white/5 border-white/10 text-[#8D98A8]'
                      }`}
                    >
                      <span className="font-hud font-bold block text-sm text-white">Stationary High-Precision Lander</span>
                      <span className="text-[11px] text-[#8D98A8]">Optimized for deep drilling & seismic listening</span>
                    </button>
                  </div>
                </div>

                {/* Step 4: Primary Instrument */}
                <div className="space-y-2">
                  <label className="text-xs font-hud font-bold uppercase tracking-wider text-white">
                    4. Primary Scientific Instrument
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setBuilderInstrument('DRILL')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        builderInstrument === 'DRILL'
                          ? 'bg-white/15 border-[#62D9FF] text-white'
                          : 'bg-white/5 border-white/10 text-[#8D98A8]'
                      }`}
                    >
                      <span className="font-hud font-bold block text-xs text-white">Rock Coring Drill</span>
                      <span className="text-[10px] text-[#8D98A8]">Extracts unweathered sub-surface cores</span>
                    </button>
                    <button
                      onClick={() => setBuilderInstrument('SEISMOMETER')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        builderInstrument === 'SEISMOMETER'
                          ? 'bg-white/15 border-[#62D9FF] text-white'
                          : 'bg-white/5 border-white/10 text-[#8D98A8]'
                      }`}
                    >
                      <span className="font-hud font-bold block text-xs text-white">SEIS Seismometer</span>
                      <span className="text-[10px] text-[#8D98A8]">Detects internal quakes & meteorite impacts</span>
                    </button>
                    <button
                      onClick={() => setBuilderInstrument('SPECTROMETER')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        builderInstrument === 'SPECTROMETER'
                          ? 'bg-white/15 border-[#62D9FF] text-white'
                          : 'bg-white/5 border-white/10 text-[#8D98A8]'
                      }`}
                    >
                      <span className="font-hud font-bold block text-xs text-white">APXS Spectrometer</span>
                      <span className="text-[10px] text-[#8D98A8]">X-ray elemental analysis of rocks</span>
                    </button>
                  </div>
                </div>

                {/* Submit Launch */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="text-xs font-mono-data text-[#8D98A8]">
                    CALCULATED PAYLOAD MASS: ~420 KG · STATUS: NOMINAL
                  </div>
                  <button
                    onClick={() => {
                      spaceAudio.playTelemetryPing(1200, 0.1);
                      setMissionLaunched(true);
                    }}
                    className="px-8 py-3 bg-[#62D9FF] hover:bg-[#52c8ee] text-[#05070B] font-hud font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-[#62D9FF]/20 flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Authorize Mission Launch</span>
                  </button>
                </div>
              </div>
            ) : (
              /* MISSION READY BADGE */
              <div className="p-8 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-[#62D9FF]/40 text-center space-y-6 animate-fadeIn">
                <div className="inline-flex p-3 rounded-full bg-[#62D9FF]/20 border border-[#62D9FF] text-[#62D9FF]">
                  <Award className="w-10 h-10" />
                </div>

                <div>
                  <span className="text-xs font-mono-data text-[#62D9FF] tracking-widest uppercase block">
                    MISSION CLEARED FOR FLIGHT
                  </span>
                  <h4 className="text-3xl font-bold font-hud text-white uppercase mt-1">
                    MISSION READY: CADET EXPLORER 1
                  </h4>
                  <p className="text-sm text-[#D9DDE3] max-w-md mx-auto mt-2 font-light">
                    Your architecture has successfully passed the simulated thermal, power, and scientific
                    feasibility review!
                  </p>
                </div>

                {/* Mission Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto text-left text-xs font-mono-data p-4 rounded-xl bg-black/40 border border-white/10">
                  <div>
                    <span className="text-[#8D98A8] block text-[10px]">TARGET</span>
                    <span className="text-white font-bold">{builderDestination}</span>
                  </div>
                  <div>
                    <span className="text-[#8D98A8] block text-[10px]">POWER</span>
                    <span className="text-white font-bold">{builderPower}</span>
                  </div>
                  <div>
                    <span className="text-[#8D98A8] block text-[10px]">VEHICLE</span>
                    <span className="text-white font-bold">{builderMobility}</span>
                  </div>
                  <div>
                    <span className="text-[#8D98A8] block text-[10px]">PAYLOAD</span>
                    <span className="text-white font-bold">{builderInstrument}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setMissionLaunched(false)}
                    className="px-6 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-hud font-semibold text-xs tracking-wider cursor-pointer"
                  >
                    Configure Another Mission
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
