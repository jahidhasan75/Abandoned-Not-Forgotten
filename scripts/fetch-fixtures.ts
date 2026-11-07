/**
 * Builds the offline fixtures for the live-data panels (run with internet before the demo):
 *   - src/data/fixtures/live.json   latest values with their fetch time
 *   - public/data/fixtures/*.jpg    local copies of the rover and APOD images
 * The site falls back to these when NASA is unreachable or when ?offline=1 is set.
 *
 * Run: bun run fetch:fixtures      (optional: NASA_API_KEY in the environment for APOD)
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadApod, loadCuriosity, loadPerseverance, loadRange } from '../src/lib/live/nasa';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imgDir = path.join(root, 'public', 'data', 'fixtures');
const jsonDir = path.join(root, 'src', 'data', 'fixtures');
mkdirSync(imgDir, { recursive: true });
mkdirSync(jsonDir, { recursive: true });

async function saveImage(url: string, name: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} downloading ${url}`);
  const file = path.join(imgDir, name);
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  return `data/fixtures/${name}`; // relative to the site root (vite base './')
}

const stamp = () => new Date().toISOString();

const curiosity = await loadCuriosity();
curiosity.imageUrl = await saveImage(curiosity.imageUrl, 'curiosity-latest.jpg');
console.log(`Curiosity: sol ${curiosity.sol}, ${curiosity.instrument}`);

const perseverance = await loadPerseverance();
perseverance.imageUrl = await saveImage(perseverance.imageUrl, 'perseverance-latest.jpg');
console.log(`Perseverance: sol ${perseverance.sol}, ${perseverance.instrument}`);

const moon = await loadRange('moon');
const mars = await loadRange('mars');
console.log(`Moon ${Math.round(moon.distanceKm)} km, Mars ${Math.round(mars.distanceKm / 1e6)} million km`);

// APOD is optional: if the API is down (or returns placeholder data) the fixture is null and
// the site simply hides the APOD tile.
let apod: Awaited<ReturnType<typeof loadApod>> | null = null;
try {
  apod = await loadApod(process.env.NASA_API_KEY || 'DEMO_KEY');
  apod.imageUrl = await saveImage(apod.imageUrl, 'apod.jpg');
  console.log(`APOD ${apod.date}: ${apod.title}`);
} catch (err) {
  console.warn(`APOD unavailable, fixture left empty: ${(err as Error).message}`);
}

const fixtures = {
  curiosity: { data: curiosity, fetchedAt: stamp() },
  perseverance: { data: perseverance, fetchedAt: stamp() },
  moon: { data: moon, fetchedAt: stamp() },
  mars: { data: mars, fetchedAt: stamp() },
  apod: { data: apod, fetchedAt: stamp() },
};
writeFileSync(path.join(jsonDir, 'live.json'), JSON.stringify(fixtures, null, 2) + '\n');
console.log('Wrote src/data/fixtures/live.json');
