import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';
import { spaceAudio } from '../utils/audio';
import { MISSIONS_DATA } from '../data/missionsData';
import type { MissionArtifact } from '../types/mission';
import { BODY_RADIUS_KM, greatCircleKm, guessPoints } from '../lib/compute';
import { pickRound, remember } from '../lib/quizPick';
import { Confetti } from './Confetti';
import moonMap from '../assets/textures/moon_2k.webp';
import marsMap from '../assets/textures/mars_2k.webp';

const ROUND_SIZE = 5;
const BLOCKED = 2;
const GREAT_SCORE = 400;
const HISTORY_KEY = 'exoarchive-landing-history';
const MAPS = { MOON: moonMap, MARS: marsMap } as const;

let memoryHistory: string[][] = [];
const loadHistory = (): string[][] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) || 'null');
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
    /* memory copy is enough */
  }
};

// Objects at the same site share a `ref`, so one round never asks for the same spot twice.
const BANK = MISSIONS_DATA.map((a) => ({
  ...a,
  ref: `${a.destination}:${Math.round(a.coordinates.latNum)}:${Math.round(a.coordinates.lngNum)}`,
}));
const pickObjects = (): MissionArtifact[] => pickRound(BANK, loadHistory(), Math.random, ROUND_SIZE, BLOCKED);

interface Point {
  lat: number;
  lng: number;
}
const toPct = (p: Point) => ({ x: ((p.lng + 180) / 360) * 100, y: ((90 - p.lat) / 180) * 100 });
const clampLat = (v: number) => Math.max(-90, Math.min(90, v));
const wrapLng = (v: number) => ((((v + 180) % 360) + 360) % 360) - 180;

const band = (km: number) => (km <= 150 ? 'spot' : km <= 600 ? 'close' : km <= 1500 ? 'region' : 'far');

interface LandingGuessProps {
  onOpenMachine: (id: string) => void;
}

