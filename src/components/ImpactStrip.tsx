import React from 'react';
import { useI18n } from '../i18n/I18nProvider';

/** Who the archive is for, how it is used, and how it grows (the Impact criterion, stated plainly). */
export const ImpactStrip: React.FC = () => {
  const { t } = useI18n();
  const items = [
    { title: t('impact.learners.title'), body: t('impact.learners.body') },
    { title: t('impact.access.title'), body: t('impact.access.body') },
    { title: t('impact.open.title'), body: t('impact.open.body') },
  ];
  return (
    <section id="who" aria-labelledby="impact-title" className="relative bg-page border-t border-line py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="impact-title" className="section-label font-sans mb-6">
          {t('impact.kicker')}
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
          {items.map(({ title, body }) => (
            <li key={title} className="pt-4 border-t border-line-strong">
              <h3 className="font-serif text-xl text-fg">{title}</h3>
              <p className="mt-2 text-sm text-fg-2 leading-relaxed">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
