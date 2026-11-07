import React, { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { spaceAudio } from '../utils/audio';
import { MISSIONS_DATA } from '../data/missionsData';
import { useLive } from '../lib/live/useLive';
import { SourceBadge } from './SourceBadge';
import { useLightTimeText } from './LiveBand';

type Speed = 1 | 60;

interface SignalSendProps {
  /** Only contact NASA once the tab is open. */
  active: boolean;
  onOpenMachine: (id: string) => void;
}

/**
 * "Send a signal": a radio message travels to a machine at the speed of light, using today's
 * Earth–Moon or Earth–Mars distance from JPL Horizons. What happens next depends on the machine.
 */
export const SignalSend: React.FC<SignalSendProps> = ({ active, onOpenMachine }) => {
  const { t, lang } = useI18n();
  const lightText = useLightTimeText();
  const loc = lang === 'bn' ? 'bn-BD' : 'en-US';
  const moon = useLive('moon', active);
  const mars = useLive('mars', active);

  const [targetId, setTargetId] = useState('curiosity');
  const target = MISSIONS_DATA.find((m) => m.id === targetId) || MISSIONS_DATA[0];
  const range = target.destination === 'MOON' ? moon : mars;
  const [speed, setSpeed] = useState<Speed>(60);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'sending' | 'arrived'>('idle');
  const frame = useRef(0);

  // The Moon is close enough to watch in real time; Mars defaults to 60× faster
  useEffect(() => {
    setSpeed(target.destination === 'MOON' ? 1 : 60);
    setPhase('idle');
    setProgress(0);
  }, [target.destination, targetId]);

  useEffect(() => () => window.cancelAnimationFrame(frame.current), []);

  const oneWay = range ? range.data.lightTimeS : 0;
  const durationMs = (oneWay * 1000) / speed;

  const send = () => {
    if (!range || phase === 'sending') return;
    spaceAudio.playTelemetryPing(1320, 0.1);
    setPhase('sending');
    setProgress(0);
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / durationMs);
      setProgress(p);
      if (p < 1) frame.current = window.requestAnimationFrame(tick);
      else {
        setPhase('arrived');
        spaceAudio.playTelemetryPing(980, 0.12);
      }
    };
    frame.current = window.requestAnimationFrame(tick);
  };

  const reply = () => {
    const round = lightText(oneWay * 2);
    if (target.status === 'ACTIVE') {
      return target.category === 'INSTRUMENT' ? t('signal.reply.laser', { t: round }) : t('signal.reply.active', { name: target.name, t: lightText(oneWay) });
    }
    if (typeof target.lastContactYear === 'number') {
      return t('signal.reply.silent', { name: target.name, year: target.lastContactYear.toLocaleString(loc).replace(/,/g, '') });
    }
    return t('signal.reply.never');
  };

  const moonMachines = MISSIONS_DATA.filter((m) => m.destination === 'MOON');
  const marsMachines = MISSIONS_DATA.filter((m) => m.destination === 'MARS');

  return (
    <div className="rounded-2xl border border-line bg-card p-6 sm:p-10 max-w-4xl mx-auto">
      <p className="section-label">{t('explorers.tab.signal')}</p>
      <h3 className="mt-2 font-serif text-2xl sm:text-3xl text-fg">{t('signal.title')}</h3>
      <p className="mt-3 text-base text-fg-2 max-w-2xl">{t('signal.intro')}</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <label className="block">
          <span className="text-sm text-fg-2">{t('signal.pick')}</span>
          <select
            value={targetId}
            onChange={(e) => {
              spaceAudio.playTelemetryPing(850, 0.04);
              setTargetId(e.target.value);
            }}
            disabled={phase === 'sending'}
            className="mt-1 w-full px-3 py-2.5 rounded-lg border border-line bg-page text-fg text-base focus:outline-none focus:border-line-strong"
          >
            <optgroup label={t('body.name.MOON')}>
              {moonMachines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </optgroup>
            <optgroup label={t('body.name.MARS')}>
              {marsMachines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </optgroup>
          </select>
        </label>

        <div role="group" aria-label={t('signal.speedAria')} className="flex items-center gap-1 p-1 border border-line rounded-xl self-end w-fit">
          {([1, 60] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              disabled={phase === 'sending'}
              aria-pressed={speed === s}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${speed === s ? 'bg-raised text-fg' : 'text-fg-2 hover:text-fg'}`}
            >
              {s === 1 ? t('signal.speed.real') : t('signal.speed.fast')}
            </button>
          ))}
        </div>
      </div>

      {!range ? (
        <p className="mt-6 text-sm font-mono-data text-fg-2">{range === null ? t('live.unavailable') : t('live.loading')}</p>
      ) : (
        <>
          <dl className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <dt className="text-xs text-fg-2">{t('signal.distance')}</dt>
              <dd className="mt-1 font-mono-data text-lg text-fg">{t('live.range.km', { km: Math.round(range.data.distanceKm).toLocaleString(loc) })}</dd>
            </div>
            <div>
              <dt className="text-xs text-fg-2">{t('signal.oneWay')}</dt>
              <dd className="mt-1 font-mono-data text-lg text-fg">{lightText(oneWay)}</dd>
            </div>
            <div>
              <dt className="text-xs text-fg-2">{t('signal.roundTrip')}</dt>
              <dd className="mt-1 font-mono-data text-lg text-fg">{lightText(oneWay * 2)}</dd>
            </div>
          </dl>
          <SourceBadge source={range.source} fetchedAt={range.fetchedAt} className="mt-3" />

          {/* The path: Earth on the left, the machine on the right, the signal between them */}
          <div className="theme-dark mt-6 rounded-xl bg-ink border border-line px-5 py-6">
            <div className="flex items-center justify-between text-xs text-fg-2 mb-3">
              <span>{t('signal.earth')}</span>
              <span className="truncate max-w-[60%] text-right">{target.name}</span>
            </div>
            <div className="relative h-2 rounded-full bg-raised" aria-hidden="true">
              <div className="absolute inset-y-0 left-0 rounded-full bg-journey" style={{ width: `${progress * 100}%` }} />
              <span
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-fg motion-reduce:hidden"
                style={{ left: `${progress * 100}%`, opacity: phase === 'idle' ? 0 : 1 }}
              />
            </div>
            <p className="mt-3 font-mono-data text-sm text-fg" aria-live="off">
              {lightText(progress * oneWay)} / {lightText(oneWay)}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <button type="button" onClick={send} disabled={phase === 'sending'} className="btn-primary disabled:opacity-50">
              {phase === 'sending' ? t('signal.sending') : t('signal.send')}
            </button>
            <button
              type="button"
              onClick={() => {
                spaceAudio.playTelemetryPing(1080, 0.07);
                onOpenMachine(target.id);
              }}
              className="text-sm text-fg-2 hover:text-fg underline decoration-line-strong underline-offset-2"
            >
              {t('quiz.dossier')}
            </button>
          </div>

          <div aria-live="polite" className="mt-4 min-h-12">
            {phase === 'arrived' && (
              <div className="animate-fadeIn">
                <p className="text-base text-fg">{t('signal.arrived', { name: target.name, t: lightText(oneWay) })}</p>
                <p className="mt-1 text-base text-fg-2">{reply()}</p>
              </div>
            )}
          </div>

          <p className="mt-4 pt-4 border-t border-line text-xs text-fg-2">
            {t('signal.note', { time: range.data.timeUtc.slice(0, 16).replace('T', ' ') })}
          </p>
        </>
      )}
    </div>
  );
};
