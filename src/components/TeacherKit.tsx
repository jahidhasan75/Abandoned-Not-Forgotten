import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Printer, Link2 } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';
import { spaceAudio } from '../utils/audio';
import { QUIZ_BANK, QuizItem } from '../data/quiz';
import { shuffle } from '../lib/quizPick';

const SHEET_SIZE = 10;
const STEPS = [
  { key: 's1', min: 5 },
  { key: 's2', min: 10 },
  { key: 's3', min: 10 },
  { key: 's4', min: 10 },
  { key: 's5', min: 10 },
] as const;

interface SheetItem {
  item: QuizItem;
  /** Display order of the options (0 is the correct one). */
  order: number[];
}

/** The "For teachers" tab of Young Explorers: a lesson plan, a printable worksheet and how to share a dossier. */
export const TeacherKit: React.FC = () => {
  const { t, lang } = useI18n();
  const [withKey, setWithKey] = useState(true);
  const [sheet, setSheet] = useState<SheetItem[] | null>(null);
  const num = (n: number) => n.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US');
  const letters = lang === 'bn' ? ['ক', 'খ', 'গ', 'ঘ'] : ['A', 'B', 'C', 'D'];

  const makeSheet = () => {
    spaceAudio.playTelemetryPing(1040, 0.06);
    setSheet(
      shuffle(QUIZ_BANK, Math.random)
        .slice(0, SHEET_SIZE)
        .map((item) => ({ item, order: shuffle([0, 1, 2, 3], Math.random) }))
    );
  };

  // Once the worksheet is in the page, print it; only #print-root is visible while printing.
  useEffect(() => {
    if (!sheet) return;
    document.body.classList.add('printing-sheet');
    const done = () => setSheet(null);
    window.addEventListener('afterprint', done);
    const frame = window.requestAnimationFrame(() => window.print());
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('afterprint', done);
      document.body.classList.remove('printing-sheet');
    };
  }, [sheet]);

  return (
    <div className="rounded-2xl border border-line bg-card p-6 sm:p-10 max-w-4xl mx-auto">
      <p className="section-label">{t('explorers.tab.teachers')}</p>
      <h3 className="mt-2 font-serif text-2xl sm:text-3xl text-fg">{t('teacher.title')}</h3>
      <p className="mt-3 text-base text-fg-2 max-w-2xl">{t('teacher.intro')}</p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-2">
          <h4 className="text-sm text-fg-2">{t('teacher.goals')}</h4>
          <ul className="mt-3 space-y-2 text-base text-fg list-disc pl-5 marker:text-fg-3">
            <li>{t('teacher.goal1')}</li>
            <li>{t('teacher.goal2')}</li>
            <li>{t('teacher.goal3')}</li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-sm text-fg-2">{t('teacher.plan')}</h4>
          <ol className="mt-3 border-t border-line divide-y divide-line">
            {STEPS.map((s, i) => (
              <li key={s.key} className="py-3 grid grid-cols-[4.5rem_1fr] gap-3">
                <span className="font-mono-data text-xs text-fg-2 pt-1">{t('teacher.min', { n: num(s.min) })}</span>
                <div>
                  <p className="text-base text-fg">
                    {num(i + 1)}. {t(`teacher.${s.key}.title`)}
                  </p>
                  <p className="mt-1 text-sm text-fg-2 leading-relaxed">{t(`teacher.${s.key}.body`)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-line grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-base text-fg flex items-center gap-2">
            <Printer className="w-4 h-4 text-fg-2" strokeWidth={1.5} aria-hidden="true" />
            {t('teacher.sheet')}
          </h4>
          <p className="mt-2 text-sm text-fg-2">{t('teacher.sheetBody')}</p>
          <label className="mt-4 flex items-center gap-2 text-sm text-fg cursor-pointer">
            <input
              type="checkbox"
              checked={withKey}
              onChange={(e) => setWithKey(e.target.checked)}
              className="w-4 h-4 accent-accent"
            />
            {t('teacher.withKey')}
          </label>
          <button type="button" onClick={makeSheet} className="btn-primary mt-4">
            {t('teacher.print')}
          </button>
        </div>
        <div>
          <h4 className="text-base text-fg flex items-center gap-2">
            <Link2 className="w-4 h-4 text-fg-2" strokeWidth={1.5} aria-hidden="true" />
            {t('teacher.share')}
          </h4>
          <p className="mt-2 text-sm text-fg-2">{t('teacher.shareBody')}</p>
        </div>
      </div>

      {sheet &&
        createPortal(
          <div id="print-root" lang={lang}>
            <h1 className="print-title">{t('sheet.title')}</h1>
            <p className="print-fields">
              <span>{t('sheet.name')}: ____________________</span>
              <span>{t('sheet.class')}: ________</span>
              <span>{t('sheet.date')}: ________</span>
            </p>
            <p className="print-instr">{t('sheet.instr')}</p>
            <ol className="print-questions">
              {sheet.map(({ item, order }) => {
                const text = item[lang];
                return (
                  <li key={item.id}>
                    <p>{text[0]}</p>
                    <ul>
                      {order.map((opt, i) => (
                        <li key={opt}>
                          {letters[i]}) {text[1][opt]}
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ol>
            {withKey && (
              <section className="print-key">
                <h2>{t('sheet.key')}</h2>
                <ol>
                  {sheet.map(({ item, order }) => (
                    <li key={item.id}>
                      {letters[order.indexOf(0)]}) {item[lang][1][0]}
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>,
          document.body
        )}
    </div>
  );
};
