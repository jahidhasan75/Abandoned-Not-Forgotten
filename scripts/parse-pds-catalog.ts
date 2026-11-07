/**
 * Reads the local PDS3 catalog files in data/pds/lroc/ (DATASET.CAT, MISSION.CAT) and writes
 * the fields the website shows to src/data/pdsCatalog.json.
 *
 * PDS3 labels are "KEYWORD = value" lines; values may be quoted and span several lines.
 * Run: bun run parse:pds
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'data', 'pds', 'lroc');

/** Parse PDS3 keyword = value pairs (first occurrence of each keyword wins). */
export function parsePds3(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    const [, key, rest] = m;
    let value = rest.trim();
    if (value.startsWith('"') && !(value.length > 1 && value.endsWith('"'))) {
      // multi-line quoted value: keep reading until the closing quote
      const parts = [value.slice(1)];
      while (++i < lines.length) {
        const line = lines[i];
        const end = line.indexOf('"');
        if (end >= 0) {
          parts.push(line.slice(0, end));
          break;
        }
        parts.push(line);
      }
      value = parts.join('\n');
    } else {
      value = value.replace(/^"|"$/g, '');
    }
    if (!(key in out)) out[key] = value.trim();
  }
  return out;
}

const tidy = (s = '') => s.replace(/\s+/g, ' ').trim();

const dataset = parsePds3(readFileSync(path.join(dir, 'DATASET.CAT'), 'utf8'));
const mission = parsePds3(readFileSync(path.join(dir, 'MISSION.CAT'), 'utf8'));

const catalog = {
  source: 'Local PDS3 catalog files: data/pds/lroc/DATASET.CAT, MISSION.CAT',
  dataset: {
    id: dataset.DATA_SET_ID,
    name: dataset.DATA_SET_NAME,
    terse: tidy(dataset.DATA_SET_TERSE_DESC),
    abstract: tidy(dataset.ABSTRACT_DESC),
    citation: tidy(dataset.CITATION_DESC),
    startTime: dataset.START_TIME,
    releaseDate: dataset.DATA_SET_RELEASE_DATE,
    producer: dataset.PRODUCER_FULL_NAME,
    archiveStatus: dataset.ARCHIVE_STATUS,
    target: dataset.TARGET_NAME,
    instrumentHost: dataset.INSTRUMENT_HOST_ID,
    instrument: dataset.INSTRUMENT_ID,
  },
  mission: {
    name: mission.MISSION_NAME,
    alias: mission.MISSION_ALIAS_NAME,
    startDate: mission.MISSION_START_DATE,
  },
};

const out = path.join(root, 'src', 'data', 'pdsCatalog.json');
writeFileSync(out, JSON.stringify(catalog, null, 2) + '\n');
console.log(`Wrote ${path.relative(root, out)}:`, catalog.dataset.id, '/', catalog.mission.name);
