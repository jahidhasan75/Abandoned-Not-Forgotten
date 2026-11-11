/**
 * Picking quiz rounds. Pure functions (the random source is passed in) so they can be tested.
 *
 * Rule: a round has 5 questions, and none of them may have been asked in the previous 5 rounds.
 * With 50 questions that blocks at most 25, so there are always at least 25 to choose from.
 */
export const ROUND_SIZE = 5;
export const BLOCKED_ROUNDS = 5;

export type Rng = () => number;

/** Fisher–Yates shuffle into a new array. */
export const shuffle = <T>(items: readonly T[], rng: Rng): T[] => {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * Picks the next round. `history` holds earlier rounds, oldest first; only the last
 * BLOCKED_ROUNDS of them are excluded. Questions about different machines are preferred, so a
 * round mixes topics instead of asking about one rover five times.
 */
export const pickRound = <Q extends { id: string; ref: string }>(
  bank: readonly Q[],
  history: readonly (readonly string[])[],
  rng: Rng,
  size = ROUND_SIZE,
  blocked = BLOCKED_ROUNDS,
): Q[] => {
  const recent = new Set(history.slice(-blocked).flat());
  let pool = bank.filter((q) => !recent.has(q.id));
  // Only possible with a bank smaller than size × (blocked + 1); fall back to the whole bank.
  if (pool.length < size) pool = bank.slice();

  const shuffled = shuffle(pool, rng);
  const picked: Q[] = [];
  const refs = new Set<string>();
  for (const q of shuffled) {
    if (picked.length === size) break;
    if (!refs.has(q.ref)) {
      picked.push(q);
      refs.add(q.ref);
    }
  }
  for (const q of shuffled) {
    if (picked.length === size) break;
    if (!picked.includes(q)) picked.push(q);
  }
  return picked;
};

/** Adds a round to the history and keeps only what the rule needs. */
export const remember = (
  history: readonly (readonly string[])[],
  round: readonly string[],
  keep = BLOCKED_ROUNDS,
): string[][] => [...history.map((r) => [...r]), [...round]].slice(-keep);
