import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';
import { spaceAudio } from '../utils/audio';
import { QUIZ_BANK, QuizItem } from '../data/quiz';
import { Confetti } from './Confetti';
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

interface QuizPanelProps {
  onOpenMachine: (id: string) => void;
}


/** The "Mission quiz" tab of Young Explorers: 5 questions per round from the bank of 50. */
export const QuizPanel: React.FC<QuizPanelProps> = ({ onOpenMachine }) => {
  const { t, lang } = useI18n();
  const [round, setRound] = useState<Asked[] | null>(null);
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  /** Right (true) or wrong (false) for each question answered in this round. */
  const [results, setResults] = useState<boolean[]>([]);
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
    setResults([]);
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
    setResults((r) => [...r, right]);
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
      if (score === round.length) {
        // A small rising chord for a perfect round (silent unless sound is on)
        [880, 1110, 1320].forEach((f, i) => window.setTimeout(() => spaceAudio.playTelemetryPing(f, 0.12), i * 120));
      }
    }
  };
  const perfect = done && !!round && score === round.length;

  return (
        <div id="quiz" className="relative overflow-hidden rounded-2xl border border-line bg-card p-6 sm:p-10 max-w-3xl mx-auto">
          {perfect && <Confetti />}
          {!round && (
            <div className="flex flex-col items-start">
              <p className="section-label">{t('quiz.kicker')}</p>
              <h3 className="mt-2 font-serif text-2xl sm:text-3xl text-fg">{t('quiz.title')}</h3>
              <p className="mt-4 text-base text-fg-2 max-w-xl">
                {t('quiz.intro', { size: num(ROUND_SIZE), total: num(QUIZ_BANK.length) })}
              </p>
              <p className="mt-2 text-sm text-fg-2">{t('quiz.ready', { size: num(ROUND_SIZE) })}</p>
              <button onClick={startRound} className="btn-primary mt-6">
                {t('quiz.start')}
              </button>
              <p className="mt-4 text-xs text-fg-2">{t('quiz.device')}</p>
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
                    <span
                      key={i}
                      className={`h-1 w-6 rounded-full ${
                        i < results.length ? (results[i] ? 'bg-ok' : 'bg-bad') : i === index ? 'bg-fg-2' : 'bg-raised'
                      }`}
                    />
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
                  if (checked && isRight) state = 'border-ok bg-ok/10 text-fg ring-1 ring-ok';
                  if (checked && isChosen && !isRight) state = 'border-bad bg-bad/10 text-fg ring-1 ring-bad';
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
                      {checked && isRight && (
                        <CheckCircle2 className="w-5 h-5 mt-0.5 text-ok shrink-0 animate-pop" strokeWidth={2.25} aria-label={t('quiz.correct')} />
                      )}
                      {checked && isChosen && !isRight && (
                        <XCircle className="w-5 h-5 mt-0.5 text-bad shrink-0 animate-pop" strokeWidth={2.25} aria-label={`${t('quiz.yourAnswer')}: ${t('quiz.wrongShort')}`} />
                      )}
                    </button>
                  );
                })}
              </div>

              <div aria-live="polite" className="mt-6">
                {checked && chosen !== null && (
                  <div className="border-t border-line pt-5 animate-fadeIn">
                    <p className="flex items-start gap-2 text-base text-fg">
                      {current.order[chosen] === 0 ? (
                        <CheckCircle2 className="w-5 h-5 mt-0.5 text-ok shrink-0" strokeWidth={2.25} aria-hidden="true" />
                      ) : (
                        <XCircle className="w-5 h-5 mt-0.5 text-bad shrink-0" strokeWidth={2.25} aria-hidden="true" />
                      )}
                      <span>{current.order[chosen] === 0 ? t('quiz.correct') : t('quiz.wrong', { answer: text[1][0] })}</span>
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
              <p className="section-label">{perfect ? t('quiz.perfect') : t('quiz.resultLabel')}</p>
              <p className={`mt-2 font-serif text-3xl text-fg ${perfect ? 'animate-pop' : ''}`}>
                {t('quiz.score', { score: num(score), total: num(round.length) })}
              </p>
              <div className="mt-3 flex gap-1.5" aria-hidden="true">
                {results.map((r, i) =>
                  r ? (
                    <CheckCircle2 key={i} className="w-5 h-5 text-ok" strokeWidth={2.25} />
                  ) : (
                    <XCircle key={i} className="w-5 h-5 text-bad" strokeWidth={2.25} />
                  )
                )}
              </div>
              {perfect && <p className="mt-3 text-base text-fg">{t('quiz.perfectBody')}</p>}
              <p className="mt-3 text-base text-fg-2 max-w-xl">{t('quiz.after')}</p>
              <button onClick={startRound} className="btn-primary mt-6">
                {t('quiz.again')}
              </button>
            </div>
          )}
        </div>
  );
};
