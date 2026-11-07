import { describe, expect, test } from 'bun:test';
import {
  AU_KM,
  auToKm,
  daysSince,
  lightTimeSeconds,
  parseHorizonsRange,
  splitLightTime,
  yearsSince,
} from './compute';

describe('distance and light-time', () => {
  test('1 AU in km', () => {
    expect(auToKm(1)).toBe(AU_KM);
  });

  test('light takes about 499 s to cross 1 AU', () => {
    expect(lightTimeSeconds(AU_KM)).toBeCloseTo(499.004784, 5);
  });

  test('Moon at ~384,400 km is ~1.28 light-seconds', () => {
    expect(lightTimeSeconds(384_400)).toBeCloseTo(1.2822, 3);
  });

  test('splitLightTime keeps sub-minute values in seconds', () => {
    expect(splitLightTime(1.28224)).toEqual({ minutes: 0, seconds: 1.28 });
  });

  test('splitLightTime splits minutes and seconds', () => {
    expect(splitLightTime(754.4)).toEqual({ minutes: 12, seconds: 34 });
  });
});

describe('elapsed time', () => {
  const now = new Date('2026-11-07T12:00:00Z');

  test('Apollo 11 liftoff was 20,928 days before 7 Nov 2026', () => {
    expect(daysSince('1969-07-21', now)).toBe(20928);
  });

  test('Opportunity last contact (2018-06-10) was 3,072 days before 7 Nov 2026', () => {
    expect(daysSince('2018-06-10', now)).toBe(3072);
  });

  test('a future date never gives negative days', () => {
    expect(daysSince('2030-01-01', now)).toBe(0);
  });

  test('full timestamps are accepted', () => {
    expect(daysSince('2026-11-06T08:38:08.000Z', now)).toBe(1);
  });

  test('yearsSince', () => {
    expect(yearsSince('1969-07-21', now)).toBe(57);
  });

  test('invalid dates throw', () => {
    expect(() => daysSince('not-a-date', now)).toThrow();
  });
});

describe('JPL Horizons parsing', () => {
  const sample = `header text
 Date__(UT)__HR:MN, , ,            delta,     deldot,
*****************************************************
$$SOE
 2026-Nov-07 00:00, , , 0.00260997630601,  0.0389583,
 2026-Nov-07 00:01, , , 0.00260999193034,  0.0389575,
$$EOE
footer`;

  test('reads the first row', () => {
    const r = parseHorizonsRange(sample);
    expect(r.time).toBe('2026-Nov-07 00:00');
    expect(r.deltaAu).toBeCloseTo(0.00260997630601, 12);
    expect(r.deldotKmS).toBeCloseTo(0.0389583, 7);
    expect(auToKm(r.deltaAu)).toBeCloseTo(390_447, -1);
  });

  test('throws without an ephemeris block', () => {
    expect(() => parseHorizonsRange('no data')).toThrow();
  });
});
