import { describe, expect, test } from 'bun:test';
import { pickRound, remember, shuffle, ROUND_SIZE, BLOCKED_ROUNDS } from './quizPick';
import { QUIZ_BANK } from '../data/quiz';

/** Small deterministic random source (mulberry32) so the tests repeat exactly. */
const seeded = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

describe('quiz bank', () => {
  test('has 50 questions with unique ids', () => {
    expect(QUIZ_BANK.length).toBe(50);
    expect(new Set(QUIZ_BANK.map((q) => q.id)).size).toBe(50);
  });

  test('every question has four distinct options in both languages', () => {
    for (const q of QUIZ_BANK) {
      for (const [, options] of [q.en, q.bn]) {
        expect(options.length).toBe(4);
        expect(new Set(options).size).toBe(4);
      }
    }
  });
});

describe('pickRound', () => {
  test('returns 5 different questions', () => {
    const round = pickRound(QUIZ_BANK, [], seeded(1));
    expect(round.length).toBe(ROUND_SIZE);
    expect(new Set(round.map((q) => q.id)).size).toBe(ROUND_SIZE);
  });

  test('a question never comes back within the next 5 rounds', () => {
    const rng = seeded(42);
    let history: string[][] = [];
    const all: string[][] = [];
    for (let i = 0; i < 200; i++) {
      const ids = pickRound(QUIZ_BANK, history, rng).map((q) => q.id);
      all.push(ids);
      history = remember(history, ids);
    }
    for (let i = 0; i < all.length; i++) {
      const later = all.slice(i + 1, i + 1 + BLOCKED_ROUNDS).flat();
      for (const id of all[i]) expect(later).not.toContain(id);
    }
  });

  test('history keeps only the last 5 rounds', () => {
    let h: string[][] = [];
    for (let i = 0; i < 8; i++) h = remember(h, [`r${i}`]);
    expect(h).toEqual([['r3'], ['r4'], ['r5'], ['r6'], ['r7']]);
  });

  test('prefers questions about different machines', () => {
    const round = pickRound(QUIZ_BANK, [], seeded(7));
    expect(new Set(round.map((q) => q.ref)).size).toBe(ROUND_SIZE);
  });
});

describe('shuffle', () => {
  test('keeps every item', () => {
    expect(shuffle([0, 1, 2, 3], seeded(3)).sort()).toEqual([0, 1, 2, 3]);
  });
});
