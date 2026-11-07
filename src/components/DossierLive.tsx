import React from 'react';
import { ExternalLink } from 'lucide-react';
import { MissionArtifact } from '../types/mission';
import { useI18n } from '../i18n/I18nProvider';
import { useLive } from '../lib/live/useLive';
import { daysSince, yearsSince } from '../lib/compute';
import { SourceBadge } from './SourceBadge';
import { useLightTimeText } from './LiveBand';

/**
 * Live facts for one artifact: days since contact ended (computed locally from the catalogued
 * date), today's radio travel time from Earth (JPL Horizons), and for working rovers their
 * latest raw image (mars.nasa.gov).
 */
export const DossierLive: React.FC<{ artifact: MissionArtifact }> = ({ artifact }) => {
  const { t, lang } = useI18n();
  const lightText = useLightTimeText();
  const loc = lang === 'bn' ? 'bn-BD' : 'en-US';
  const body = artifact.destination === 'MOON' ? 'moon' : 'mars';
  const range = useLive(body);
  const isRover = artifact.id === 'curiosity' || artifact.id === 'perseverance';
  const rover = useLive(isRover ? (artifact.id as 'curiosity' | 'perseverance') : 'curiosity', isRover);

  const elapsed = artifact.lastContact
    ? t('live.dossier.silentFor', {
        days: daysSince(artifact.lastContact).toLocaleString(loc),
        years: yearsSince(artifact.lastContact).toLocaleString(loc),
      })
    : artifact.status === 'INACTIVE'
      ? t('live.dossier.restingFor', { days: daysSince(artifact.leftBehind).toLocaleString(loc) })
      : artifact.category === 'INSTRUMENT'
      ? t('live.dossier.inUseFor', { days: daysSince(artifact.leftBehind).toLocaleString(loc) })
      : t('live.dossier.activeFor', { days: daysSince(artifact.leftBehind).toLocaleString(loc) });

  return (
    <div className="p-5 rounded-xl border border-line space-y-3">
      <h3 className="text-sm text-fg-2">{t('live.dossier.title')}</h3>

      <p className="text-lg font-mono-data text-accent">{elapsed}</p>

      <div className="flex flex-wrap items-center gap-2 text-sm text-fg-2">
        {range === undefined && <span className="text-xs text-fg-2">{t('live.loading')}</span>}
        {range && (
          <>
            <span>{t('live.dossier.signal', { t: lightText(range.data.lightTimeS) })}</span>
            <SourceBadge source={range.source} fetchedAt={range.fetchedAt} />
          </>
        )}
      </div>

      {isRover && rover && (
        <a
          href={rover.data.pageUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-lg border border-line p-2 hover:bg-raised transition-colors"
        >
          <img src={rover.data.imageUrl} alt={`${artifact.name}: ${t('live.rover.latest')}`} className="w-20 h-20 object-cover rounded shrink-0" loading="lazy" />
          <div className="min-w-0 flex-1 text-xs">
            <div className="text-fg">{t('live.rover.latest')}</div>
            <div className="text-fg font-mono-data">
              {t('live.rover.sol', { sol: rover.data.sol.toLocaleString(loc) })} · {rover.data.instrument}
            </div>
            <div className="text-fg-2 font-mono-data">{t('live.rover.taken', { date: rover.data.takenUtc.slice(0, 16).replace('T', ' ') })}</div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <SourceBadge source={rover.source} fetchedAt={rover.fetchedAt} />
            <ExternalLink className="w-3.5 h-3.5 text-fg-2" strokeWidth={1.5} aria-hidden="true" />
          </div>
        </a>
      )}
    </div>
  );
};
