/**
 * Match the machine: 15 pairs, each a machine in the archive and one fact from its own dossier
 * (src/data/missionsData.ts). A round shows 4 of them; see MATCH_ROUND_SIZE in YoungExplorers.
 * `id` is the artifact id, so a matched pair can open its dossier.
 */
export interface MatchPair {
  id: string;
  /** Machine name as shown on the left (names stay the same in both languages). */
  machine: string;
  en: string;
  bn: string;
}

export const MATCH_PAIRS: MatchPair[] = [
  { id: 'sojourner', machine: 'Sojourner', en: 'First wheeled rover to drive on Mars (1997)', bn: 'মঙ্গলে চলা প্রথম চাকাওয়ালা রোভার (১৯৯৭)' },
  { id: 'spirit', machine: 'Spirit', en: 'Found ancient hot-spring silica by dragging a broken wheel', bn: 'অচল চাকা টেনে প্রাচীন উষ্ণ প্রস্রবণের সিলিকা খুঁজে পেয়েছিল' },
  { id: 'opportunity', machine: 'Opportunity', en: 'Built for 90 Martian days, it kept driving for more than 14 years', bn: 'মঙ্গলের ৯০ দিনের জন্য বানানো, অথচ ১৪ বছরেরও বেশি চলেছে' },
  { id: 'insight', machine: 'InSight', en: 'Heard more than 1,300 marsquakes and helped map the core', bn: '১,৩০০-র বেশি মঙ্গলকম্প শুনে কেন্দ্রের মানচিত্র তৈরিতে সাহায্য করেছে' },
  { id: 'phoenix', machine: 'Phoenix', en: 'Dug up water ice in the Martian arctic', bn: 'মঙ্গলের মেরু অঞ্চলে মাটি খুঁড়ে পানির বরফ পেয়েছে' },
  { id: 'viking1', machine: 'Viking 1', en: 'Sent the first clear photograph from the surface of Mars', bn: 'মঙ্গলের মাটি থেকে প্রথম স্পষ্ট ছবি পাঠিয়েছে' },
  { id: 'viking2', machine: 'Viking 2', en: 'Photographed a thin layer of frost on the ground one winter', bn: 'এক শীতে মাটির ওপর পাতলা বরফের আস্তরণের ছবি তুলেছে' },
  { id: 'curiosity', machine: 'Curiosity', en: 'Lowered onto Mars by a rocket-powered sky crane', bn: 'রকেটচালিত স্কাই ক্রেন যাকে মঙ্গলে নামিয়ে দিয়েছিল' },
  { id: 'perseverance', machine: 'Perseverance', en: 'Seals rock samples in tubes for a possible trip back to Earth', bn: 'হয়তো পৃথিবীতে ফেরার জন্য পাথরের নমুনা টিউবে সিল করে রাখছে' },
  { id: 'ingenuity', machine: 'Ingenuity', en: 'Planned for 5 flights, it made 72', bn: 'পরিকল্পনা ছিল ৫টি উড্ডয়নের, উড়েছে ৭২ বার' },
  { id: 'mars-polar-lander', machine: 'Mars Polar Lander', en: 'Went quiet before landing near a Martian pole and was never heard from again', bn: 'মঙ্গলের মেরুর কাছে নামার আগে নীরব হয়ে যায়, আর কখনো সাড়া দেয়নি' },
  { id: 'apollo15-lrv', machine: 'Apollo 15 LRV', en: 'Carried two astronauts 27.8 km across the Moon', bn: 'দুই নভোচারীকে চাঁদে ২৭.৮ কিমি পথ ঘুরিয়েছে' },
  { id: 'apollo11-lrrr', machine: 'Apollo 11 LRRR', en: 'A mirror on the Moon that observatories still hit with lasers', bn: 'চাঁদের একটি আয়না, যেখানে মানমন্দিরগুলো আজও লেজার ছোড়ে' },
  { id: 'surveyor3', machine: 'Surveyor 3', en: 'Visited by Apollo 12 astronauts, who took parts of it home', bn: 'অ্যাপোলো ১২-এর নভোচারীরা গিয়ে এর কিছু অংশ পৃথিবীতে নিয়ে আসেন' },
  { id: 'apollo14-sivb', machine: 'Apollo 14 S-IVB', en: 'A rocket stage crashed on purpose so a seismometer could feel the Moon shake', bn: 'রকেটের একটি ধাপ, যাকে ইচ্ছা করে আছড়ে ফেলা হয় যাতে সিসমোমিটার চাঁদের কাঁপুনি টের পায়' },
];
