// Generate a random seed when the module is loaded
// This ensures the same seed is used throughout a test run
const SEED = Math.floor(Math.random() * 1000000);

/**
 * Returns the seed value that was generated when the module was loaded.
 * This can be used in pseudorandom number generators or anywhere else
 * where deterministic randomness is needed.
 * 
 * @returns {number} The seed value
 */
export function getSeed(): number {
  return SEED;
}
