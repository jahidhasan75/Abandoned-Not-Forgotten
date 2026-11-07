import React from 'react';
import { MissionArtifact } from '../types/mission';

/**
 * The archive's signature: a museum-style catalogue tag, in mono, the same everywhere.
 *   ARCH/MOON/001 · 0.67° N 23.47° E · 1969 → 1969
 * Coordinates are the catalogued strings from missionsData.ts (no extra precision is invented).
 * A machine still working, or one whose last contact is not a year, gets an open range ("2012 →");
 * a machine that never transmitted after arrival gets "→ —".
 */
export function catalogueTag(a: MissionArtifact): string {
  const end =
    typeof a.lastContactYear === 'number'
      ? String(a.lastContactYear)
      : a.status === 'LOST'
        ? '—'
        : '';
  const range = end ? `${a.landingYear} → ${end}` : `${a.landingYear} →`;
  return `${a.artifactId} · ${a.coordinates.lat} ${a.coordinates.lng} · ${range}`;
}

export const CatalogueTag: React.FC<{ artifact: MissionArtifact; className?: string }> = ({
  artifact,
  className = '',
}) => (
  <p className={`catalogue-tag ${className}`} translate="no">
    {catalogueTag(artifact)}
  </p>
);
