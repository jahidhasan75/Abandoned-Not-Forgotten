/**
 * Deterministic science helpers. Every number the interface derives (distances, light-time,
 * elapsed days) comes from these small, tested functions, never from a model or from prose.
 * Tests: src/lib/compute.test.ts (run with `bun test`).
 */

/** IAU 2012 astronomical unit, in kilometres. */
export const AU_KM = 149_597_870.7;
/** Speed of light in vacuum, km/s (exact by definition). */
export const C_KM_S = 299_792.458;
const MS_PER_DAY = 86_400_000;

/** Convert astronomical units to kilometres. */
export const auToKm = (au: number): number => au * AU_KM;

/** One-way light (radio signal) travel time in seconds for a distance in km. */
export const lightTimeSeconds = (km: number): number => km / C_KM_S;

/** Split a duration in seconds into minutes and seconds (seconds rounded to 0.1 below 60 s). */
export const splitLightTime = (seconds: number): { minutes: number; seconds: number } => {
  if (seconds < 60) return { minutes: 0, seconds: Math.round(seconds * 100) / 100 };
  const minutes = Math.floor(seconds / 60);
  return { minutes, seconds: Math.round(seconds - minutes * 60) };
};

/** Parse an ISO date (YYYY-MM-DD or full timestamp) as a UTC instant. */
export const parseIsoUtc = (iso: string): number => {
  const ms = Date.parse(/^\d{4}-\d{2}-\d{2}$/.test(iso) ? `${iso}T00:00:00Z` : iso);
  if (Number.isNaN(ms)) throw new Error(`Invalid ISO date: ${iso}`);
  return ms;
};

/** Whole UTC days elapsed from an ISO date to `now` (never negative). */
export const daysSince = (iso: string, now: Date = new Date()): number => {
  const startDay = Math.floor(parseIsoUtc(iso) / MS_PER_DAY);
  const nowDay = Math.floor(now.getTime() / MS_PER_DAY);
  return Math.max(0, nowDay - startDay);
};

/** Whole years elapsed (365.25-day years), for headline copy. */
export const yearsSince = (iso: string, now: Date = new Date()): number =>
  Math.floor(daysSince(iso, now) / 365.25);

/**
 * Parse the first data row of a JPL Horizons OBSERVER ephemeris requested with
 * QUANTITIES='20' and CSV_FORMAT='YES'. Returns range (delta) in AU and range-rate in km/s.
 */
export const parseHorizonsRange = (result: string): { time: string; deltaAu: number; deldotKmS: number } => {
  const start = result.indexOf('$$SOE');
  const end = result.indexOf('$$EOE');
  if (start < 0 || end < 0) throw new Error('Horizons result has no ephemeris block');
  const row = result
    .slice(start + 5, end)
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l.length > 0);
  if (!row) throw new Error('Horizons ephemeris block is empty');
  const cols = row.split(',').map((c) => c.trim());
  const deltaAu = Number(cols[3]);
  const deldotKmS = Number(cols[4]);
  if (!Number.isFinite(deltaAu)) throw new Error(`Cannot read delta from row: ${row}`);
  return { time: cols[0], deltaAu, deldotKmS };
};
