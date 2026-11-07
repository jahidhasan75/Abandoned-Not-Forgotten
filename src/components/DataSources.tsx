import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { MISSIONS_DATA } from '../data/missionsData';
import pdsCatalog from '../data/pdsCatalog.json';
import { useI18n } from '../i18n/I18nProvider';
import { spaceAudio } from '../utils/audio';

type SourceStatus = 'USED' | 'PLANNED' | 'RETIRED';

interface DataSource {
  name: string;
  provider: string;
  url: string;
  usedFor: string;
  detail: string;
  status: SourceStatus;
  /** Non-NASA partner agencies or third parties that produced or co-produced the data. */
  partners?: string[];
}

const count = (fn: (m: (typeof MISSIONS_DATA)[number]) => boolean) => MISSIONS_DATA.filter(fn).length;

const SOURCES: DataSource[] = [
  {
    name: 'Moon Trek: LRO LROC WAC Global Mosaic',
    provider: 'NASA Solar System Treks (WMTS, no authentication)',
    url: 'https://trek.nasa.gov/moon/',
    usedFor: 'Moon 3D globe and lunar map basemap',
    detail: 'Tile layer LRO_WAC_Mosaic_Global_303ppd_v02, zoom 3 (128 tiles) stitched into a 4096 × 2048 equirectangular texture by scripts/build-textures.py.',
    status: 'USED',
    partners: ['Arizona State University (LROC Science Operations Center)'],
  },
  {
    name: 'Mars Trek: Viking MDIM 2.1 Colour Mosaic',
    provider: 'NASA Solar System Treks (WMTS, no authentication)',
    url: 'https://trek.nasa.gov/mars/',
    usedFor: 'Mars 3D globe and Martian map basemap',
    detail: 'Tile layer Mars_Viking_MDIM21_ClrMosaic_global_232m, zoom 3, stitched the same way.',
    status: 'USED',
    partners: ['USGS Astrogeology Science Center (MDIM 2.1 mosaic)'],
  },
  {
    name: 'Blue Marble Next Generation',
    provider: 'NASA GIBS (Global Imagery Browse Services)',
    url: 'https://nasa-gibs.github.io/gibs-api-docs/',
    usedFor: 'Earth 3D globe (the starting point of every journey)',
    detail: 'EPSG:4326 WMTS layer BlueMarble_NextGeneration, 500m tile set, zoom 3.',
    status: 'USED',
  },
  {
    name: 'NSSDCA Master Catalog',
    provider: 'NASA Space Science Data Coordinated Archive',
    url: 'https://nssdc.gsfc.nasa.gov/nmc/',
    usedFor: 'Stable identifiers, landing dates, last contact, coordinates',
    detail: `${MISSIONS_DATA.length} catalogue entries cited (dataset_id "NSSDCA <id>" in objects.geojson). Landing coordinates for Apollo 11, 12, 15, Pathfinder, Spirit and Viking 1 are taken from these pages.`,
    status: 'USED',
  },
  {
    name: 'PDS Search API',
    provider: 'NASA Planetary Data System',
    url: 'https://pds.nasa.gov/api/search/1/',
    usedFor: 'Mission and spacecraft context identifiers (LIDs)',
    detail: `${count((m) => Boolean(m.pdsLid))} of ${MISSIONS_DATA.length} objects carry a PDS context LID (Surveyor 3 and Mars Polar Lander have none in PDS).`,
    status: 'USED',
  },
  {
    name: 'NTRS: NASA Technical Reports Server',
    provider: 'NASA STI Program',
    url: 'https://ntrs.nasa.gov/',
    usedFor: 'Mission reports behind the dates and the science each object enabled',
    detail: `${new Set(MISSIONS_DATA.map((m) => m.ntrs.id)).size} reports linked, including the Apollo 11, 12 and 15 mission reports and the Mars Polar Lander loss report.`,
    status: 'USED',
  },
  {
    name: 'NASA Image and Video Library',
    provider: 'images.nasa.gov (public domain)',
    url: 'https://images.nasa.gov/',
    usedFor: 'The final photograph of every object',
    detail: `${MISSIONS_DATA.length} photos downloaded once, credited, and served locally as WebP so the demo works offline.`,
    status: 'USED',
  },
  {
    name: 'JPL Horizons',
    provider: 'NASA/JPL Solar System Dynamics',
    url: 'https://ssd.jpl.nasa.gov/horizons/',
    usedFor: 'Live Earth–Moon and Earth–Mars distance and radio travel time',
    detail: 'Geocentric range (QUANTITIES=20) fetched in the browser; light-time is computed by tested functions in src/lib/compute.ts. Offline copy in src/data/fixtures/live.json.',
    status: 'USED',
  },
  {
    name: 'Mars raw-image feeds (Curiosity, Perseverance)',
    provider: 'mars.nasa.gov, NASA/JPL-Caltech',
    url: 'https://mars.nasa.gov/mars2020/multimedia/raw-images/',
    usedFor: "Today's sol and newest raw image from the rovers that are still working",
    detail: 'Replaces the retired api.nasa.gov Mars Rover Photos API. Cached in the browser for an hour, with an offline copy of the latest image.',
    status: 'USED',
    partners: ['CNES (French space agency) and LANL: ChemCam / SuperCam instruments', 'Malin Space Science Systems (MSSS): rover cameras'],
  },
  {
    name: 'api.nasa.gov: APOD',
    provider: 'NASA Open APIs',
    url: 'https://api.nasa.gov/',
    usedFor: 'Astronomy Picture of the Day in the live band',
    detail: 'Wired in and validated. On 7 Nov 2026 the API returned a placeholder (NASA logo, "NASA Science") for every date, so the tile stays hidden until real data returns.',
    status: 'PLANNED',
  },
  {
    name: 'api.nasa.gov: Mars Rover Photos',
    provider: 'NASA Open APIs',
    url: 'https://api.nasa.gov/',
    usedFor: 'Rover imagery',
    detail: 'Returned HTTP 404 when tested on 6 Nov 2026. Replaced by the mars.nasa.gov raw-image feeds above.',
    status: 'RETIRED',
  },
];

