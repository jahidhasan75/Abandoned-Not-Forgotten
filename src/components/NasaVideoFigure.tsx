import React, { useId, useState } from 'react';
import { ExternalLink, Film } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';
import { isOfflineMode } from '../lib/live/live';
import { NasaVideo, videoPage, videoPoster, videoSrc } from '../data/videos';

/**
 * A NASA video in the dossier. Nothing downloads until the visitor presses play (preload="none"),
 * so weak connections only pay for the poster frame. Offline, it says why it cannot play.
 */
export const NasaVideoFigure: React.FC<{ video: NasaVideo }> = ({ video }) => {
  const { t, lang } = useI18n();
  const [failed, setFailed] = useState(false);
  const headingId = useId();
  const offline = isOfflineMode() || (typeof navigator !== 'undefined' && navigator.onLine === false);

  return (
    <figure className="mt-6" aria-labelledby={headingId}>
      <h3 id={headingId} className="mb-2 flex items-center gap-2 text-sm text-fg-2">
        <Film className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
        {t('video.kicker')}
      </h3>
      {offline || failed ? (
        <div className="rounded-xl bg-ink aspect-[16/9] flex items-center justify-center p-6 text-center">
          <p className="text-sm text-fg-2 max-w-sm">{t('video.offline')}</p>
        </div>
      ) : (
        <video
          controls
          preload="none"
          playsInline
          poster={videoPoster(video)}
          src={videoSrc(video)}
          onError={() => setFailed(true)}
          className="w-full aspect-[16/9] rounded-xl bg-ink"
        >
          {t('video.offline')}
        </video>
      )}
      <figcaption className="mt-2 flex flex-col gap-1">
        <span className="text-sm text-fg" lang="en">
          {video.title}
        </span>
        {video.note && <span className="text-xs text-fg-2">{video.note[lang]}</span>}
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="catalogue-tag">
            NASA/{video.center} · {video.date}
          </span>
          <a
            href={videoPage(video)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-fg-2 hover:text-fg underline decoration-line-strong underline-offset-2"
          >
            {t('video.page')}
            <ExternalLink className="w-3 h-3" strokeWidth={1.5} aria-hidden="true" />
            <span className="sr-only">{t('modal.newTab')}</span>
          </a>
        </span>
      </figcaption>
    </figure>
  );
};
