/**
 * Offline-first fetching: live first, then the browser cache, then the committed fixture.
 * The returned `source` is always shown in the UI next to the value (LIVE / CACHED / OFFLINE).
 *
 * Offline demo mode (no network calls at all): add ?offline=1 to the URL, or build with
 * VITE_OFFLINE=1.
 */
export type DataSourceKind = 'live' | 'cache' | 'fixture';

export interface LiveResult<T> {
  data: T;
  source: DataSourceKind;
  /** When this value was fetched from NASA (ISO timestamp). */
  fetchedAt: string;
}

export interface Fixture<T> {
  data: T;
  fetchedAt: string;
}

const CACHE_PREFIX = 'anf-live:';

export const isOfflineMode = (): boolean => {
  if (import.meta.env?.VITE_OFFLINE === '1') return true;
  try {
    return new URLSearchParams(window.location.search).get('offline') === '1';
  } catch {
    return false;
  }
};

const readCache = <T>(key: string): Fixture<T> | null => {
  try {
    const raw = window.localStorage.getItem(CACHE_PREFIX + key);
    return raw ? (JSON.parse(raw) as Fixture<T>) : null;
  } catch {
    return null;
  }
};

const writeCache = <T>(key: string, value: Fixture<T>) => {
  try {
    window.localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage full or blocked: the value still shows, it just will not survive a reload */
  }
};

/**
 * @param maxAgeMs a cached value younger than this is used without calling NASA (saves requests);
 *                 older cache is only used if the live call fails.
 */
export async function liveFetch<T>(
  key: string,
  loader: () => Promise<T>,
  fixture: Fixture<T>,
  maxAgeMs: number
): Promise<LiveResult<T>> {
  if (isOfflineMode()) return { ...fixture, source: 'fixture' };

  const cached = readCache<T>(key);
  if (cached && Date.now() - Date.parse(cached.fetchedAt) < maxAgeMs) {
    return { ...cached, source: 'cache' };
  }

  try {
    const data = await loader();
    const fresh = { data, fetchedAt: new Date().toISOString() };
    writeCache(key, fresh);
    return { ...fresh, source: 'live' };
  } catch {
    if (cached) return { ...cached, source: 'cache' };
    return { ...fixture, source: 'fixture' };
  }
}