const bnNum = (x: number) => x.toLocaleString('bn-BD');

/** Bangla for what each source is used for (names, providers and layer ids stay as they are). */
const SOURCES_BN: Record<string, { usedFor: string; detail: string }> = {
  'Moon Trek: LRO LROC WAC Global Mosaic': {
    usedFor: 'চাঁদের ৩ডি গ্লোব আর চাঁদের মানচিত্রের ভিত্তি',
    detail: 'টাইল লেয়ার LRO_WAC_Mosaic_Global_303ppd_v02, জুম ৩ (১২৮টি টাইল), scripts/build-textures.py দিয়ে জোড়া দিয়ে ৪০৯৬ × ২০৪৮ মাপের একটি সমআয়তাকার টেক্সচার বানানো হয়েছে।',
  },
  'Mars Trek: Viking MDIM 2.1 Colour Mosaic': {
    usedFor: 'মঙ্গলের ৩ডি গ্লোব আর মঙ্গলের মানচিত্রের ভিত্তি',
    detail: 'টাইল লেয়ার Mars_Viking_MDIM21_ClrMosaic_global_232m, জুম ৩, একইভাবে জোড়া দেওয়া।',
  },
  'Blue Marble Next Generation': {
    usedFor: 'পৃথিবীর ৩ডি গ্লোব (প্রতিটি যাত্রার শুরু)',
    detail: 'EPSG:4326 WMTS লেয়ার BlueMarble_NextGeneration, ৫০০ মিটারের টাইল সেট, জুম ৩।',
  },
  'NSSDCA Master Catalog': {
    usedFor: 'স্থায়ী শনাক্তকারী, অবতরণের তারিখ, শেষ যোগাযোগ, স্থানাঙ্ক',
    detail: `${bnNum(MISSIONS_DATA.length)}টি ক্যাটালগ এন্ট্রি উদ্ধৃত (objects.geojson-এ dataset_id "NSSDCA <id>")। অ্যাপোলো ১১, ১২, ১৫, পাথফাইন্ডার, স্পিরিট আর ভাইকিং ১-এর অবতরণ স্থানাঙ্ক এই পাতাগুলো থেকে নেওয়া।`,
  },
  'PDS Search API': {
    usedFor: 'মিশন ও মহাকাশযানের কনটেক্সট শনাক্তকারী (LID)',
    detail: `${bnNum(MISSIONS_DATA.length)}টি বস্তুর মধ্যে ${bnNum(count((m) => Boolean(m.pdsLid)))}টির PDS কনটেক্সট LID আছে (সার্ভেয়ার ৩ আর মার্স পোলার ল্যান্ডারের PDS-এ নেই)।`,
  },
  'NTRS: NASA Technical Reports Server': {
    usedFor: 'তারিখ আর প্রতিটি বস্তুর বিজ্ঞানের পেছনের মিশন রিপোর্ট',
    detail: `${bnNum(new Set(MISSIONS_DATA.map((m) => m.ntrs.id)).size)}টি রিপোর্টের লিংক, এর মধ্যে অ্যাপোলো ১১, ১২ ও ১৫-এর মিশন রিপোর্ট আর মার্স পোলার ল্যান্ডার হারানোর রিপোর্ট।`,
  },
  'NASA Image and Video Library': {
    usedFor: 'প্রতিটি বস্তুর ছবি',
    detail: `${bnNum(MISSIONS_DATA.length)}টি ছবি একবার ডাউনলোড করে, কৃতিত্বসহ, WebP হিসেবে সাইটেই রাখা, যাতে ডেমো অফলাইনেও চলে।`,
  },
  'JPL Horizons': {
    usedFor: 'পৃথিবী–চাঁদ আর পৃথিবী–মঙ্গলের লাইভ দূরত্ব ও রেডিও সংকেতের সময়',
    detail: 'ভূকেন্দ্রিক দূরত্ব (QUANTITIES=20) ব্রাউজারেই আনা হয়; আলোর সময় হিসাব করে src/lib/compute.ts-এর পরীক্ষিত ফাংশন। অফলাইন কপি src/data/fixtures/live.json-এ।',
  },
  'Mars raw-image feeds (Curiosity, Perseverance)': {
    usedFor: 'এখনো কাজ করা রোভারগুলোর আজকের সল আর সর্বশেষ কাঁচা ছবি',
    detail: 'বাতিল হয়ে যাওয়া api.nasa.gov Mars Rover Photos API-এর বদলে। ব্রাউজারে এক ঘণ্টা সংরক্ষিত থাকে, সর্বশেষ ছবির একটি অফলাইন কপিসহ।',
  },
  'api.nasa.gov: APOD': {
    usedFor: 'লাইভ অংশে আজকের জ্যোতির্বিজ্ঞান ছবি',
    detail: 'যুক্ত ও যাচাই করা হয়েছে। ৭ নভেম্বর ২০২৬ তারিখে API প্রতিটি তারিখের জন্য একটি প্লেসহোল্ডার (নাসার লোগো, "NASA Science") দিচ্ছিল, তাই আসল ছবি না আসা পর্যন্ত টাইলটি লুকানো থাকে।',
  },
  'api.nasa.gov: Mars Rover Photos': {
    usedFor: 'রোভারের ছবি',
    detail: '৬ নভেম্বর ২০২৬ তারিখের পরীক্ষায় HTTP 404 দিয়েছে। এর বদলে ওপরের mars.nasa.gov কাঁচা ছবির ফিড ব্যবহার হয়।',
  },
};

