import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { spaceAudio } from '../utils/audio';
import { useI18n } from '../i18n/I18nProvider';
import { JOURNEYS } from '../data/journeys';
import { MISSIONS_DATA } from '../data/missionsData';
import type { MissionArtifact } from '../types/mission';

interface OneMachineJourneyProps {
  onOpenMachine: (id: string) => void;
}

const artifactOf = (id: string) => MISSIONS_DATA.find((m) => m.id === id) as MissionArtifact;

export const OneMachineJourney: React.FC<OneMachineJourneyProps> = ({ onOpenMachine }) => {
  const { t, lang } = useI18n();
  const [selectedId, setSelectedId] = useState<string>(JOURNEYS[0].artifactId);

  const journey = JOURNEYS.find((j) => j.artifactId === selectedId) || JOURNEYS[0];
  const artifact = artifactOf(journey.artifactId);
  const num = (n: number) => n.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US');

  // Scroll progress: a light runs down the timeline as the middle of the screen passes each
  // stage (blue in the light theme, green in the dark one: the --color-journey token).
  const listRef = useRef<HTMLOListElement | null>(null);
  const lineRef = useRef<HTMLSpanElement | null>(null);
  const [reached, setReached] = useState(-1);

  useEffect(() => {
    const list = listRef.current;
    const line = lineRef.current;
    if (!list || !line) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = list.getBoundingClientRect();
      const centre = window.innerHeight / 2;
      const dots = Array.from(list.querySelectorAll<HTMLElement>('[data-journey-dot]'));
      if (dots.length === 0) return;
      // Dot centres, measured from the top of the list
      const ys = dots.map((d) => d.getBoundingClientRect().top + d.offsetHeight / 2 - rect.top);
      const progress = Math.min(Math.max(centre - rect.top, 0), ys[ys.length - 1]);
      line.style.height = `${progress}px`;
      let last = -1;
      ys.forEach((y, i) => {
        if (progress >= y - 0.5) last = i;
      });
      setReached(last);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [selectedId, lang]);

  return (
    <section id="journey" className="relative py-12 sm:py-20 lg:py-24 bg-page border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="section-label">{t('journey.kicker')}</p>
            <h2 className="mt-2 text-2xl sm:text-3xl text-fg">{t('journey.title')}</h2>
            <p className="mt-3 text-base text-fg-2 max-w-xl">{t('journey.intro')}</p>
          </div>

          <div
            className="flex flex-wrap items-center gap-1 p-1 border border-line rounded-xl max-w-full self-start md:self-auto"
            role="group"
            aria-label={t('journey.switch')}
          >
            {JOURNEYS.map((j) => (
              <button
                key={j.artifactId}
                onClick={() => {
                  spaceAudio.playTelemetryPing(920, 0.05);
                  setSelectedId(j.artifactId);
                }}
                aria-pressed={selectedId === j.artifactId}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  selectedId === j.artifactId ? 'bg-raised text-fg' : 'text-fg-2 hover:text-fg'
                }`}
              >
                {j.label}
              </button>
            ))}
          </div>
        </div>

        {/* A typeset chronology: the machine on the left (it stays in view), the stages beside it */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 lg:sticky lg:top-28 self-start">
            <h3 className="font-serif text-2xl text-fg">{artifact.name}</h3>
            <p className="mt-2 text-base text-fg-2">{journey.subtitle[lang]}</p>
            <p className="mt-3 catalogue-tag">
              {t(`body.name.${artifact.destination}`)} · {t('journey.stages', { n: num(journey.steps.length) })}
            </p>
            <button
              type="button"
              onClick={() => {
                spaceAudio.playTelemetryPing(1080, 0.07);
                onOpenMachine(artifact.id);
              }}
              className="btn-secondary mt-5"
            >
              {t('journey.dossier')}
            </button>

            <h4 className="mt-8 text-sm text-fg-2">{t('journey.sources')}</h4>
            <ul className="mt-2 space-y-1.5">
              {artifact.sources.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-start gap-1.5 text-xs text-fg-2 hover:text-fg underline decoration-line-strong underline-offset-2"
                  >
                    <span>{s.label}</span>
                    <ExternalLink className="w-3 h-3 mt-0.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                    <span className="sr-only">{t('modal.newTab')}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <ol ref={listRef} className="relative lg:col-span-8 border-l border-line">
            {/* The progress light, drawn over the hairline */}
            <span
              ref={lineRef}
              className="absolute top-0 -left-[1.5px] w-0.5 h-0 bg-journey transition-[height] duration-150 ease-out motion-reduce:transition-none"
              aria-hidden="true"
            />
            {journey.steps.map((step, idx) => {
              const s = step[lang];
              return (
                <li
                  key={`${journey.artifactId}-${idx}`}
                  className="relative pl-6 sm:pl-8 pb-10 last:pb-0"
                  aria-current={idx === reached ? 'step' : undefined}
                >
                  <span
                    data-journey-dot
                    className={`absolute -left-1 top-2 w-2 h-2 rounded-full transition-[background-color,transform,box-shadow] duration-300 motion-reduce:transition-none ${
                      idx <= reached ? 'bg-journey scale-125' : 'bg-fg-3'
                    } ${idx === reached ? 'journey-dot-current' : ''}`}
                    aria-hidden="true"
                  />
                  <p className="font-mono-data text-xs text-fg-2">
                    {num(idx + 1).padStart(2, lang === 'bn' ? '০' : '0')} · {s.when} · {s.badge}
                  </p>
                  <h4 className="mt-2 text-lg text-fg font-medium">{s.title}</h4>
                  <p className="mt-2 text-base text-fg-2 leading-relaxed max-w-2xl">{s.text}</p>
                  {s.fact && (
                    <p className="mt-2 text-sm text-fg-2 max-w-2xl">
                      <span className="text-fg">{t('journey.fact')}: </span>
                      {s.fact}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};
