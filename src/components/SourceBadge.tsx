import React from 'react';
import { DataSourceKind } from '../lib/live/live';
import { useI18n } from '../i18n/I18nProvider';

interface SourceBadgeProps {
  source: DataSourceKind;
  fetchedAt: string;
  className?: string;
}

const STYLE: Record<DataSourceKind, string> = {
  live: 'text-fg border-line-strong',
  cache: 'text-fg-2 border-line',
  fixture: 'text-fg-2 border-line',
};

// The LIVE dot is the one place a dot pulses: the value really is live. It uses the ACTIVE status colour.
const DOT: Record<DataSourceKind, string> = {
  live: 'bg-[#62D9FF] animate-pulse',
  cache: 'bg-fg-2',
  fixture: 'bg-fg-3',
};

/** Shows where a value came from: LIVE, CACHED (with age) or OFFLINE COPY (with date). */
export const SourceBadge: React.FC<SourceBadgeProps> = ({ source, fetchedAt, className = '' }) => {
  const { t } = useI18n();

  let label: string;
  if (source === 'live') {
    label = t('live.badge.live');
  } else if (source === 'cache') {
    const mins = Math.max(0, Math.round((Date.now() - Date.parse(fetchedAt)) / 60_000));
    const ago =
      mins < 1
        ? t('live.ago.now')
        : mins < 60
          ? t('live.ago.min', { n: mins })
          : mins < 48 * 60
            ? t('live.ago.hour', { n: Math.round(mins / 60) })
            : t('live.ago.day', { n: Math.round(mins / 1440) });
    label = t('live.badge.cache', { ago });
  } else {
    label = t('live.badge.fixture', { date: fetchedAt.slice(0, 10) });
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-xs font-mono-data whitespace-nowrap ${STYLE[source]} ${className}`}
      title={`Fetched ${fetchedAt}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${DOT[source]}`}
        aria-hidden="true"
      />
      {label}
    </span>
  );
};
