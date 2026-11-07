/**
 * Exports the curated artifact list to public/data/objects.geojson, one Feature per object,
 * using the record format from the challenge brief:
 *   id, name, mission, body, lat, lon, left_behind, last_contact, why_left, science_enabled,
 *   image, image_credit, source_url, dataset_id
 * plus extra provenance fields (pds_lid, ntrs_id, ntrs_url, image_nasa_id, status, sources).
 *
 * Run: bun run export:data
 * Source of truth stays src/data/missionsData.ts; this file is generated, do not edit it by hand.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MISSIONS_DATA } from '../src/data/missionsData';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Bun resolves image imports to absolute file paths; store them relative to the repo.
const relImage = (p: string) => path.relative(root, p).split(path.sep).join('/');

const features = MISSIONS_DATA.map((m) => ({
  type: 'Feature' as const,
  geometry: {
    type: 'Point' as const,
    coordinates: [m.coordinates.lngNum, m.coordinates.latNum],
  },
  properties: {
    id: m.id,
    name: m.name,
    mission: m.mission,
    body: m.destination.toLowerCase(),
    lat: m.coordinates.latNum,
    lon: m.coordinates.lngNum,
    left_behind: m.leftBehind,
    last_contact: m.lastContact,
    status: m.status,
    why_left: m.whyLeftBehind,
    science_enabled: m.scienceContribution[0],
    image: relImage(m.image),
    image_credit: m.imageCredit,
    image_nasa_id: m.imageNasaId,
    source_url: `https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=${m.nssdcId}`,
    dataset_id: `NSSDCA ${m.nssdcId}`,
    pds_lid: m.pdsLid ?? null,
    ntrs_id: m.ntrs.id,
    ntrs_url: `https://ntrs.nasa.gov/citations/${m.ntrs.id}`,
    sources: m.sources,
  },
}));

const collection = {
  type: 'FeatureCollection',
  name: 'abandoned-not-forgotten-objects',
  generated: new Date().toISOString().slice(0, 10),
  note: 'Coordinates are planetocentric degrees on the body named in "body" (not Earth). Longitude is east-positive, -180..180.',
  features,
};

const outDir = path.join(root, 'public', 'data');
mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, 'objects.geojson');
writeFileSync(outFile, JSON.stringify(collection, null, 2) + '\n');
console.log(`Wrote ${features.length} objects to ${path.relative(root, outFile)}`);
