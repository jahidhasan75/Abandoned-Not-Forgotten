import React, { useState, useRef, useCallback } from 'react';
import { ChevronsLeftRight } from 'lucide-react';
import { spaceAudio } from '../utils/audio';
import { useI18n } from '../i18n/I18nProvider';
import { ASSET_IMAGES } from '../assets/images';

export const BeforeAfterSlider: React.FC = () => {
  const { t } = useI18n();
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(pct);
  }, []);

  // Pointer events cover mouse, touch and pen. Clicking anywhere jumps the divider there.
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    handleMove(e.clientX);
    spaceAudio.playTelemetryPing(850, 0.03);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) handleMove(e.clientX);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2;
    let next: number | null = null;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = sliderPosition - step;
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = sliderPosition + step;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = 100;
    if (next !== null) {
      e.preventDefault();
      setSliderPosition(Math.max(0, Math.min(100, next)));
    }
  };

  return (
    <section className="relative py-12 sm:py-20 lg:py-24 bg-page border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="section-label">{t('slider.kicker')}</p>
            <h2 className="mt-2 text-2xl sm:text-3xl text-fg">
              {t('slider.title')}
            </h2>
            <p className="mt-3 text-base text-fg-2 max-w-xl">
              {t('slider.intro')}
            </p>
          </div>

          <div className="md:text-right">
            <span className="text-xs font-mono-data text-fg-2 block">
              {t('slider.position', { a: Math.round(sliderPosition), b: 100 - Math.round(sliderPosition) })}
            </span>
            <span className="text-xs text-fg-2">{t('slider.hint')}</span>
          </div>
        </div>

        {/* Draggable Stage Container */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="slider"
          aria-label="Compare mission day one with years later"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(sliderPosition)}
          aria-valuetext={`${Math.round(sliderPosition)}% mission day one`}
          className="relative w-full h-96 sm:h-120 md:h-140 rounded-2xl overflow-hidden select-none touch-pan-y cursor-ew-resize bg-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-fg"
        >
          {/* Base layer: InSight final selfie, April 2022 (right side) */}
          <div className="absolute inset-0">
            <img
              src={ASSET_IMAGES.insightFinal}
              alt={t('slider.afterAlt')}
              referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
              className="w-full h-full object-cover object-top pointer-events-none"
            />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink/80 to-transparent pointer-events-none" />

            {/* Right Side Annotation Label */}
            <div className="absolute bottom-4 right-4 z-10 text-right pointer-events-none bg-page/90 p-3 rounded-lg max-w-xs">
              <p className="font-mono-data text-xs text-fg mb-1">{t('slider.after')}</p>
              <p className="text-xs text-fg-2">
                {t('slider.afterText')}
              </p>
            </div>
          </div>

          {/* Top layer: InSight first selfie, Dec 2018 (clipped to sliderPosition) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <div className="relative h-full w-full">
              <img
                src={ASSET_IMAGES.insightFirst}
                alt={t('slider.beforeAlt')}
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-top pointer-events-none"
              />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink/80 to-transparent pointer-events-none" />

              {/* Left Side Annotation Label */}
              <div className="absolute bottom-4 left-4 z-10 pointer-events-none bg-page/90 p-3 rounded-lg max-w-xs">
                <p className="font-mono-data text-xs text-fg mb-1">{t('slider.before')}</p>
                <p className="text-xs text-fg-2">
                  {t('slider.beforeText')}
                </p>
              </div>
            </div>
          </div>

          {/* Dividing Draggable Handle Line */}
          <div
            className="absolute top-0 bottom-0 w-px -translate-x-1/2 bg-fg z-20 pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-fg text-ink flex items-center justify-center">
              <ChevronsLeftRight className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
            </div>
          </div>

          {/* Top Center Pill-free Badge */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-page/90 px-3 py-1 rounded text-xs text-fg-2 pointer-events-none">
            {t('slider.badge')}
          </div>
        </div>

        {/* Poetic Center Caption */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <p className="font-serif text-xl text-fg">{t('slider.quote')}</p>
          <p className="catalogue-tag">
            {t('slider.credit')}
          </p>
        </div>
      </div>
    </section>
  );
};
