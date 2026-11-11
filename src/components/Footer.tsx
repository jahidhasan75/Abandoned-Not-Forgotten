import React from 'react';
import { spaceAudio } from '../utils/audio';
import { useI18n } from '../i18n/I18nProvider';
import { ArrowUp, ExternalLink } from 'lucide-react';
import { CHALLENGE_URL } from './ChallengeFit';

interface FooterProps {
  onScrollToTop: () => void;
  onExploreAgain: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToTop, onExploreAgain }) => {
  const { t } = useI18n();
  return (
    <footer className="relative bg-page border-t border-line overflow-hidden">
      {/* Closing: a quiet last page, left-aligned like the hero */}
      <div className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <p className="section-label">{t('footer.kicker')}</p>
          <h2 className="mt-4 text-3xl sm:text-5xl text-fg leading-tight">{t('footer.title')}</h2>
          <p className="mt-4 font-serif text-xl sm:text-2xl text-fg-2 leading-snug">{t('footer.quote')}</p>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              spaceAudio.playTelemetryPing(880, 0.08);
              onExploreAgain();
            }}
            className="btn-primary"
          >
            {t('footer.again')}
          </button>
          <button onClick={onScrollToTop} aria-label={t('footer.top')} className="btn-secondary px-3">
            <ArrowUp className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="border-t border-line bg-card py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8 text-sm text-fg-2">
          <div className="space-y-3 max-w-2xl">
            <p className="text-fg font-medium">
              EXOARCHIVE <span className="text-fg-3 font-normal">· {t('brand.tagline')}</span>
            </p>
            <p className="leading-relaxed">{t('footer.about')}</p>
            <p className="text-xs leading-relaxed">{t('footer.notice')}</p>
          </div>

          <div className="flex flex-col gap-2 text-sm shrink-0">
            <a
              href={CHALLENGE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 hover:text-fg transition-colors"
            >
              {t('footer.challenge')}
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
              <span className="sr-only">{t('modal.newTab')}</span>
            </a>
            <a
              href="https://www.spaceappschallenge.org"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 hover:text-fg transition-colors"
            >
              NASA Space Apps 2026
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
            </a>
            <span>{t('footer.repo')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
