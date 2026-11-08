import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight, ExternalLink, X } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';
import { useLive } from '../lib/live/useLive';
import { splitLightTime } from '../lib/compute';
import { spaceAudio } from '../utils/audio';
import { SourceBadge } from './SourceBadge';
import type { BodyRange, RoverLatest } from '../lib/live/nasa';
import type { LiveResult } from '../lib/live/live';
import moonPhoto from '../assets/images/nasa/moon-nearside-lroc-pia14011.webp';
import marsPhoto from '../assets/images/nasa/mars-viking-globe-pia00407.webp';

/** Photos for the range tiles (NASA, public domain), bundled so they also work offline. */
const BODY_PHOTO = {
  moon: { src: moonPhoto, credit: 'PIA14011 · NASA/GSFC/Arizona State University (LRO)' },
  mars: { src: marsPhoto, credit: 'PIA00407 · NASA/JPL-Caltech/USGS (Viking)' },
} as const;

type Body = 'moon' | 'mars';

/** Formats a light-time in the current language (seconds below a minute, otherwise min + s). */
export const useLightTimeText = () => {
  const { t, lang } = useI18n();
  const num = (n: number, digits = 0) =>
    n.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits });
  return (seconds: number) => {
    const { minutes, seconds: s } = splitLightTime(seconds);
    return minutes === 0 ? t('live.t.sec', { s: num(s, 2) }) : t('live.t.min', { m: num(minutes), s: num(s) });
  };
};

/** Distance and speed in the current language (Bangla counts large numbers in crore). */
const useRangeText = () => {
  const { t, lang } = useI18n();
  const loc = lang === 'bn' ? 'bn-BD' : 'en-US';
  return {
    distance: (body: Body, km: number) =>
      body === 'moon'
        ? t('live.range.km', { km: Math.round(km).toLocaleString(loc) })
        : t('live.range.mkm', {
            mkm: (km / (lang === 'bn' ? 1e7 : 1e6)).toLocaleString(loc, { maximumFractionDigits: lang === 'bn' ? 2 : 1 }),
          }),
    speed: (v: number) => Math.abs(v).toLocaleString(loc, { maximumFractionDigits: 3 }),
  };
};

const utc = (iso: string) => iso.slice(0, 16).replace('T', ' ');

/** A tile. When `onOpen` is given, the whole tile is one button (a stretched control under the
 *  content); links inside the tile sit above it and keep working on their own. */
const Card: React.FC<{ children: React.ReactNode; onOpen?: () => void; openLabel?: string }> = ({ children, onOpen, openLabel }) => (
  <div
    className={`group relative rounded-xl border border-line bg-card overflow-hidden flex flex-col ${
      onOpen
        ? 'card-pop hover:border-line-strong focus-within:border-line-strong'
        : ''
    }`}
  >
    {onOpen && (
      <button
        type="button"
        onClick={onOpen}
        aria-label={openLabel}
        className="absolute inset-0 z-10 rounded-xl cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-fg"
      />
    )}
    {children}
  </div>
);

/** Tile heading with a small chevron that says "this opens". */
const TileHead: React.FC<{ title: string; badge: React.ReactNode; opens: boolean }> = ({ title, badge, opens }) => (
  <div className="px-4 pt-4 pb-3 h-22 flex flex-col items-start justify-between gap-2">
    <div className="flex items-center justify-between gap-2 w-full">
      <h3 className="text-base text-fg truncate">{title}</h3>
      {opens && (
        <ChevronRight
          className="w-4 h-4 shrink-0 text-fg-3 transition-transform group-hover:translate-x-0.5 group-hover:text-fg motion-reduce:transition-none"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      )}
    </div>
    {badge}
  </div>
);

const Pending: React.FC<{ state: undefined | null }> = ({ state }) => {
  const { t } = useI18n();
  return (
    <div className="p-5 text-xs font-mono-data text-fg-2 flex-1 flex items-center justify-center min-h-48">
      <span>{state === undefined ? t('live.loading') : t('live.unavailable')}</span>
    </div>
  );
};

