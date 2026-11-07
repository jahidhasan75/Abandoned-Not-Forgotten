/**
 * Loaders for live NASA data. All endpoints need no key, allow browser CORS, and are called
 * directly from the static site (no backend). Results go through liveFetch() for caching and
 * offline fallback; scripts/fetch-fixtures.ts reuses these loaders to build the offline fixtures.
 */
import { auToKm, lightTimeSeconds, parseHorizonsRange } from '../compute';

export interface RoverLatest {
  rover: 'curiosity' | 'perseverance';
  sol: number;
  takenUtc: string;
  instrument: string;
  imageId: string;
  imageUrl: string;
  pageUrl: string;
  credit: string;
  sourceUrl: string;
}

export interface BodyRange {
  body: 'moon' | 'mars';
  timeUtc: string;
  distanceKm: number;
  lightTimeS: number;
  rangeRateKmS: number;
  sourceUrl: string;
}

export interface Apod {
  date: string;
  title: string;
  imageUrl: string;
  pageUrl: string;
  mediaType: string;
  copyright: string | null;
}

const TIMEOUT_MS = 9000;

async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...init, signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

// ---------- Mars rovers: mars.nasa.gov raw-image feeds (the api.nasa.gov Mars Rover Photos API is retired) ----------

const PREFERRED = /NAV|MAST|HAZ|MCZ|CHEMCAM|SKYCAM/i;

interface MslItem { sol: number; instrument: string; https_url: string; date_taken: string; imageid: string; link: string; image_credit?: string }

export async function loadCuriosity(): Promise<RoverLatest> {
  const url = 'https://mars.nasa.gov/api/v1/raw_image_items/?order=sol%20desc&per_page=40&page=0&condition_1=msl:mission';
  const data = await getJson<{ items: MslItem[] }>(url);
  if (!data.items?.length) throw new Error('Curiosity feed is empty');
  const latestSol = data.items[0].sol;
  const sameSol = data.items.filter((i) => i.sol === latestSol);
  const pick = sameSol.find((i) => PREFERRED.test(i.instrument)) ?? sameSol[0];
  return {
    rover: 'curiosity',
    sol: pick.sol,
    takenUtc: pick.date_taken,
    instrument: pick.instrument,
    imageId: pick.imageid,
    imageUrl: pick.https_url,
    pageUrl: `https://mars.nasa.gov${pick.link}`,
    credit: pick.image_credit || 'NASA/JPL-Caltech',
    sourceUrl: 'https://mars.nasa.gov/msl/multimedia/raw-images/',
  };
}

interface M20Image { sol: number; imageid: string; date_taken_utc: string; link: string; credit?: string; camera: { instrument: string }; image_files: { small: string; medium: string } }

export async function loadPerseverance(): Promise<RoverLatest> {
  const url = 'https://mars.nasa.gov/rss/api/?feed=raw_images&category=mars2020&feedtype=json&num=40&page=0&order=sol+desc';
  const data = await getJson<{ images: M20Image[] }>(url);
  if (!data.images?.length) throw new Error('Perseverance feed is empty');
  const latestSol = data.images[0].sol;
  const sameSol = data.images.filter((i) => i.sol === latestSol);
  const pick = sameSol.find((i) => PREFERRED.test(i.camera.instrument)) ?? sameSol[0];
  return {
    rover: 'perseverance',
    sol: pick.sol,
    takenUtc: pick.date_taken_utc.endsWith('Z') ? pick.date_taken_utc : `${pick.date_taken_utc}Z`,
    instrument: pick.camera.instrument,
    imageId: pick.imageid,
    imageUrl: pick.image_files.medium,
    pageUrl: pick.link,
    credit: pick.credit || 'NASA/JPL-Caltech',
    sourceUrl: 'https://mars.nasa.gov/mars2020/multimedia/raw-images/',
  };
}

// ---------- JPL Horizons: geocentric range to the Moon (301) and Mars (499) ----------

const HORIZONS_ID = { moon: '301', mars: '499' } as const;

const horizonsTime = (d: Date) => d.toISOString().slice(0, 16).replace('T', ' ');

export async function loadRange(body: 'moon' | 'mars', now: Date = new Date()): Promise<BodyRange> {
  const stop = new Date(now.getTime() + 60_000);
  const params = new URLSearchParams({
    format: 'json',
    COMMAND: `'${HORIZONS_ID[body]}'`,
    OBJ_DATA: "'NO'",
    MAKE_EPHEM: "'YES'",
    EPHEM_TYPE: "'OBSERVER'",
    CENTER: "'500@399'",
    START_TIME: `'${horizonsTime(now)}'`,
    STOP_TIME: `'${horizonsTime(stop)}'`,
    STEP_SIZE: "'1 m'",
    QUANTITIES: "'20'",
    CSV_FORMAT: "'YES'",
  });
  const data = await getJson<{ result: string }>(`https://ssd.jpl.nasa.gov/api/horizons.api?${params}`);
  const row = parseHorizonsRange(data.result);
  const distanceKm = auToKm(row.deltaAu);
  return {
    body,
    timeUtc: now.toISOString(),
    distanceKm,
    lightTimeS: lightTimeSeconds(distanceKm),
    rangeRateKmS: row.deldotKmS,
    sourceUrl: 'https://ssd.jpl.nasa.gov/horizons/',
  };
}

// ---------- APOD (api.nasa.gov). Today's entry sometimes errors, so walk back a few days. ----------

interface ApodResponse { date: string; title: string; url: string; hdurl?: string; media_type: string; thumbnail_url?: string; copyright?: string }

export async function loadApod(apiKey = 'DEMO_KEY', now: Date = new Date()): Promise<Apod> {
  let lastError: unknown = null;
  for (let back = 0; back < 4; back++) {
    const day = new Date(now.getTime() - back * 86_400_000).toISOString().slice(0, 10);
    try {
      const d = await getJson<ApodResponse>(
        `https://api.nasa.gov/planetary/apod?api_key=${encodeURIComponent(apiKey)}&thumbs=true&date=${day}`
      );
      const imageUrl = d.media_type === 'image' ? d.url : d.thumbnail_url;
      if (!imageUrl) throw new Error('APOD entry has no image');
      // Since early Nov 2026 the API sometimes returns a placeholder (NASA logo, title
      // "NASA Science") for every date. Treat that as unavailable rather than showing it.
      if (/nasa-logo/i.test(imageUrl) || d.title.trim() === 'NASA Science') {
        throw new Error('APOD returned placeholder data');
      }
      return {
        date: d.date,
        title: d.title,
        imageUrl,
        pageUrl: `https://apod.nasa.gov/apod/ap${d.date.slice(2).replace(/-/g, '')}.html`,
        mediaType: d.media_type,
        copyright: d.copyright?.trim() || null,
      };
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError instanceof Error ? lastError : new Error('APOD unavailable');
}
