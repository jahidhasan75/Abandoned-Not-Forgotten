import React, { useEffect, useRef, useState } from 'react';
import { MissionArtifact } from '../types/mission';
import { spaceAudio } from '../utils/audio';
import { useI18n } from '../i18n/I18nProvider';
import { DossierLive } from './DossierLive';
import { X, ExternalLink, Link2, Check } from 'lucide-react';
import { CatalogueTag } from './CatalogueTag';
import { NasaVideoFigure } from './NasaVideoFigure';
import { VIDEOS } from '../data/videos';
import { STATUS_COLORS } from '../data/status';

interface MachineDetailModalProps {
  artifact: MissionArtifact | null;
  onClose: () => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

export const MachineDetailModal: React.FC<MachineDetailModalProps> = ({ artifact, onClose }) => {
  const { t, tx, txScience, lang } = useI18n();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => setCopied(false), [artifact]);

  // Copy this dossier's own address (#machine=<id>) so it can be shared with a class.
  const copyLink = async () => {
    if (!artifact) return;
    spaceAudio.playTelemetryPing(1040, 0.05);
    const url = `${window.location.origin}${window.location.pathname}${window.location.search}#machine=${artifact.id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Older browsers or blocked clipboard: select the text through a temporary field
      const field = document.createElement('textarea');
      field.value = url;
      document.body.appendChild(field);
      field.select();
      document.execCommand('copy');
      field.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (!artifact) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Move focus into the dialog and scroll it back to the top for each new artifact
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.scrollTop = 0;
      dialog.focus({ preventScroll: true });
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      // Keep Tab focus inside the dialog
      if (e.key === 'Tab' && dialog) {
        const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [artifact, onClose]);

  if (!artifact) return null;

  const sectionHeading = 'text-sm text-fg-2 mb-3';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-ink/85 animate-backdropIn"
      onMouseDown={(e) => {
        // Close when the dark backdrop (not the dialog) is clicked
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative w-full max-w-4xl max-h-[90vh] bg-card border border-line rounded-2xl overflow-y-auto overscroll-contain flex flex-col focus:outline-none animate-modalIn"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Sticky bar: where you are, and a way out */}
        <div className="sticky top-0 z-30 bg-card px-6 py-3 border-b border-line flex items-center justify-between gap-4">
          <span className="text-sm text-fg-2 truncate">
            {t('modal.sector', { body: t(`body.name.${artifact.destination}`) })} · {t(`category.${artifact.category}`)}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-fg-2 hover:text-fg hover:bg-raised transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-accent" strokeWidth={1.5} aria-hidden="true" />
              ) : (
                <Link2 className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
              )}
              <span aria-live="polite">{copied ? t('modal.copied') : t('modal.copyLink')}</span>
            </button>
            <button
              onClick={() => {
                spaceAudio.playTelemetryPing(700, 0.04);
                onClose();
              }}
              aria-label={t('modal.close')}
              className="p-2 rounded-lg text-fg-2 hover:text-fg hover:bg-raised transition-colors"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div className="px-6 sm:px-10 pt-8 pb-10">
          {/* Title, then the catalogue tag: the object label */}
          <header>
            <h2 id="modal-title" className="text-3xl sm:text-4xl text-fg leading-tight">
              {artifact.name}
            </h2>
            <CatalogueTag artifact={artifact} className="mt-3" />
            <p className="mt-3 text-base text-fg-2">
              {artifact.mission} · {tx(artifact, 'role')}
            </p>
            <p className="mt-2 flex items-start gap-2 text-sm text-fg">
              <span className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLORS[artifact.status] }} aria-hidden="true" />
              <span>
                {t(`status.${artifact.status}`)}
                <span className="text-fg-2"> · {tx(artifact, 'statusDescription')}</span>
              </span>
            </p>
          </header>

          {/* The visual centre: then and now when LRO has photographed the site, else the surface photo */}
          {artifact.orbitalView ? (
            <section className="mt-8 scroll-mt-20" aria-labelledby="then-now">
              <h3 id="then-now" className="sr-only">{t('modal.orbitTitle')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <figure>
                  <div className="rounded-xl overflow-hidden bg-ink aspect-square">
                    <img src={artifact.image} alt={tx(artifact, 'imageCaption')} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <figcaption className="mt-2">
                    <span className="block text-sm text-fg">{t('modal.thenLabel')}</span>
                    <span className="block text-xs text-fg-2 mt-1">{tx(artifact, 'imageCaption')}</span>
                    <span className="block catalogue-tag mt-1">{t('modal.photo', { id: artifact.imageNasaId })}</span>
                  </figcaption>
                </figure>
                <figure>
                  <div className="rounded-xl overflow-hidden bg-ink aspect-square">
                    <img src={artifact.orbitalView.image} alt={tx(artifact, 'orbitalCaption')} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <figcaption className="mt-2">
                    <span className="block text-sm text-fg">{t('modal.nowLabel')}</span>
                    <span className="block text-xs text-fg-2 mt-1">{tx(artifact, 'orbitalCaption')}</span>
                    <span className="block catalogue-tag mt-1">
                      {artifact.orbitalView.credit} · {artifact.orbitalView.nasaId}
                    </span>
                  </figcaption>
                </figure>
              </div>
              <p className="mt-3 text-xs text-fg-2">{t('modal.orbitNote')}</p>
            </section>
          ) : (
            <figure className="mt-8">
              <div className="rounded-xl overflow-hidden bg-ink aspect-[16/9]">
                <img src={artifact.image} alt={artifact.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </div>
              <figcaption className="mt-2 flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-xs text-fg-2">{tx(artifact, 'imageCaption')}</span>
                <span className="catalogue-tag shrink-0">{t('modal.photo', { id: artifact.imageNasaId })}</span>
              </figcaption>
            </figure>
          )}

          {/* NASA video about this object, when the library has one */}
          {VIDEOS[artifact.id] && <NasaVideoFigure key={artifact.id} video={VIDEOS[artifact.id]} />}

          {/* Story beside the key facts */}
          <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h3 className={sectionHeading}>{t('modal.narrative')}</h3>
              <p className="text-base text-fg leading-relaxed">{tx(artifact, 'story')}</p>
              <p className="mt-3 catalogue-tag">
                {t('modal.timeline', { left: artifact.leftBehind, last: artifact.lastContact ?? t('modal.stillActive') })}
              </p>
            </div>
            <dl className="space-y-4 text-sm md:border-l md:border-line md:pl-6">
              <div>
                <dt className="text-xs text-fg-2">{t('modal.landingYear')}</dt>
                <dd className="mt-1 font-mono-data text-fg">{artifact.landingYear}</dd>
              </div>
              <div>
                <dt className="text-xs text-fg-2">{t('modal.daysActive')}</dt>
                <dd className="mt-1 font-mono-data text-fg">
                  {artifact.daysActive} {typeof artifact.daysActive === 'number' ? t('modal.daysUnit') : ''}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-fg-2">{t('modal.location')}</dt>
                <dd className="mt-1 text-fg">{tx(artifact, 'locationName').split('(')[0]}</dd>
              </div>
              <div>
                <dt className="text-xs text-fg-2">{t('modal.coordinates')}</dt>
                <dd className="mt-1 font-mono-data text-fg">
                  {artifact.coordinates.lat}, {artifact.coordinates.lng}
                </dd>
              </div>
            </dl>
          </section>

          {/* Live: elapsed days (computed), today's signal travel time (JPL Horizons), latest rover image */}
          <div className="mt-10">
            <DossierLive artifact={artifact} />
          </div>

          {artifact.historicalQuote && (
            <blockquote className="mt-10 border-l-2 border-line-strong pl-5">
              <p className="font-serif text-xl text-fg leading-snug">“{artifact.historicalQuote.text}”</p>
              <footer className="mt-2 text-sm text-fg-2">{artifact.historicalQuote.author}</footer>
            </blockquote>
          )}

          <section className="mt-10">
            <h3 className={sectionHeading}>{t('modal.science')}</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm text-fg list-disc pl-4 marker:text-fg-3">
              {txScience(artifact).map((sc, i) => (
                <li key={i}>{sc}</li>
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <h3 className={sectionHeading}>{t('modal.subsystems')}</h3>
            {lang === 'bn' && <p className="text-xs text-fg-2 mb-3">{t('lang.partialNote')}</p>}
            <ol className="divide-y divide-line border-y border-line">
              {artifact.subsystems.map((sub, i) => (
                <li key={i} className="py-4 grid grid-cols-[40px_1fr] gap-x-4">
                  <span className="font-mono-data text-xs text-fg-3 pt-1">{String(i + 1).padStart(2, '0')}</span>
                  <div className="text-sm">
                    <p className="text-fg font-medium">{sub.name}</p>
                    <p className="mt-1 text-fg-2">{sub.description}</p>
                    <p className="mt-1 text-fg-2">
                      <span className="text-fg">{t('modal.significance')}:</span> {sub.significance}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-10">
            <h3 className={sectionHeading}>{t('modal.whyLeft')}</h3>
            <p className="text-base text-fg leading-relaxed">{tx(artifact, 'whyLeftBehind')}</p>
          </section>

          {artifact.funFacts.length > 0 && (
            <section className="mt-10">
              <h3 className={sectionHeading}>{t('modal.trivia')}</h3>
              <ul className="space-y-2 text-sm text-fg-2 list-disc pl-4 marker:text-fg-3">
                {artifact.funFacts.map((fact, idx) => (
                  <li key={idx}>{fact}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Sources: every dossier links to where its facts and photo come from */}
          <section className="mt-10 pt-6 border-t border-line">
            <h3 className={sectionHeading}>{t('modal.sources')}</h3>
            <ul className="space-y-2 text-sm">
              {artifact.sources.map((src) => (
                <li key={src.url}>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-fg-2 hover:text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg transition-colors"
                  >
                    <span>{src.label}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                    <span className="sr-only">{t('modal.newTab')}</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 catalogue-tag">
              {t('modal.credit', { credit: artifact.imageCredit, id: artifact.imageNasaId, nssdc: artifact.nssdcId })}
            </p>
          </section>
        </div>

        <div className="sticky bottom-0 z-30 bg-card px-6 py-3 border-t border-line flex items-center justify-between text-xs">
          <span className="text-fg-2">
            <span className="hidden sm:inline">{t('modal.escHint')}</span>
          </span>
          <button
            onClick={() => {
              spaceAudio.playTelemetryPing(700, 0.04);
              onClose();
            }}
            className="btn-primary py-2"
          >
            {t('modal.closeBtn')}
          </button>
        </div>
      </div>
    </div>
  );
};
