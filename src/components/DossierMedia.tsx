import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Images, Play } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';
import { spaceAudio } from '../utils/audio';
import { isOfflineMode } from '../lib/live/live';
import type { MissionArtifact } from '../types/mission';
import { VIDEOS, videoPage, videoPoster, videoSrc } from '../data/videos';

interface DossierMediaProps {
  artifact: MissionArtifact;
  /** Start with the NASA video playing (e.g. opened from a "Video" badge). */
  autoPlay?: boolean;
}

/**
 * The visual centre of a dossier. The NASA photograph shows first (with the same site from orbit when
 * LRO has one). If NASA has a video of the object, the photo carries a play button: pressing it puts
 * the video in the photo's place and starts it. Nothing is shown twice, and nothing downloads until play.
 */
export const DossierMedia: React.FC<DossierMediaProps> = ({ artifact, autoPlay = false }) => {
  const { t, tx, lang } = useI18n();
  const video = VIDEOS[artifact.id];
  const offline = isOfflineMode() || (typeof navigator !== 'undefined' && navigator.onLine === false);
  const canPlay = !!video && !offline;
  const [playing, setPlaying] = useState(autoPlay && canPlay);
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // A new dossier starts on its photo (or on the video, when asked)
  useEffect(() => {
    setPlaying(autoPlay && canPlay);
    setFailed(false);
  }, [artifact.id, autoPlay, canPlay]);

  // The click that opened the video is the user gesture that allows playback with sound
  useEffect(() => {
    if (playing) videoRef.current?.play().catch(() => undefined);
  }, [playing]);

  const play = () => {
    if (!canPlay) return;
    spaceAudio.playTelemetryPing(1100, 0.06);
    setPlaying(true);
  };
  const backToPhotos = () => {
    spaceAudio.playTelemetryPing(800, 0.04);
    videoRef.current?.pause();
    setPlaying(false);
  };

  /** A photo; when there is a video, the photo itself is the play button. */
  const photo = (src: string, alt: string, aspect: string, withPlay: boolean) =>
    withPlay && canPlay ? (
      <button
        type="button"
        onClick={play}
        aria-label={`${t('video.play')}: ${video!.title}`}
        className={`group relative block w-full ${aspect} rounded-xl overflow-hidden bg-ink`}
      >
        <img src={src} alt={alt} loading="lazy" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
        <span className="theme-dark absolute inset-0 flex items-center justify-center bg-ink/20 group-hover:bg-ink/35 transition-colors">
          <span className="inline-flex items-center gap-2 rounded-full bg-ink/85 border border-line-strong px-4 py-2 text-sm text-fg transition-transform group-hover:scale-105 motion-reduce:transition-none">
            <Play className="w-4 h-4" strokeWidth={2} fill="currentColor" aria-hidden="true" />
            {t('video.play')}
          </span>
        </span>
      </button>
    ) : (
      <div className={`${aspect} rounded-xl overflow-hidden bg-ink`}>
        <img src={src} alt={alt} loading="lazy" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
      </div>
    );

  const offlineNote = video && offline && <p className="mt-2 text-xs text-fg-2">{t('video.offline')}</p>;

  if (playing && video) {
    return (
      <figure className="mt-8 animate-fadeIn">
        {failed ? (
          <div className="theme-dark rounded-xl bg-ink aspect-[16/9] flex items-center justify-center p-6 text-center">
            <p className="text-sm text-fg-2 max-w-sm">{t('video.offline')}</p>
          </div>
        ) : (
          <video
            ref={videoRef}
            controls
            autoPlay
            playsInline
            preload="auto"
            poster={videoPoster(video)}
            src={videoSrc(video)}
            onError={() => setFailed(true)}
            className="w-full aspect-[16/9] rounded-xl bg-ink"
          />
        )}
        <figcaption className="mt-2 flex flex-col gap-1">
          <span className="text-sm text-fg" lang="en">
            {video.title}
          </span>
          {video.note && <span className="text-xs text-fg-2">{video.note[lang]}</span>}
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="catalogue-tag">
              {t('video.kicker')} · NASA/{video.center} · {video.date}
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
            <button
              type="button"
              onClick={backToPhotos}
              className="inline-flex items-center gap-1 text-xs text-fg-2 hover:text-fg underline decoration-line-strong underline-offset-2"
            >
              <Images className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
              {t('video.photos')}
            </button>
          </span>
        </figcaption>
      </figure>
    );
  }

  if (artifact.orbitalView) {
    return (
      <section className="mt-8 scroll-mt-20" aria-labelledby="then-now">
        <h3 id="then-now" className="sr-only">
          {t('modal.orbitTitle')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <figure>
            {photo(artifact.image, tx(artifact, 'imageCaption'), 'aspect-square', true)}
            <figcaption className="mt-2">
              <span className="block text-sm text-fg">{t('modal.thenLabel')}</span>
              <span className="block text-xs text-fg-2 mt-1">{tx(artifact, 'imageCaption')}</span>
              <span className="block catalogue-tag mt-1">{t('modal.photo', { id: artifact.imageNasaId })}</span>
            </figcaption>
          </figure>
          <figure>
            {photo(artifact.orbitalView.image, tx(artifact, 'orbitalCaption'), 'aspect-square', false)}
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
        {offlineNote}
      </section>
    );
  }

  return (
    <figure className="mt-8">
      {photo(artifact.image, tx(artifact, 'imageCaption'), 'aspect-[16/9]', true)}
      <figcaption className="mt-2 flex flex-col sm:flex-row sm:justify-between gap-1">
        <span className="text-xs text-fg-2">{tx(artifact, 'imageCaption')}</span>
        <span className="catalogue-tag shrink-0">{t('modal.photo', { id: artifact.imageNasaId })}</span>
      </figcaption>
      {offlineNote}
    </figure>
  );
};
