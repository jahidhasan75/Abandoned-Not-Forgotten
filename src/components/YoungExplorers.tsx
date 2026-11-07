import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/missionsData';
import { spaceAudio } from '../utils/audio';
import { useI18n } from '../i18n/I18nProvider';
import { CheckCircle2, XCircle } from 'lucide-react';

export const YoungExplorers: React.FC = () => {
  const { t } = useI18n();
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
    <section id="explorers" className="relative py-12 sm:py-20 lg:py-24 bg-page border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="section-label">{t('explorers.kicker')}</p>
            <h2 className="mt-2 text-2xl sm:text-3xl text-fg">
              {t('explorers.title')}
            </h2>
            <p className="mt-3 text-base text-fg-2 max-w-xl">
              {t('explorers.intro')}
            </p>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 border border-line rounded-xl">
            <button
              onClick={() => {
                spaceAudio.playTelemetryPing(850, 0.04);
                setActiveTab('QUIZ');
              }}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                activeTab === 'QUIZ' ? 'bg-raised text-fg' : 'text-fg-2 hover:text-fg'
              }`}
            >
              Mission quiz
            </button>
            <button
              onClick={() => {
                spaceAudio.playTelemetryPing(850, 0.04);
                setActiveTab('MATCH');
              }}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                activeTab === 'MATCH' ? 'bg-raised text-fg' : 'text-fg-2 hover:text-fg'
              }`}
            >
              Match the machine
            </button>
            <button
              onClick={() => {
                spaceAudio.playTelemetryPing(850, 0.04);
                setActiveTab('BUILDER');
              }}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                activeTab === 'BUILDER' ? 'bg-raised text-fg' : 'text-fg-2 hover:text-fg'
              }`}
            >
              Build a mission
            </button>
          </div>
        </div>

        {/* TAB 1: MISSION QUIZ */}
        {activeTab === 'QUIZ' && (
          <div className="rounded-2xl border border-line bg-card p-6 sm:p-10 max-w-3xl mx-auto">
            {!quizFinished ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-line text-sm text-fg-2">
                  <span className="text-fg">
                    Question {currentQuestionIdx + 1} of {QUIZ_QUESTIONS.length}
                  </span>
                  <span className="text-fg-2">Score {score}</span>
                </div>

                <h3 className="font-serif text-2xl text-fg leading-snug">
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
                        className={`w-full p-4 rounded-xl border text-left text-sm transition-colors flex items-center justify-between cursor-pointer ${
                          isCorrect
                            ? 'border-emerald-400/70 text-fg'
                            : isWrong
                            ? 'border-rose-400/70 text-fg'
                            : isSelected
                            ? 'bg-raised border-line-strong text-fg'
                            : 'border-line hover:bg-raised text-fg-2'
                        }`}
                      >
                        <span>{opt}</span>
                        {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0 ml-2" strokeWidth={1.5} />}
                        {isWrong && <XCircle className="w-5 h-5 text-rose-300 shrink-0 ml-2" strokeWidth={1.5} />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation on submission */}
                {isAnswerSubmitted && (
                  <div className="pt-4 border-t border-line text-sm text-fg-2 leading-relaxed">
                    <span className="text-fg block mb-1">
                      Why
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
                      className="btn-primary"
                    >
                      Check answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="btn-primary"
                    >
                      {currentQuestionIdx < QUIZ_QUESTIONS.length - 1 ? 'Next question' : 'See your score'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-6 animate-fadeIn">
                <div>
                  <h3 className="font-serif text-3xl text-fg">
                    Quiz complete
                  </h3>
                  <p className="text-sm text-fg-2 mt-2">
                    You scored <span className="text-fg font-mono-data">{score}</span> out of{' '}
                    <span className="text-fg font-mono-data">{QUIZ_QUESTIONS.length}</span>
                  </p>
                </div>

                <div className="text-sm text-fg-2 max-w-md mx-auto">
                  {score >= 4
                    ? 'You know this archive well.'
                    : 'Read a few dossiers and try again.'}
                </div>

                <button
                  onClick={resetQuiz}
                  className="btn-primary"
                >
                  Retake the quiz
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MATCH THE MACHINE */}
        {activeTab === 'MATCH' && (
          <div className="rounded-2xl border border-line bg-card p-6 sm:p-10 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-line text-sm text-fg-2">
              <span className="text-fg">Match each machine to its discovery</span>
              <span>
                {matchedPairs.length} of {matchPairs.length} matched
              </span>
            </div>

            {matchError && (
              <div className="p-3 border border-rose-400/50 text-sm text-rose-300 rounded-lg text-center animate-shake">
                Not a match. Try another discovery.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Left Column: Machines */}
              <div className="space-y-3">
                <span className="text-sm text-fg-2 block">
                  1. Pick a machine
                </span>
                {matchPairs.map((p) => {
                  const isDone = matchedPairs.includes(p.machine);
                  const isSelected = selectedMachine === p.machine;
                  return (
                    <button
                      key={p.machine}
                      onClick={() => handleSelectMatchMachine(p.machine)}
                      disabled={isDone}
                      className={`w-full p-4 rounded-xl border text-left text-sm transition-colors flex items-center justify-between ${
                        isDone
                          ? 'border-emerald-400/40 text-emerald-300'
                          : isSelected
                          ? 'bg-raised border-line-strong text-fg'
                          : 'border-line hover:bg-raised text-fg'
                      }`}
                    >
                      <span>{p.machine}</span>
                      {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-300" strokeWidth={1.5} />}
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Discoveries */}
              <div className="space-y-3">
                <span className="text-sm text-fg-2 block">
                  2. Pick its discovery
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
                        className={`w-full p-4 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                          isDone
                            ? 'border-emerald-400/40 text-emerald-300'
                            : 'border-line hover:bg-raised text-fg-2'
                        }`}
                      >
                        {p.discovery}
                      </button>
                    );
                  })}
              </div>
            </div>

            {matchedPairs.length === matchPairs.length && (
              <div className="pt-6 border-t border-line text-center space-y-3 animate-fadeIn">
                <div className="text-emerald-300 text-lg">
                  All machines matched
                </div>
                <button
                  onClick={() => setMatchedPairs([])}
                  className="btn-primary"
                >
                  Play again
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BUILD A MISSION */}
        {activeTab === 'BUILDER' && (
          <div className="rounded-2xl border border-line bg-card p-6 sm:p-10 max-w-4xl mx-auto space-y-8">
            <div>
              <div className="text-sm text-fg-2 mb-1">
                Build a mission
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-fg">
                Design your own explorer
              </h3>
              <p className="text-sm text-fg-2 mt-2">
                Choose a destination, a power source, a vehicle and an instrument, then compare your design
                with the real missions.
              </p>
            </div>

            {!missionLaunched ? (
              <div className="space-y-6">
                {/* Step 1: Destination */}
                <div className="space-y-2">
                  <label className="text-sm text-fg-2">
                    1. Destination
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setBuilderDestination('MOON')}
                      className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                        builderDestination === 'MOON'
                          ? 'bg-raised border-line-strong text-fg'
                          : 'border-line text-fg-2 hover:bg-raised'
                      }`}
                    >
                      <span className="block text-sm">The Moon</span>
                      <span className="text-xs opacity-80">3-day transit · Airless vacuum · 0.166 g</span>
                    </button>
                    <button
                      onClick={() => setBuilderDestination('MARS')}
                      className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                        builderDestination === 'MARS'
                          ? 'bg-raised border-line-strong text-fg'
                          : 'border-line text-fg-2 hover:bg-raised'
                      }`}
                    >
                      <span className="block text-sm">Mars</span>
                      <span className="text-xs opacity-80">7-month cruise · Thin CO2 atmosphere · 0.379 g</span>
                    </button>
                  </div>
                </div>

                {/* Step 2: Power Source */}
                <div className="space-y-2">
                  <label className="text-sm text-fg-2">
                    2. Power Architecture
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setBuilderPower('SOLAR')}
                      className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                        builderPower === 'SOLAR'
                          ? 'bg-raised border-line-strong text-fg'
                          : 'bg-raised border-line text-fg-2'
                      }`}
                    >
                      <span className="font-medium block text-sm text-fg">GaAs Solar Array</span>
                      <span className="text-xs text-fg-2">Lightweight, but susceptible to dust & night</span>
                    </button>
                    <button
                      onClick={() => setBuilderPower('RTG')}
                      className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                        builderPower === 'RTG'
                          ? 'bg-raised border-line-strong text-fg'
                          : 'bg-raised border-line text-fg-2'
                      }`}
                    >
                      <span className="font-medium block text-sm text-fg">SNAP-19 RTG (Nuclear)</span>
                      <span className="text-xs text-fg-2">Constant power 24/7, heavier mass budget</span>
                    </button>
                  </div>
                </div>

                {/* Step 3: Mobility */}
                <div className="space-y-2">
                  <label className="text-sm text-fg-2">
                    3. Mobility System
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setBuilderMobility('ROVER')}
                      className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                        builderMobility === 'ROVER'
                          ? 'bg-raised border-line-strong text-fg'
                          : 'bg-raised border-line text-fg-2'
                      }`}
                    >
                      <span className="font-medium block text-sm text-fg">6-Wheel Rocker-Bogie Rover</span>
                      <span className="text-xs text-fg-2">Can drive tens of kilometers across craters</span>
                    </button>
                    <button
                      onClick={() => setBuilderMobility('LANDER')}
                      className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                        builderMobility === 'LANDER'
                          ? 'bg-raised border-line-strong text-fg'
                          : 'bg-raised border-line text-fg-2'
                      }`}
                    >
                      <span className="font-medium block text-sm text-fg">Stationary High-Precision Lander</span>
                      <span className="text-xs text-fg-2">Optimized for deep drilling & seismic listening</span>
                    </button>
                  </div>
                </div>

                {/* Step 4: Primary Instrument */}
                <div className="space-y-2">
                  <label className="text-sm text-fg-2">
                    4. Primary Scientific Instrument
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setBuilderInstrument('DRILL')}
                      className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                        builderInstrument === 'DRILL'
                          ? 'bg-raised border-line-strong text-fg'
                          : 'bg-raised border-line text-fg-2'
                      }`}
                    >
                      <span className="font-medium block text-xs text-fg">Rock Coring Drill</span>
                      <span className="text-xs text-fg-2">Extracts unweathered sub-surface cores</span>
                    </button>
                    <button
                      onClick={() => setBuilderInstrument('SEISMOMETER')}
                      className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                        builderInstrument === 'SEISMOMETER'
                          ? 'bg-raised border-line-strong text-fg'
                          : 'bg-raised border-line text-fg-2'
                      }`}
                    >
                      <span className="font-medium block text-xs text-fg">SEIS Seismometer</span>
                      <span className="text-xs text-fg-2">Detects internal quakes & meteorite impacts</span>
                    </button>
                    <button
                      onClick={() => setBuilderInstrument('SPECTROMETER')}
                      className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                        builderInstrument === 'SPECTROMETER'
                          ? 'bg-raised border-line-strong text-fg'
                          : 'bg-raised border-line text-fg-2'
                      }`}
                    >
                      <span className="font-medium block text-xs text-fg">APXS Spectrometer</span>
                      <span className="text-xs text-fg-2">X-ray elemental analysis of rocks</span>
                    </button>
                  </div>
                </div>

                {/* Submit Launch */}
                <div className="pt-4 border-t border-line flex items-center justify-between">
                  <div className="text-xs font-mono-data text-fg-2">
                    Your choices are summarised after launch
                  </div>
                  <button
                    onClick={() => {
                      spaceAudio.playTelemetryPing(1200, 0.1);
                      setMissionLaunched(true);
                    }}
                    className="btn-primary"
                  >
                    Launch the mission
                  </button>
                </div>
              </div>
            ) : (
              /* MISSION READY BADGE */
              <div className="p-8 rounded-2xl bg-raised border border-line text-center space-y-6">

                <div>
                  <span className="text-sm text-fg-2 block">
                    Mission ready
                  </span>
                  <h4 className="font-serif text-3xl text-fg mt-1">
                    Cadet Explorer 1
                  </h4>
                  <p className="text-sm text-fg-2 max-w-md mx-auto mt-2">
                    Compare your design with real missions: Viking and Curiosity chose nuclear power,
                    while Opportunity and InSight relied on sunlight and were eventually stopped by dust.
                  </p>
                </div>

                {/* Mission Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto text-left text-xs font-mono-data p-4 rounded-xl bg-card border border-line">
                  <div>
                    <span className="text-fg-2 block text-xs">Destination</span>
                    <span className="text-fg">{builderDestination}</span>
                  </div>
                  <div>
                    <span className="text-fg-2 block text-xs">Power</span>
                    <span className="text-fg">{builderPower}</span>
                  </div>
                  <div>
                    <span className="text-fg-2 block text-xs">Vehicle</span>
                    <span className="text-fg">{builderMobility}</span>
                  </div>
                  <div>
                    <span className="text-fg-2 block text-xs">Instrument</span>
                    <span className="text-fg">{builderInstrument}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setMissionLaunched(false)}
                    className="btn-secondary"
                  >
                    Build another mission
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
