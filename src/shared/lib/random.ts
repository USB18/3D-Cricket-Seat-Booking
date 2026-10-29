/**
 * Tiny seeded random number generator (Lehmer / MINSTD).
 * The same seed always produces the same sequence, so procedurally generated
 * scenery (the city skyline) looks identical on every load.
 */
export function createRandom(seed: number): () => number {
  let state = seed
  return () => {
    state = (state * 16807) % 2147483647
    return (state - 1) / 2147483646
  }
}
