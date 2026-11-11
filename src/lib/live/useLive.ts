import { useEffect, useState } from 'react';
import fixturesJson from '../../data/fixtures/live.json';
import { Fixture, LiveResult, liveFetch } from './live';
import { Apod, BodyRange, RoverLatest, loadApod, loadCuriosity, loadPerseverance, loadRange } from './nasa';

interface LiveTypes {
  curiosity: RoverLatest;
  perseverance: RoverLatest;
  moon: BodyRange;
  mars: BodyRange;
  apod: Apod;
}
export type LiveKey = keyof LiveTypes;

const fixtures = fixturesJson as unknown as { [K in LiveKey]: Fixture<LiveTypes[K] | null> };

const MIN = 60_000;
const apiKey = (import.meta.env?.VITE_NASA_API_KEY as string | undefined) || 'DEMO_KEY';

const LOADERS: { [K in LiveKey]: { load: () => Promise<LiveTypes[K]>; maxAgeMs: number } } = {
  curiosity: { load: loadCuriosity, maxAgeMs: 60 * MIN },
  perseverance: { load: loadPerseverance, maxAgeMs: 60 * MIN },
  moon: { load: () => loadRange('moon'), maxAgeMs: 10 * MIN },
  mars: { load: () => loadRange('mars'), maxAgeMs: 30 * MIN },
  apod: { load: () => loadApod(apiKey), maxAgeMs: 12 * 60 * MIN },
};

// One request per key per page load, shared by every component that asks for it.
const inflight = new Map<LiveKey, Promise<LiveResult<unknown | null>>>();

function request<K extends LiveKey>(key: K): Promise<LiveResult<LiveTypes[K] | null>> {
  if (!inflight.has(key)) {
    const cfg = LOADERS[key];
    inflight.set(key, liveFetch<LiveTypes[K] | null>(key, cfg.load, fixtures[key], cfg.maxAgeMs));
  }
  return inflight.get(key) as Promise<LiveResult<LiveTypes[K] | null>>;
}

/**
 * Live NASA value with provenance.
 * undefined = still loading; null = unavailable (no live data, cache or fixture).
 */
export function useLive<K extends LiveKey>(key: K, enabled = true): LiveResult<LiveTypes[K]> | null | undefined {
  const [state, setState] = useState<LiveResult<LiveTypes[K]> | null | undefined>(undefined);
  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    request(key).then((res) => {
      if (!alive) return;
      setState(res.data ? (res as LiveResult<LiveTypes[K]>) : null);
    });
    return () => {
      alive = false;
    };
  }, [key, enabled]);
  return state;
}
