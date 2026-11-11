import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { spaceAudio } from '../utils/audio';
import { useI18n } from '../i18n/I18nProvider';
import { MATCH_PAIRS, MatchPair } from '../data/matchPairs';
import { pickRound, remember, shuffle } from '../lib/quizPick';
import { Confetti } from './Confetti';

/** A round shows 4 of the 15 pairs; a pair seen in the last 2 rounds is not picked again. */
const MATCH_ROUND_SIZE = 4;
const MATCH_BLOCKED = 2;
const HISTORY_KEY = 'exoarchive-match-history';

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
    /* storage blocked: the memory copy is enough for this visit */
  }
};
const BANK = MATCH_PAIRS.map((p) => ({ ...p, ref: p.id }));
const pickPairs = (): MatchPair[] => pickRound(BANK, loadHistory(), Math.random, MATCH_ROUND_SIZE, MATCH_BLOCKED);

interface MatchGameProps {
  onOpenMachine: (id: string) => void;
}

/** The "Match the machine" tab of Young Explorers. */
export const MatchGame: React.FC<MatchGameProps> = ({ onOpenMachine }) => {
  const { t, lang } = useI18n();
  const num = (n: number) => n.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US');

  const [pairs, setPairs] = useState<MatchPair[]>(pickPairs);
  const facts = useMemo(() => shuffle(pairs, Math.random), [pairs]);
  const [selected, setSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [wrong, setWrong] = useState(false);
  const done = matched.length === pairs.length;

  // A finished round goes into the history (so the next rounds bring other machines), with a small chord.
  useEffect(() => {
    if (!done) return;
    saveHistory(remember(loadHistory(), pairs.map((p) => p.id), MATCH_BLOCKED));
    [880, 1110, 1320].forEach((f, i) => window.setTimeout(() => spaceAudio.playTelemetryPing(f, 0.12), i * 120));
  }, [done, pairs]);

  const pickMachine = (id: string) => {
    if (matched.includes(id)) return;
    spaceAudio.playTelemetryPing(850, 0.04);
    setSelected(id);
    setWrong(false);
  };
  const pickFact = (id: string) => {
    if (!selected) return;
    if (selected === id) {
      spaceAudio.playTelemetryPing(1100, 0.08);
      setMatched((m) => [...m, id]);
      setSelected(null);
      setWrong(false);
    } else {
      spaceAudio.playTelemetryPing(400, 0.08);
      setMistakes((n) => n + 1);
      setWrong(true);
    }
  };
  const newRound = () => {
    spaceAudio.playTelemetryPing(900, 0.05);
    setPairs(pickPairs());
    setMatched([]);
    setSelected(null);
    setMistakes(0);
    setWrong(false);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-card p-6 sm:p-10 max-w-4xl mx-auto space-y-6">
      {done && <Confetti />}

      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-line text-sm text-fg-2">
        <span className="text-fg">{t('match.title')}</span>
        <span>{t('match.count', { n: num(matched.length), total: num(pairs.length) })}</span>
      </div>

      {!done && (
        <>
          <p aria-live="polite" className={`text-sm text-center ${wrong ? 'text-fg' : 'sr-only'}`}>
            {wrong ? t('match.wrong') : ''}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <span className="text-sm text-fg-2 block">{t('match.step1')}</span>
              {pairs.map((p) => {
                const isDone = matched.includes(p.id);
                const isSelected = selected === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => pickMachine(p.id)}
                    disabled={isDone}
                    aria-pressed={isSelected}
                    className={`w-full p-4 rounded-xl border text-left text-sm transition-colors flex items-center justify-between ${
                      isDone ? 'border-ok bg-ok/10 text-fg' : isSelected ? 'bg-raised border-line-strong text-fg' : 'border-line hover:bg-raised text-fg'
                    }`}
                  >
                    <span>{p.machine}</span>
                    {isDone && <CheckCircle2 className="w-5 h-5 text-ok" strokeWidth={2.25} aria-hidden="true" />}
                  </button>
                );
              })}
            </div>

            <div className="space-y-3">
              <span className="text-sm text-fg-2 block">{t('match.step2')}</span>
              {facts.map((p) => {
                const isDone = matched.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => pickFact(p.id)}
                    disabled={isDone || !selected}
                    className={`w-full p-4 rounded-xl border text-left text-sm transition-colors flex items-center justify-between gap-3 disabled:cursor-default ${
                      isDone ? 'border-ok bg-ok/10 text-fg' : 'border-line hover:bg-raised text-fg-2'
                    }`}
                  >
                    <span>{p[lang]}</span>
                    {isDone && <CheckCircle2 className="w-5 h-5 shrink-0 text-ok" strokeWidth={2.25} aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {done && (
        <div className="space-y-4 animate-fadeIn" aria-live="polite">
          <p className="font-serif text-3xl text-fg animate-pop">{t('match.done')}</p>
          <p className="text-base text-fg">{mistakes === 0 ? t('match.perfect') : mistakes === 1 ? t('match.mistakeOne') : t('match.mistakes', { n: num(mistakes) })}</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {pairs.map((p) => (
              <li key={p.id} className="flex items-start gap-2 text-sm text-fg-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-ok" strokeWidth={2.25} aria-hidden="true" />
                <span>
                  <button
                    type="button"
                    onClick={() => {
                      spaceAudio.playTelemetryPing(1080, 0.07);
                      onOpenMachine(p.id);
                    }}
                    className="text-fg underline decoration-line-strong underline-offset-2 hover:decoration-fg"
                    aria-label={`${t('match.dossier')}: ${p.machine}`}
                  >
                    {p.machine}
                  </button>
                  : {p[lang]}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-base text-fg-2">{t('match.doneBody')}</p>
          <button onClick={newRound} className="btn-primary">
            {t('match.again')}
          </button>
        </div>
      )}
    </div>
  );
};
