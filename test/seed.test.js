describe('jest.getSeed()', () => {
  test('returns a number', () => {
    const seed = jest.getSeed();
    expect(typeof seed).toBe('number');
  });

  test('returns the same value when called multiple times', () => {
    const seed1 = jest.getSeed();
    const seed2 = jest.getSeed();
    expect(seed1).toBe(seed2);
  });

  test('can be used for deterministic randomness', () => {
    // Create a simple pseudo-random number generator using the seed
    const seed = jest.getSeed();
    
    // Simple PRNG function that uses the seed
    const generateRandomNumber = (seed) => {
      // Simple algorithm to generate a "random" number from the seed
      return (seed * 9301 + 49297) % 233280;
    };

    // Generate two sequences of "random" numbers using the same seed
    const sequence1 = [
      generateRandomNumber(seed),
      generateRandomNumber(generateRandomNumber(seed)),
      generateRandomNumber(generateRandomNumber(generateRandomNumber(seed)))
    ];

    const sequence2 = [
      generateRandomNumber(seed),
      generateRandomNumber(generateRandomNumber(seed)),
      generateRandomNumber(generateRandomNumber(generateRandomNumber(seed)))
    ];

    // The sequences should be identical since they use the same seed
    expect(sequence1).toEqual(sequence2);
  });
});
