import React, { useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { spaceAudio } from '../utils/audio';
import { ASSET_IMAGES } from '../assets/images';
import { useI18n } from '../i18n/I18nProvider';

interface HeroProps {
  onStartExploring: () => void;
  onOpenMap: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartExploring, onOpenMap }) => {
  const { t } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // A still, sparse starfield in the dark sky above the photo. Drawn once per resize: no drift,
  // no animation loop.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const width = (canvas.width = window.innerWidth);
      const height = (canvas.height = window.innerHeight);
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < 70; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height * 0.6;
        ctx.fillStyle = `rgba(238, 240, 245, ${Math.random() * 0.35 + 0.1})`;
        ctx.beginPath();
        ctx.arc(x, y, Math.random() * 0.9 + 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, []);

  return (
    <section id="hero" className="theme-dark relative min-h-screen flex flex-col justify-between pt-24 pb-8 overflow-hidden bg-page">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" aria-hidden="true" />

      {/* The Apollo 11 photo: the lunar module's shadow falls on the right, the calm regolith on the
          left carries the text. A neutral scrim keeps the text at AA contrast. */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={ASSET_IMAGES.hero}
          alt={t('hero.imageAlt')}
          fetchPriority="high"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-[70%_center] opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-page via-page/80 to-page/20" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-page to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-12">
        <div className="max-w-2xl">
          <p className="section-label">
            {t('hero.kicker1')} <span className="text-fg-3">·</span> {t('hero.kicker2')}
          </p>

          <h1 className="mt-5 text-4xl sm:text-6xl lg:text-7xl text-fg leading-[1.05] tracking-tight">
            {t('hero.title1')} {t('hero.title2')} {t('hero.title3')}
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-fg leading-snug">
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

          <dl className="mt-12 pt-6 border-t border-line grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-5 max-w-3xl">
            {(['stat1', 'stat2', 'stat3', 'stat4'] as const).map((k) => (
              <div key={k} className="flex flex-col-reverse">
                <dt className="mt-1 text-xs text-fg-2">{t(`hero.${k}`)}</dt>
                <dd className="font-mono-data text-lg text-fg">{t(`hero.${k}.value`)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-fg-2">
        <span>{t('hero.tagline')}</span>
        <span className="hidden md:block catalogue-tag">{t('hero.imageCredit')}</span>
        <button
          onClick={onStartExploring}
          className="flex items-center gap-2 text-fg-2 hover:text-fg transition-colors"
        >
          <span>{t('hero.scroll')}</span>
          <ArrowDown className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};
