import React, { useEffect, useRef } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { spaceAudio } from '../utils/audio';
import { useI18n } from '../i18n/I18nProvider';
import { useTheme } from '../lib/theme';
import { MISSIONS_DATA } from '../data/missionsData';
import { CatalogueTag } from './CatalogueTag';
import type { MissionArtifact } from '../types/mission';

interface HeroProps {
  onStartExploring: () => void;
  onOpenMap: () => void;
  onOpenMachine: (id: string) => void;
}

/** The two objects on the cover: one left on the Moon, one still working on Mars. */
const MOON_ID = 'apollo15-lrv';
const MARS_ID = 'curiosity';
const byId = (id: string) => MISSIONS_DATA.find((m) => m.id === id) as MissionArtifact;

export const Hero: React.FC<HeroProps> = ({ onStartExploring, onOpenMap, onOpenMachine }) => {
  const { t, tx } = useI18n();
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const moon = byId(MOON_ID);
  const mars = byId(MARS_ID);

  // Dark theme only: a still, sparse starfield behind the page. Drawn once per resize.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const draw = () => {
      const width = (canvas.width = canvas.offsetWidth);
      const height = (canvas.height = canvas.offsetHeight);
      ctx.clearRect(0, 0, width, height);
      if (theme !== 'dark') return;
      for (let i = 0; i < 90; i++) {
        ctx.fillStyle = `rgba(238, 240, 245, ${Math.random() * 0.3 + 0.08})`;
        ctx.beginPath();
        ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 0.9 + 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [theme]);

  const open = (a: MissionArtifact) => {
    spaceAudio.playTelemetryPing(1080, 0.07);
    onOpenMachine(a.id);
  };

  // The demo moment: Surveyor 3, photographed by the Apollo 12 crew in 1969 and again from orbit by LRO in 2009
  const openThenAndNow = () => {
    spaceAudio.playTelemetryPing(1080, 0.07);
    onOpenMachine('surveyor3');
    window.setTimeout(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document.getElementById('then-now')?.parentElement?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }, 350);
  };

  const plateLabel = (a: MissionArtifact) => `${t(`body.${a.destination}`)} · ${a.mission}, ${a.landingYear}`;

  return (
    <section id="hero" className="relative overflow-hidden bg-page pt-28 sm:pt-32 pb-8 lg:min-h-screen flex flex-col">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
        {/* Text */}
        <div className="lg:col-span-6">
          <p className="section-label" style={{ color: '#000000' }}>
            {t('hero.kicker1')} <span className="text-fg-3">·</span> {t('hero.kicker2')}
          </p>

          <h1 className="mt-5 text-5xl sm:text-6xl xl:text-7xl text-fg leading-[1.02] tracking-tight">
            {t('hero.title1')} {t('hero.title2')} {t('hero.title3')}
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-fg leading-snug max-w-xl">
            {t('hero.quote1')} {t('hero.quote2')}
          </p>

          <p className="mt-4 text-base text-fg-2 max-w-xl">{t('hero.body')}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                spaceAudio.playTelemetryPing(880, 0.08);
                onStartExploring();
              }}
              className="btn-primary"
            >
              {t('hero.cta')}
            </button>
            <button
              onClick={() => {
                spaceAudio.playTelemetryPing(1040, 0.06);
                onOpenMap();
              }}
              className="btn-secondary"
            >
              {t('hero.map')}
            </button>
          </div>

          <button
            type="button"
            onClick={openThenAndNow}
            className="group mt-6 flex items-start gap-2 text-left text-sm text-fg-2 hover:text-fg transition-colors max-w-xl"
          >
            <span>
              <span className="text-fg">{t('hero.demo.kicker')}</span> {t('hero.demo.body')}
            </span>
            <ArrowRight className="w-4 h-4 mt-0.5 shrink-0 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>

        {/* Two catalogue plates: real NASA photographs of objects in the archive */}
        <figure className="lg:col-span-6 relative pb-24 sm:pb-20">
          <button
            onClick={() => open(moon)}
            aria-label={t('hero.open', { name: moon.name })}
            className="group relative block w-full aspect-[5/4] rounded-2xl overflow-hidden bg-ink border border-line"
          >
            <img
              src={moon.image}
              alt={tx(moon, 'imageCaption')}
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover object-[62%_50%]"
            />
            <span className="absolute top-3 left-3 text-xs bg-page/90 text-fg px-2 py-1 rounded-md">
              {plateLabel(moon)}
            </span>
            <span className="absolute top-3 right-3 text-xs text-fg bg-page/90 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
              {t('quiz.dossier')}
            </span>
          </button>

          <button
            onClick={() => open(mars)}
            aria-label={t('hero.open', { name: mars.name })}
            className="group absolute bottom-0 left-4 sm:-left-6 w-[38%] sm:w-[34%] aspect-[3/4] rounded-xl overflow-hidden bg-ink border-4 border-page"
          >
            <img
              src={mars.image}
              alt={tx(mars, 'imageCaption')}
              decoding="async"
              className="w-full h-full object-cover object-[70%_40%]"
            />
            <span className="absolute bottom-2 left-2 right-2 text-xs bg-page/90 text-fg px-2 py-1 rounded-md text-left leading-snug">
              {plateLabel(mars)}
            </span>
          </button>

          <figcaption className="absolute bottom-0 right-0 w-[56%] sm:w-[58%] text-right space-y-1">
            <CatalogueTag artifact={moon} className="block" />
            <span className="block text-xs text-fg-2">
              {moon.imageNasaId} · {moon.imageCredit} — {mars.imageNasaId} · {mars.imageCredit}
            </span>
          </figcaption>
        </figure>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-12">
        <dl className="pt-6 border-t border-line grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-5">
          {(['stat1', 'stat2', 'stat3', 'stat4'] as const).map((k) => (
            <div key={k} className="flex flex-col-reverse">
              <dt className="mt-1 text-xs text-fg-2">{t(`hero.${k}`)}</dt>
              <dd className="font-mono-data text-lg text-fg">{t(`hero.${k}.value`)}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-fg-2">
          <span>{t('hero.tagline')}</span>
          <button onClick={onStartExploring} className="flex items-center gap-2 text-fg-2 hover:text-fg transition-colors">
            <span>{t('hero.scroll')}</span>
            <ArrowDown className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};