// Dot colour per source state; the word is always shown next to it
const STATUS_DOT: Record<SourceStatus, string> = {
  USED: '#a3a9b8',
  PLANNED: '#7a8296',
  RETIRED: '#FF6B6B',
};

/** Rows shown before "Show all": the sources in use come first in SOURCES. */
const PREVIEW = 5;

export const DataSources: React.FC = () => {
  const { t, lang } = useI18n();
  const ds = pdsCatalog.dataset;
  const textOf = (src: DataSource) => (lang === 'bn' && SOURCES_BN[src.name]) || src;
  const [expanded, setExpanded] = useState(false);
  const rows = expanded ? SOURCES : SOURCES.slice(0, PREVIEW);
  return (
    <section id="data-sources" className="relative py-12 sm:py-20 lg:py-24 bg-page border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="section-label">{t('sources.kicker')}</p>
            <h2 className="mt-2 text-2xl sm:text-3xl text-fg">{t('sources.title')}</h2>
            <p className="mt-3 text-base text-fg-2 max-w-2xl">
              {t('sources.intro')}
            </p>
            <p className="mt-3 text-sm text-fg-2 max-w-2xl">
              <span className="text-fg">{t('sources.partnerTag')}: </span>
              {t('sources.partnerSummary')}
            </p>
          </div>
          <a
            href="data/objects.geojson"
            download
            className="btn-secondary self-start md:self-auto font-mono-data text-sm"
          >
            {t('sources.download')}
          </a>
        </div>

        {/* Featured: the LROC dataset described by the local PDS catalog files */}
        <div className="mb-12 rounded-2xl border border-line bg-card p-6 sm:p-8">
          <p className="text-sm text-fg-2">{t('sources.featured')}</p>
          <h3 className="mt-2 font-serif text-2xl text-fg">{ds.name}</h3>
          <p className="mt-1 catalogue-tag">{ds.id}</p>
          <p className="mt-4 text-base text-fg-2 max-w-3xl">
            {ds.abstract} {t('sources.featuredBody', { date: pdsCatalog.mission.startDate })}
          </p>
          <dl className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
            <div>
              <dt className="text-xs text-fg-2">{t('sources.mission')}</dt>
              <dd className="mt-1 text-fg">{pdsCatalog.mission.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-fg-2">{t('sources.instrument')}</dt>
              <dd className="mt-1 text-fg">{ds.instrumentHost} / {ds.instrument}</dd>
            </div>
            <div>
              <dt className="text-xs text-fg-2">{t('sources.since')}</dt>
              <dd className="mt-1 font-mono-data text-fg">{ds.startTime.slice(0, 10)}</dd>
            </div>
            <div>
              <dt className="text-xs text-fg-2">{t('sources.archiveStatus')}</dt>
              <dd className="mt-1 text-fg">{ds.archiveStatus}</dd>
            </div>
          </dl>
          <p className="mt-6 pt-4 border-t border-line text-xs text-fg-2">
            <span className="text-fg">{t('sources.citeAs')}: </span>
            {ds.citation}
          </p>
        </div>

        {/* A references list: one dataset per row, like a bibliography */}
        <ol className="border-t border-line divide-y divide-line">
          {rows.map((src, i) => (
            <li key={src.name} className="py-5 grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-2">
              <span className="md:col-span-1 font-mono-data text-xs text-fg-3 pt-1">
                {(i + 1).toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US').padStart(2, lang === 'bn' ? '০' : '0')}
              </span>
              <div className="md:col-span-4">
                <h3 className="text-base text-fg">{src.name}</h3>
                <p className="text-sm text-fg-2 mt-1">{src.provider}</p>
                {src.partners && (
                  <p className="text-xs text-fg-2 mt-2">
                    <span className="text-fg">{t('sources.partnerTag')}: </span>
                    {src.partners.join(' · ')}
                  </p>
                )}
                <p className="mt-2 flex items-center gap-2 text-xs text-fg-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_DOT[src.status] }} aria-hidden="true" />
                  {t(`sources.status.${src.status}`)}
                </p>
              </div>
              <div className="md:col-span-7 text-sm">
                <p className="text-fg">
                  <span className="text-fg-2">{t('sources.usedFor')}: </span>
                  {textOf(src).usedFor}
                </p>
                <p className="mt-1 text-fg-2">{textOf(src).detail}</p>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-2 font-mono-data text-xs text-fg-2 hover:text-fg underline decoration-line-strong underline-offset-4 transition-colors"
                >
                  {src.url.replace(/^https:\/\//, '')}
                  <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                  <span className="sr-only">{t('modal.newTab')}</span>
                </a>
              </div>
            </li>
          ))}
        </ol>
        {SOURCES.length > PREVIEW && (
          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                spaceAudio.playTelemetryPing(900, 0.05);
                setExpanded((v) => !v);
              }}
              aria-expanded={expanded}
              className="btn-secondary"
            >
              {expanded ? t('sources.showFewer') : t('sources.showAll', { n: SOURCES.length })}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
