/**
 * NASA videos for objects in the archive, all from the NASA Image and Video Library
 * (images.nasa.gov, public domain). Each one was checked against its library description; objects
 * with no video clearly about them have none here, rather than a loosely related one.
 * The files stream from images-assets.nasa.gov when played (nothing downloads until then), so they
 * need an internet connection; the dossier says so when the page is offline.
 */
export interface NasaVideo {
  nasaId: string;
  /** NASA's own title (English), or a plain description when the library title is only a code. */
  title: string;
  date: string;
  center: string;
  /** Which rendition to stream: "small" is 640 × 360; "mobile" when that is the only light one. */
  file: 'small' | 'mobile';
  /** Poster frame published with the video. */
  poster: string;
  /** Optional note on how the video relates to this object. */
  note?: { en: string; bn: string };
}

export const VIDEOS: Record<string, NasaVideo> = {
  'apollo11-descent': {
    nasaId: 'KSC-19690716-MH-NAS01-0001-The_Flight_of_Apollo_11_The_Eagle_Has_Landed_HS_from_Film_JSC-DVC_1928',
    title: 'HQ-194, Eagle Has Landed: The Flight of Apollo 11 (1969 film)',
    date: '1969-07-16',
    center: 'KSC',
    file: 'small',
    poster: 'small_1',
  },
  surveyor3: {
    nasaId: 'NHQ_2019_1114_Apollo 12 - The Pinpoint Mission',
    title: 'Apollo 12 - The Pinpoint Mission',
    date: '2019-11-13',
    center: 'HQ',
    file: 'small',
    poster: 'small_1',
    note: { en: 'The Apollo 12 mission, which landed about 180 m from Surveyor 3.', bn: 'অ্যাপোলো ১২ মিশন, যা সার্ভেয়ার ৩ থেকে প্রায় ১৮০ মিটার দূরে নেমেছিল।' },
  },
  'apollo15-lrv': {
    nasaId: 'Apollo 15 Never Been on a Ride like this Before',
    title: 'Apollo 15: "Never Been on a Ride like this Before"',
    date: '2021-07-26',
    center: 'HQ',
    file: 'small',
    poster: 'medium_1',
  },
  'apollo17-challenger': {
    nasaId: 'GSFC_20190513_m4714_Lee_Lincoln_Scarp_Moon_Flyover',
    title: 'Lee Lincoln Scarp at the Apollo 17 Landing Site',
    date: '2019-05-13',
    center: 'GSFC',
    file: 'small',
    poster: 'thumb_1',
    note: { en: 'A flight over the Taurus-Littrow valley where Challenger landed.', bn: 'চ্যালেঞ্জার যেখানে নেমেছিল সেই টরাস-লিট্রো উপত্যকার ওপর দিয়ে উড়ে যাওয়া।' },
  },
  insight: {
    nasaId: 'JPL-20220919-INSIGHf-0001-InSight Captures Sound of a Meteoroid Striking Mars_1080',
    title: 'InSight Captures Sound of a Meteoroid Striking Mars',
    date: '2022-09-19',
    center: 'JPL',
    file: 'small',
    poster: 'small_1',
  },
  ingenuity: {
    nasaId: 'JPL-20210419-TECHf-0001-First Video of NASA’s Ingenuity Mars Helicopter in Flight',
    title: 'First Video of NASA’s Ingenuity Mars Helicopter in Flight, Including Takeoff and Landing',
    date: '2021-04-19',
    center: 'JPL',
    file: 'small',
    poster: 'medium_1',
  },
  perseverance: {
    nasaId: 'JPL-20210222-M2020f-0001-Perseverance Rover’s Descent and Touchdown on Mars',
    title: 'Perseverance Rover’s Descent and Touchdown on Mars: Onboard Camera Views',
    date: '2021-02-22',
    center: 'JPL',
    file: 'small',
    poster: 'small_1',
  },
  'perseverance-backshell': {
    nasaId: 'JPL-20210222-M2020f-0001-Perseverance Rover’s Descent and Touchdown on Mars',
    title: 'Perseverance Rover’s Descent and Touchdown on Mars: Onboard Camera Views',
    date: '2021-02-22',
    center: 'JPL',
    file: 'small',
    poster: 'small_1',
    note: {
      en: 'The parachute opening in this landing footage was filmed by cameras on the backshell.',
      bn: 'এই অবতরণের ভিডিওতে প্যারাস্যুট খোলার দৃশ্যটি ব্যাকশেলে বসানো ক্যামেরায় তোলা।',
    },
  },
  curiosity: {
    nasaId: 'JPL-20210816-MSLf-0001-2160',
    title: 'NASA’s Curiosity Mars Rover Finds A Changing Landscape',
    date: '2021-08-16',
    center: 'JPL',
    file: 'small',
    poster: 'medium_1',
  },
  phoenix: {
    nasaId: 'ksc_080407_phx_launch',
    title: 'Phoenix lifts off aboard a Delta II rocket (KSC-07-S-00067)',
    date: '2007-08-04',
    center: 'KSC',
    file: 'mobile',
    poster: 'small_1',
  },
};

const asset = (v: NasaVideo, suffix: string) =>
  encodeURI(`https://images-assets.nasa.gov/video/${v.nasaId}/${v.nasaId}~${suffix}`);

export const videoSrc = (v: NasaVideo) => asset(v, `${v.file}.mp4`);
export const videoPoster = (v: NasaVideo) => asset(v, `${v.poster}.jpg`);
export const videoPage = (v: NasaVideo) => `https://images.nasa.gov/details/${encodeURIComponent(v.nasaId)}`;
