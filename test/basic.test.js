// This test uses Jest-style syntax but runs with Node.js test runner
// The adapter is imported via the --import flag in the test command
describe('Basic test suite', () => {
  let mockFn;
  
  beforeEach(() => {
    mockFn = vi.fn();
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  test('should work with test function', () => {
    // Test passes if it runs without error
    expect(true).toBeTruthy();
  });
  
  it('should work with it function', () => {
    // Test passes if it runs without error
    expect(true).toBeTruthy();
  });
  
  test('mock functions should work', () => {
    mockFn('test');
    expect(mockFn).toHaveBeenCalledWith('test');
    expect(mockFn.mock.calls.length).toBe(1);
  });

  test('test with timeout supporetd', async () => {
    const result = await new Promise((resolve) => {
      setTimeout(() => {
        resolve('done');
      }, 200);
    });
    expect(result).toBe('done');
  }, 2000);
});
