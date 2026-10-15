// Deterministic pseudo-random numbers from a string seed — stable across
// reloads and HMR, so a page on the table always lies at the same angle.

function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** A stable number in [min, max] derived from `seed`. */
export function seededRange(seed: string, min: number, max: number): number {
  const norm = (hash(seed) % 10000) / 10000;
  return Math.round((min + norm * (max - min)) * 100) / 100;
}

/** A stable whole number in [0, count). */
export function seededPick(seed: string, count: number): number {
  return hash(seed) % count;
}
