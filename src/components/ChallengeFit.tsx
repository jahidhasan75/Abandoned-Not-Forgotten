import React from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';
import { spaceAudio } from '../utils/audio';

export const CHALLENGE_URL = 'https://www.spaceappschallenge.org/2026/challenges/nasas-discarded-equipment-storytelling/';

/** Each line: what the challenge asks (paraphrased), what this site does about it, and where to see it. */
const ROWS = [
  { key: 'story', to: [['machines', 'challenge.to.machines'], ['journey', 'challenge.to.journey']] },
  { key: 'audience', to: [['explorers', 'challenge.to.explorers']] },
  { key: 'science', to: [['science', 'challenge.to.science']] },
  { key: 'alive', to: [['status', 'challenge.to.status'], ['live', 'challenge.to.live']] },
  { key: 'map', to: [['archaeology-map', 'challenge.to.map'], ['explore', 'challenge.to.globe']] },
  { key: 'timeline', to: [['timeline-3d', 'challenge.to.timeline']] },
  { key: 'accuracy', to: [['data-sources', 'challenge.to.sources']] },
  { key: 'access', to: [['who', 'challenge.to.who']] },
] as const;

interface ChallengeFitProps {
  onNavigate: (sectionId: string) => void;
}

/** The official challenge, and how each part of its brief is answered on this site (the Relevance criterion). */
export const ChallengeFit: React.FC<ChallengeFitProps> = ({ onNavigate }) => {
  const { t } = useI18n();
  return (
    <section id="challenge" aria-labelledby="challenge-title" className="relative bg-page border-t border-line py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-4">
          <p className="section-label">{t('challenge.kicker')}</p>
          {/* The official title stays in English: it is the challenge's own name */}
          <h2 id="challenge-title" className="mt-2 text-2xl sm:text-3xl text-fg leading-snug" lang="en">
            Abandoned but not Forgotten: Storytelling about NASA’s Discarded Equipment on the Moon and Mars
          </h2>
          <p className="mt-4 text-base text-fg-2">{t('challenge.brief')}</p>
          <a
            href={CHALLENGE_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-fg-2 hover:text-fg underline decoration-line-strong underline-offset-2"
          >
            {t('challenge.read')}
            <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
            <span className="sr-only">{t('modal.newTab')}</span>
          </a>
        </div>

        <div className="lg:col-span-8">
          <div className="hidden sm:grid grid-cols-12 gap-4 pb-2 border-b border-line text-xs text-fg-2">
            <span className="col-span-4">{t('challenge.col.asks')}</span>
            <span className="col-span-8">{t('challenge.col.here')}</span>
          </div>
          <ol className="divide-y divide-line">
            {ROWS.map((row) => (
              <li key={row.key} className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-x-4 gap-y-1">
                <p className="sm:col-span-4 text-base text-fg">{t(`challenge.ask.${row.key}`)}</p>
                <div className="sm:col-span-8">
                  <p className="text-sm text-fg-2 leading-relaxed">{t(`challenge.here.${row.key}`)}</p>
                  <p className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                    {row.to.map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          spaceAudio.playTelemetryPing(900, 0.05);
                          onNavigate(id);
                        }}
                        className="group inline-flex items-center gap-1 text-sm text-fg hover:text-fg underline decoration-line-strong underline-offset-2 hover:decoration-fg"
                      >
                        {t(label)}
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" strokeWidth={1.5} aria-hidden="true" />
                      </button>
                    ))}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