const RoverTile: React.FC<{
  id: string;
  name: string;
  result: LiveResult<RoverLatest> | null | undefined;
  onOpenMachine: (id: string) => void;
}> = ({ id, name, result, onOpenMachine }) => {
  const { t, lang } = useI18n();
  const open = () => {
    spaceAudio.playTelemetryPing(1080, 0.07);
    onOpenMachine(id);
  };
  return (
    <Card onOpen={open} openLabel={t('cards.open', { name })}>
      <TileHead title={name} opens badge={result && <SourceBadge source={result.source} fetchedAt={result.fetchedAt} />} />
      {!result ? (
        <Pending state={result as undefined | null} />
      ) : (
        <>
          <div className="relative h-40 bg-ink">
            <img
              src={result.data.imageUrl}
              alt={`${name}: ${t('live.rover.latest')}, ${result.data.instrument}`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-2 left-2 text-xs font-mono-data bg-page/90 text-fg px-2 py-0.5 rounded">
              {result.data.instrument}
            </span>
          </div>
          <div className="p-4 space-y-1 text-xs flex-1">
            <div className="text-xl font-mono-data text-fg whitespace-nowrap">
              {t('live.rover.sol', { sol: result.data.sol.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US') })}
            </div>
            <div className="text-fg-2 font-mono-data">{t('live.rover.taken', { date: utc(result.data.takenUtc) })}</div>
            <div className="text-fg-2">{result.data.credit}</div>
          </div>
          <a
            href={result.data.pageUrl}
            target="_blank"
            rel="noreferrer"
            className="relative z-20 mx-4 mb-4 self-start inline-flex items-center gap-1.5 text-xs text-fg-2 hover:text-fg underline decoration-line-strong underline-offset-2"
          >
            {t('live.rover.view')}
            <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
            <span className="sr-only">{t('modal.newTab')}</span>
          </a>
        </>
      )}
    </Card>
  );
};

const RangeTile: React.FC<{ body: Body; result: LiveResult<BodyRange> | null | undefined; onOpen: () => void }> = ({
  body,
  result,
  onOpen,
}) => {
  const { t } = useI18n();
  const lightText = useLightTimeText();
  const range = useRangeText();
  const title = t(`live.range.title.${body}`);
  return (
    <Card onOpen={result ? onOpen : undefined} openLabel={t('live.detail.open', { title })}>
      <TileHead title={title} opens={!!result} badge={result && <SourceBadge source={result.source} fetchedAt={result.fetchedAt} />} />
      <div className="relative h-40 bg-ink">
        <img
          src={BODY_PHOTO[body].src}
          alt={t(`live.range.photoAlt.${body}`)}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
        <span className="absolute bottom-2 left-2 right-2 truncate text-xs font-mono-data bg-page/90 text-fg px-2 py-0.5 rounded w-fit max-w-full">
          {BODY_PHOTO[body].credit}
        </span>
      </div>
      {!result ? (
        <Pending state={result as undefined | null} />
      ) : (
        <div className="p-4 space-y-2 flex-1 flex flex-col">
          <div className="text-xl font-mono-data text-fg whitespace-nowrap">{range.distance(body, result.data.distanceKm)}</div>
          <p className="text-sm text-fg-2">{t('live.range.light', { t: lightText(result.data.lightTimeS) })}</p>
          <p className="text-xs text-fg-2">
            {result.data.rangeRateKmS >= 0
              ? t('live.range.away', { v: range.speed(result.data.rangeRateKmS) })
              : t('live.range.toward', { v: range.speed(result.data.rangeRateKmS) })}
          </p>
          <a
            href={result.data.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="relative z-20 self-start mt-auto text-xs font-mono-data text-fg-2 hover:text-fg underline decoration-line-strong underline-offset-2"
          >
            {t('live.range.source', { time: utc(result.data.timeUtc) })}
          </a>
        </div>
      )}
    </Card>
  );
};

/** The Moon / Mars tile, opened: large photo, the three numbers, and how each one is worked out. */
const RangeDialog: React.FC<{ body: Body; result: LiveResult<BodyRange>; onClose: () => void }> = ({ body, result, onClose }) => {
  const { t } = useI18n();
  const lightText = useLightTimeText();
  const range = useRangeText();
  const ref = useRef<HTMLDialogElement | null>(null);
  const { data } = result;

  // A native modal dialog: it traps focus, closes on Escape and gives focus back on close.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (!dialog.open) dialog.showModal();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, []);

  const close = () => {
    spaceAudio.playTelemetryPing(700, 0.04);
    onClose();
  };

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onMouseDown={(e) => {
        // A press on the backdrop (the dialog element itself, outside the panel) closes it
        if (e.target === e.currentTarget) close();
      }}
      aria-labelledby="range-dialog-title"
      className="m-auto w-[calc(100%-2rem)] max-w-2xl max-h-[90vh] p-0 rounded-2xl border border-line bg-card text-fg overflow-y-auto overscroll-contain backdrop:bg-ink/85 animate-modalIn"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="section-label">{t('live.kicker')}</p>
            <h2 id="range-dialog-title" className="mt-1 text-2xl sm:text-3xl text-fg">
              {t(`live.range.title.${body}`)}
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label={t('modal.closeBtn')}
            className="p-2 -mr-2 rounded-lg text-fg-2 hover:text-fg hover:bg-raised transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
        <SourceBadge source={result.source} fetchedAt={result.fetchedAt} className="mt-3" />

        <figure className="mt-6">
          <div className="rounded-xl overflow-hidden bg-ink aspect-[16/9]">
            <img src={BODY_PHOTO[body].src} alt={t(`live.range.photoAlt.${body}`)} decoding="async" className="w-full h-full object-contain" />
          </div>
          <figcaption className="mt-2 text-xs text-fg-2">
            {t(`live.range.photoAlt.${body}`)} · <span className="font-mono-data">{BODY_PHOTO[body].credit}</span>
          </figcaption>
        </figure>

        <dl className="mt-6 pt-5 border-t border-line grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <dt className="text-xs text-fg-2">{t('live.detail.distance')}</dt>
            <dd className="mt-1 font-mono-data text-lg text-fg">{range.distance(body, data.distanceKm)}</dd>
          </div>
          <div>
            <dt className="text-xs text-fg-2">{t('live.detail.signal')}</dt>
            <dd className="mt-1 font-mono-data text-lg text-fg">{lightText(data.lightTimeS)}</dd>
          </div>
          <div>
            <dt className="text-xs text-fg-2">{t('live.detail.motion')}</dt>
            <dd className="mt-1 text-base text-fg">
              {data.rangeRateKmS >= 0
                ? t('live.detail.away', { v: range.speed(data.rangeRateKmS) })
                : t('live.detail.toward', { v: range.speed(data.rangeRateKmS) })}
            </dd>
          </div>
        </dl>

        <h3 className="mt-8 text-sm text-fg-2">{t('live.detail.how')}</h3>
        <ol className="mt-3 space-y-2 text-base text-fg-2 leading-relaxed list-decimal pl-5 marker:text-fg-3 marker:font-mono-data">
          <li>{t(`live.detail.how1.${body}`, { time: utc(data.timeUtc) })}</li>
          <li>{t('live.detail.how2')}</li>
          <li>{t('live.detail.how3')}</li>
        </ol>

        <a
          href={data.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-mono-data text-fg-2 hover:text-fg underline decoration-line-strong underline-offset-2"
        >
          {t('live.range.source', { time: utc(data.timeUtc) })}
          <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
          <span className="sr-only">{t('modal.newTab')}</span>
        </a>
      </div>
    </dialog>
  );
};

interface LiveBandProps {
  onOpenMachine: (id: string) => void;
}

export const LiveBand: React.FC<LiveBandProps> = ({ onOpenMachine }) => {
  const { t } = useI18n();
  const ref = useRef<HTMLElement | null>(null);
  const [near, setNear] = useState(false);
  const [openBody, setOpenBody] = useState<Body | null>(null);

  // Only contact NASA once the band is close to the screen
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Fallback: load anyway after a few seconds (old browsers, or tabs that are not rendering)
    const fallback = window.setTimeout(() => setNear(true), 4000);
    if (!('IntersectionObserver' in window)) return () => window.clearTimeout(fallback);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '400px' });
    io.observe(el);
    return () => {
      window.clearTimeout(fallback);
      io.disconnect();
    };
  }, []);

  const curiosity = useLive('curiosity', near);
  const perseverance = useLive('perseverance', near);
  const moon = useLive('moon', near);
  const mars = useLive('mars', near);
  const apod = useLive('apod', near);

  const openRange = (body: Body) => {
    spaceAudio.playTelemetryPing(1040, 0.06);
    setOpenBody(body);
  };
  const openResult = openBody === 'moon' ? moon : openBody === 'mars' ? mars : null;

  return (
    <section ref={ref} id="live" className="relative py-12 sm:py-20 bg-page border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="section-label">{t('live.kicker')}</p>
            <h2 className="mt-2 text-2xl sm:text-3xl text-fg">{t('live.title')}</h2>
            <p className="mt-3 text-base text-fg-2 max-w-2xl">{t('live.intro')}</p>
          </div>
          <p className="text-xs font-mono-data text-fg-2 max-w-xs">{t('live.offlineHint')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" aria-live="polite">
          <RoverTile id="curiosity" name="Curiosity" result={curiosity} onOpenMachine={onOpenMachine} />
          <RoverTile id="perseverance" name="Perseverance" result={perseverance} onOpenMachine={onOpenMachine} />
          <RangeTile body="moon" result={moon} onOpen={() => openRange('moon')} />
          <RangeTile body="mars" result={mars} onOpen={() => openRange('mars')} />
        </div>

        {/* APOD only appears when the API returns a real picture */}
        {apod && (
          <a
            href={apod.data.pageUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center gap-4 rounded-xl border border-line bg-card p-3 hover:bg-raised transition-colors"
          >
            <img src={apod.data.imageUrl} alt={apod.data.title} loading="lazy" className="w-20 h-20 object-cover rounded-lg shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-xs text-fg-2">
                {t('live.apod')} · {apod.data.date}
              </div>
              <div className="text-fg truncate">{apod.data.title}</div>
              {apod.data.copyright && <div className="text-xs text-fg-2 truncate">© {apod.data.copyright}</div>}
            </div>
            <SourceBadge source={apod.source} fetchedAt={apod.fetchedAt} />
          </a>
        )}
      </div>

      {openBody && openResult && <RangeDialog body={openBody} result={openResult} onClose={() => setOpenBody(null)} />}
    </section>
  );
};
