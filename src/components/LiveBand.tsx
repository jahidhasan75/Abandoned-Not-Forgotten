import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';
import { useLive } from '../lib/live/useLive';
import { splitLightTime } from '../lib/compute';
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

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`rounded-xl border border-line bg-card overflow-hidden flex flex-col ${className}`}>{children}</div>
);

const Pending: React.FC<{ state: undefined | null }> = ({ state }) => {
  const { t } = useI18n();
  return (
    <div className="p-5 text-xs font-mono-data text-fg-2 flex-1 flex items-center justify-center min-h-48">
      <span>{state === undefined ? t('live.loading') : t('live.unavailable')}</span>
    </div>
  );
};

const RoverTile: React.FC<{ name: string; result: LiveResult<RoverLatest> | null | undefined }> = ({ name, result }) => {
  const { t, lang } = useI18n();
  return (
    <Card>
      <div className="px-4 pt-4 pb-3 h-22 flex flex-col items-start justify-between gap-2">
        <h3 className="text-base text-fg truncate max-w-full">
          {name}
        </h3>
        {result && <SourceBadge source={result.source} fetchedAt={result.fetchedAt} />}
      </div>
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
            <div className="text-fg-2 font-mono-data">
              {t('live.rover.taken', { date: result.data.takenUtc.slice(0, 16).replace('T', ' ') })}
            </div>
            <div className="text-fg-2">{result.data.credit}</div>
          </div>
          <a
            href={result.data.pageUrl}
            target="_blank"
            rel="noreferrer"
            className="mx-4 mb-4 inline-flex items-center gap-1.5 text-xs text-fg-2 hover:text-fg underline decoration-line-strong underline-offset-2"
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

const RangeTile: React.FC<{ body: 'moon' | 'mars'; result: LiveResult<BodyRange> | null | undefined }> = ({ body, result }) => {
  const { t, lang } = useI18n();
  const lightText = useLightTimeText();
  const loc = lang === 'bn' ? 'bn-BD' : 'en-US';
  return (
    <Card>
      <div className="px-4 pt-4 pb-3 h-22 flex flex-col items-start justify-between gap-2">
        <h3 className="text-base text-fg truncate max-w-full">
          {t(`live.range.title.${body}`)}
        </h3>
        {result && <SourceBadge source={result.source} fetchedAt={result.fetchedAt} />}
      </div>
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
          <div className="text-xl font-mono-data text-fg whitespace-nowrap">
            {body === 'moon'
              ? t('live.range.km', { km: Math.round(result.data.distanceKm).toLocaleString(loc) })
              : t('live.range.mkm', {
                  // Bangla counts large numbers in crore (10 million)
                  mkm: (result.data.distanceKm / (lang === 'bn' ? 1e7 : 1e6)).toLocaleString(loc, { maximumFractionDigits: lang === 'bn' ? 2 : 1 }),
                })}
          </div>
          <p className="text-sm text-fg-2">{t('live.range.light', { t: lightText(result.data.lightTimeS) })}</p>
          <p className="text-xs text-fg-2">
            {result.data.rangeRateKmS >= 0
              ? t('live.range.away', { v: Math.abs(result.data.rangeRateKmS).toLocaleString(loc, { maximumFractionDigits: 3 }) })
              : t('live.range.toward', { v: Math.abs(result.data.rangeRateKmS).toLocaleString(loc, { maximumFractionDigits: 3 }) })}
          </p>
          <a
            href={result.data.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-auto text-xs font-mono-data text-fg-2 hover:text-fg underline decoration-line-strong underline-offset-2"
          >
            {t('live.range.source', { time: result.data.timeUtc.slice(0, 16).replace('T', ' ') })}
          </a>
        </div>
      )}
    </Card>
  );
};

export const LiveBand: React.FC = () => {
  const { t } = useI18n();
  const ref = useRef<HTMLElement | null>(null);
  const [near, setNear] = useState(false);

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
          <RoverTile name="Curiosity" result={curiosity} />
          <RoverTile name="Perseverance" result={perseverance} />
          <RangeTile body="moon" result={moon} />
          <RangeTile body="mars" result={mars} />
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
    </section>
  );
};
