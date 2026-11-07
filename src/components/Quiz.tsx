import React, { useEffect, useRef, useState } from 'react';
import { Check, X } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';
import { spaceAudio } from '../utils/audio';
import { QUIZ_BANK, QuizItem } from '../data/quiz';
import { pickRound, remember, shuffle, ROUND_SIZE } from '../lib/quizPick';

const HISTORY_KEY = 'exoarchive-quiz-history';

/** Rounds already asked on this device. Lives in this browser only; if storage is blocked the
 *  rule still holds within the visit, because the history is also kept in memory. */
let memoryHistory: string[][] = [];
const loadHistory = (): string[][] => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed) && parsed.every((r) => Array.isArray(r))) return parsed as string[][];
  } catch {
    /* fall through */
  }
  return memoryHistory;
};
const saveHistory = (h: string[][]) => {
  memoryHistory = h;
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(h));
  } catch {
    /* storage blocked: memory copy is enough for this visit */
  }
};

interface Asked {
  item: QuizItem;
  /** Display order of the options: indexes into the stored options (0 is the correct one). */
  order: number[];
}

interface QuizProps {
  onOpenMachine: (id: string) => void;
}

export const Quiz: React.FC<QuizProps> = ({ onOpenMachine }) => {
  const { t, lang } = useI18n();
  const [round, setRound] = useState<Asked[] | null>(null);
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const num = (n: number) => n.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US');

  const startRound = () => {
    spaceAudio.playTelemetryPing(1040, 0.06);
    const history = loadHistory();
    const picked = pickRound(QUIZ_BANK, history, Math.random);
    saveHistory(remember(history, picked.map((q) => q.id)));
    setRound(picked.map((item) => ({ item, order: shuffle([0, 1, 2, 3], Math.random) })));
    setIndex(0);
    setChosen(null);
    setChecked(false);
    setScore(0);
    setDone(false);
  };

  // Move keyboard and screen-reader focus to each new question, and to the result.
  useEffect(() => {
    if (round && !done) headingRef.current?.focus();
  }, [round, index, done]);
  useEffect(() => {
    if (done) resultRef.current?.focus();
  }, [done]);

  const current = round?.[index];
  const text = current ? current.item[lang] : null;

  const check = () => {
    if (chosen === null || checked || !current) return;
    setChecked(true);
    const right = current.order[chosen] === 0;
    if (right) setScore((s) => s + 1);
    spaceAudio.playTelemetryPing(right ? 1200 : 420, 0.08);
  };

  const next = () => {
    spaceAudio.playTelemetryPing(900, 0.05);
    if (!round) return;
    if (index < round.length - 1) {
      setIndex((i) => i + 1);
      setChosen(null);
      setChecked(false);
    } else {
      setDone(true);
    }
  };

  return (
    <section id="quiz" className="relative py-12 sm:py-20 lg:py-24 bg-page border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div>
          <p className="section-label">{t('quiz.kicker')}</p>
          <h2 className="mt-2 text-2xl sm:text-3xl text-fg">{t('quiz.title')}</h2>
          <p className="mt-3 text-base text-fg-2">{t('quiz.intro', { size: num(ROUND_SIZE), total: num(QUIZ_BANK.length) })}</p>
          <p className="mt-3 text-xs text-fg-2">{t('quiz.device')}</p>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-line bg-card p-5 sm:p-8">
          {!round && (
            <div className="flex flex-col items-start gap-4">
              <p className="text-base text-fg-2">{t('quiz.ready', { size: num(ROUND_SIZE) })}</p>
              <button onClick={startRound} className="btn-primary">
                {t('quiz.start')}
              </button>
            </div>
          )}

          {round && !done && current && text && (
            <div key={current.item.id} className="animate-fadeIn">
              <div className="flex items-center justify-between gap-4 mb-4">
                <p className="text-sm text-fg-2 font-mono-data">
                  {t('quiz.progress', { n: num(index + 1), total: num(round.length) })}
                </p>
                <div className="flex gap-1" aria-hidden="true">
                  {round.map((_, i) => (
                    <span key={i} className={`h-1 w-6 rounded-full ${i <= index ? 'bg-accent' : 'bg-raised'}`} />
                  ))}
                </div>
              </div>

              <h3 ref={headingRef} tabIndex={-1} className="font-serif text-xl sm:text-2xl text-fg leading-snug outline-none">
                {text[0]}
              </h3>

              <div role="group" aria-label={t('quiz.optionsAria')} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {current.order.map((optIdx, displayIdx) => {
                  const isChosen = chosen === displayIdx;
                  const isRight = optIdx === 0;
                  let state = 'border-line text-fg hover:bg-raised';
                  if (!checked && isChosen) state = 'border-fg bg-raised text-fg';
                  if (checked && isRight) state = 'border-accent bg-raised text-fg';
                  if (checked && isChosen && !isRight) state = 'border-line-strong text-fg-2 line-through';
                  if (checked && !isChosen && !isRight) state = 'border-line text-fg-2';
                  return (
                    <button
                      key={optIdx}
                      onClick={() => {
                        if (checked) return;
                        spaceAudio.playTelemetryPing(880, 0.04);
                        setChosen(displayIdx);
                      }}
                      aria-pressed={isChosen}
                      aria-disabled={checked}
                      className={`text-left rounded-lg border px-4 py-3 text-base flex items-start gap-3 transition-colors ${state}`}
                    >
                      <span className="font-mono-data text-xs text-fg-2 mt-1 shrink-0">{String.fromCharCode(65 + displayIdx)}</span>
                      <span className="flex-1">{text[1][optIdx]}</span>
                      {checked && isRight && <Check className="w-4 h-4 mt-1 text-accent shrink-0" strokeWidth={1.5} aria-label={t('quiz.correct')} />}
                      {checked && isChosen && !isRight && <X className="w-4 h-4 mt-1 shrink-0" strokeWidth={1.5} aria-label={t('quiz.yourAnswer')} />}
                    </button>
                  );
                })}
              </div>

              <div aria-live="polite" className="mt-6">
                {checked && chosen !== null && (
                  <div className="border-t border-line pt-5 animate-fadeIn">
                    <p className="text-base text-fg">
                      {current.order[chosen] === 0 ? t('quiz.correct') : t('quiz.wrong', { answer: text[1][0] })}
                    </p>
                    <p className="mt-2 text-sm text-fg-2 max-w-2xl">{text[2]}</p>
                    <button
                      onClick={() => {
                        spaceAudio.playTelemetryPing(1080, 0.06);
                        onOpenMachine(current.item.ref);
                      }}
                      className="mt-2 text-sm text-fg-2 hover:text-fg underline decoration-line-strong underline-offset-2"
                    >
                      {t('quiz.dossier')}
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                {!checked ? (
                  <button onClick={check} disabled={chosen === null} className="btn-primary disabled:opacity-40">
                    {t('quiz.check')}
                  </button>
                ) : (
                  <button onClick={next} className="btn-primary">
                    {index < round.length - 1 ? t('quiz.next') : t('quiz.finish')}
                  </button>
                )}
              </div>
            </div>
          )}

          {round && done && (
            <div ref={resultRef} tabIndex={-1} className="animate-fadeIn outline-none" aria-live="polite">
              <p className="section-label">{t('quiz.resultLabel')}</p>
              <p className="mt-2 font-serif text-3xl text-fg">
                {t('quiz.score', { score: num(score), total: num(round.length) })}
              </p>
              <p className="mt-3 text-base text-fg-2 max-w-xl">{t('quiz.after', { rounds: num(5) })}</p>
              <button onClick={startRound} className="btn-primary mt-6">
                {t('quiz.again')}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