/** "Where did it land?": find each object on a NASA basemap of the Moon or Mars. */
export const LandingGuess: React.FC<LandingGuessProps> = ({ onOpenMachine }) => {
  const { t, tx, lang } = useI18n();
  const num = (n: number, digits = 0) =>
    n.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US', { maximumFractionDigits: digits });

  const [objects, setObjects] = useState<MissionArtifact[]>(pickObjects);
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState<Point | null>(null);
  const [checked, setChecked] = useState(false);
  const [scores, setScores] = useState<{ km: number; points: number }[]>([]);
  const [done, setDone] = useState(false);
  const mapRef = useRef<HTMLDivElement | null>(null);

  const current = objects[index];
  const body = current.destination;
  const truth: Point = { lat: current.coordinates.latNum, lng: current.coordinates.lngNum };
  const total = scores.reduce((s, r) => s + r.points, 0);
  const max = objects.length * 100;
  const great = done && total >= GREAT_SCORE;
  const last = scores[scores.length - 1];

  useEffect(() => {
    if (!done) return;
    saveHistory(remember(loadHistory(), objects.map((o) => o.id), BLOCKED));
    if (total >= GREAT_SCORE) {
      [880, 1110, 1320].forEach((f, i) => window.setTimeout(() => spaceAudio.playTelemetryPing(f, 0.12), i * 120));
    }
  }, [done, objects, total]);

  const placeAt = (clientX: number, clientY: number) => {
    const el = mapRef.current;
    if (!el || checked) return;
    const r = el.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    const y = Math.min(1, Math.max(0, (clientY - r.top) / r.height));
    spaceAudio.playTelemetryPing(760, 0.03);
    setGuess({ lat: 90 - y * 180, lng: x * 360 - 180 });
  };

  const check = () => {
    if (!guess || checked) return;
    const km = greatCircleKm(guess.lat, guess.lng, truth.lat, truth.lng, BODY_RADIUS_KM[body]);
    const points = guessPoints(km, BODY_RADIUS_KM[body]);
    spaceAudio.playTelemetryPing(points >= 70 ? 1200 : points >= 30 ? 900 : 420, 0.08);
    setScores((s) => [...s, { km, points }]);
    setChecked(true);
  };

  const next = () => {
    spaceAudio.playTelemetryPing(900, 0.05);
    if (index < objects.length - 1) {
      setIndex((i) => i + 1);
      setGuess(null);
      setChecked(false);
    } else {
      setDone(true);
    }
  };

  const newRound = () => {
    spaceAudio.playTelemetryPing(900, 0.05);
    setObjects(pickObjects());
    setIndex(0);
    setGuess(null);
    setChecked(false);
    setScores([]);
    setDone(false);
  };

  // Keyboard: arrows move the guess (Shift for small steps), Enter checks
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (checked) return;
    const step = e.shiftKey ? 1 : 5;
    const g = guess ?? { lat: 0, lng: 0 };
    let nextGuess: Point | null = null;
    if (e.key === 'ArrowUp') nextGuess = { lat: clampLat(g.lat + step), lng: g.lng };
    else if (e.key === 'ArrowDown') nextGuess = { lat: clampLat(g.lat - step), lng: g.lng };
    else if (e.key === 'ArrowLeft') nextGuess = { lat: g.lat, lng: wrapLng(g.lng - step) };
    else if (e.key === 'ArrowRight') nextGuess = { lat: g.lat, lng: wrapLng(g.lng + step) };
    else if (e.key === 'Enter') {
      e.preventDefault();
      check();
      return;
    }
    if (nextGuess) {
      e.preventDefault();
      setGuess(nextGuess);
    }
  };

  const bodyName = t(`body.name.${body}`);
  const g = guess ? toPct(guess) : null;
  const tp = toPct(truth);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-card p-6 sm:p-10 max-w-4xl mx-auto">
      {great && <Confetti />}

      {!done ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-line text-sm text-fg-2">
            <span className="font-mono-data">{t('landing.round', { n: num(index + 1), total: num(objects.length) })}</span>
            <span className="font-mono-data">{t('landing.points', { n: num(total) })}</span>
          </div>

          <div className="mt-5 flex items-center gap-4">
            <img src={current.image} alt="" className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover bg-ink shrink-0" />
            <div className="min-w-0">
              <h3 className="font-serif text-xl sm:text-2xl text-fg leading-snug">{current.name}</h3>
              <p className="text-sm text-fg-2">
                {current.mission} · {bodyName} · {num(current.landingYear).replace(/,/g, '')}
              </p>
            </div>
          </div>
          <p className="mt-4 text-base text-fg">{t('landing.prompt', { body: bodyName })}</p>

          {/* NASA basemap (equirectangular, 180° W to 180° E); a 30° grid helps aim */}
          <div className="mt-4">
            <div
              ref={mapRef}
              role="application"
              tabIndex={0}
              aria-label={t('landing.mapAria', { body: bodyName })}
              onClick={(e) => placeAt(e.clientX, e.clientY)}
              onKeyDown={onKeyDown}
              className={`theme-dark relative w-full aspect-[2/1] rounded-xl overflow-hidden bg-ink border border-line outline-none focus-visible:ring-2 focus-visible:ring-fg ${
                checked ? 'cursor-default' : 'cursor-crosshair'
              }`}
            >
              <img src={MAPS[body]} alt="" className="absolute inset-0 w-full h-full object-cover select-none" draggable={false} />
              <svg viewBox="0 0 360 180" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
                {[30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((x) => (
                  <line key={`v${x}`} x1={x} y1={0} x2={x} y2={180} stroke="rgba(238,240,245,0.14)" vectorEffect="non-scaling-stroke" />
                ))}
                {[30, 60, 90, 120, 150].map((y) => (
                  <line key={`h${y}`} x1={0} y1={y} x2={360} y2={y} stroke={y === 90 ? 'rgba(238,240,245,0.3)' : 'rgba(238,240,245,0.14)'} vectorEffect="non-scaling-stroke" />
                ))}
                {checked && g && (
                  <line
                    x1={(g.x / 100) * 360}
                    y1={(g.y / 100) * 180}
                    x2={(tp.x / 100) * 360}
                    y2={(tp.y / 100) * 180}
                    stroke="#eef0f5"
                    strokeWidth={1.5}
                    strokeDasharray="4 3"
                    vectorEffect="non-scaling-stroke"
                  />
                )}
              </svg>

              {g && (
                <span
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-fg bg-accent pointer-events-none"
                  style={{ left: `${g.x}%`, top: `${g.y}%` }}
                  aria-hidden="true"
                />
              )}
              {checked && (
                <span
                  className="absolute -translate-x-1/2 -translate-y-full pointer-events-none text-ok animate-pop"
                  style={{ left: `${tp.x}%`, top: `${tp.y}%` }}
                  aria-hidden="true"
                >
                  <MapPin className="w-7 h-7" strokeWidth={2.25} fill="currentColor" stroke="#07080d" />
                </span>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-fg-2">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full border-2 border-fg bg-accent" aria-hidden="true" />
                {t('landing.yourGuess')}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-ok" strokeWidth={2.25} aria-hidden="true" />
                {t('landing.trueSite')}
              </span>
            </div>
          </div>

          <div aria-live="polite" className="mt-4">
            {checked && last && (
              <div className="border-t border-line pt-4 animate-fadeIn">
                <p className="text-lg text-fg">
                  {t(`landing.band.${band(last.km)}`)} · {t('landing.distance', { km: num(Math.round(last.km)) })} ·{' '}
                  <span className="font-mono-data">{t('landing.points', { n: num(last.points) })}</span>
                </p>
                <p className="mt-1 text-sm text-fg-2">
                  {t('landing.actual', { place: tx(current, 'locationName') })} ({current.coordinates.lat}, {current.coordinates.lng})
                </p>
                <button
                  type="button"
                  onClick={() => {
                    spaceAudio.playTelemetryPing(1080, 0.07);
                    onOpenMachine(current.id);
                  }}
                  className="mt-1 text-sm text-fg-2 hover:text-fg underline decoration-line-strong underline-offset-2"
                >
                  {t('quiz.dossier')}
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            {!checked ? (
              <button onClick={check} disabled={!guess} className="btn-primary disabled:opacity-40">
                {t('landing.check')}
              </button>
            ) : (
              <button onClick={next} className="btn-primary">
                {index < objects.length - 1 ? t('landing.next') : t('landing.finish')}
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-4 animate-fadeIn" aria-live="polite">
          <p className="section-label">{great ? t('landing.great') : t('quiz.resultLabel')}</p>
          <p className={`font-serif text-3xl text-fg ${great ? 'animate-pop' : ''}`}>{t('landing.total', { score: num(total), max: num(max) })}</p>
          <ol className="divide-y divide-line border-y border-line">
            {objects.map((o, i) => (
              <li key={o.id} className="py-2 flex items-center justify-between gap-3 text-sm">
                <button
                  type="button"
                  onClick={() => {
                    spaceAudio.playTelemetryPing(1080, 0.07);
                    onOpenMachine(o.id);
                  }}
                  className="text-left text-fg underline decoration-line-strong underline-offset-2 hover:decoration-fg"
                >
                  {o.name}
                </button>
                <span className="font-mono-data text-xs text-fg-2 whitespace-nowrap">
                  {t('landing.distance', { km: num(Math.round(scores[i]?.km ?? 0)) })} · {t('landing.points', { n: num(scores[i]?.points ?? 0) })}
                </span>
              </li>
            ))}
          </ol>
          <p className="text-sm text-fg-2">{t('landing.how')}</p>
          <p className="text-base text-fg-2">{t('landing.doneBody')}</p>
          <button onClick={newRound} className="btn-primary">
            {t('match.again')}
          </button>
        </div>
      )}
    </div>
  );
};
