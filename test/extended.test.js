// This test verifies the extended Jest API functionality
// The adapter is imported via the --import flag in the test command

describe('Extended Jest API', () => {
  let mockFn;
  let mockObj;
  
  beforeEach(() => {
    mockFn = jest.fn();
    mockObj = {
      method: () => 'original'
    };
  });
  
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });
  
  test('jest.isMockFunction should identify mock functions', () => {
    expect(jest.isMockFunction(mockFn)).toBe(true);
    expect(jest.isMockFunction(() => {})).toBe(false);
  });
  
  test('jest.resetAllMocks should reset all mocks', () => {
    mockFn.mockReturnValue('mocked');
    mockFn();
    expect(mockFn).toHaveBeenCalled();
    
    jest.resetAllMocks();
    expect(mockFn).not.toHaveBeenCalled();
  });
  
  test('jest.restoreAllMocks should restore spied functions', () => {
    const spy = jest.spyOn(mockObj, 'method').mockReturnValue('mocked');
    expect(mockObj.method()).toBe('mocked');
    
    jest.restoreAllMocks();
    expect(mockObj.method()).toBe('original');
  });
  
  test('jest.resetModules should exist and show a warning', () => {
    // Temporarily redirect console.warn
    const originalWarn = console.warn;
    const warnings = [];
    console.warn = (message) => {
      warnings.push(message);
    };
    
    jest.resetModules();
    
    // Restore console.warn
    console.warn = originalWarn;
    
    // Verify a warning was shown
    expect(warnings.length).toBeGreaterThan(0);
    expect(warnings[0]).toContain('resetModules');
  });
  
  test('jest.requireActual and jest.requireMock should be defined', () => {
    expect(typeof jest.requireActual).toBe('function');
    expect(typeof jest.requireMock).toBe('function');
  });
  
  test('jest.setTimeout should exist and show a warning', () => {
    // Temporarily redirect console.warn
    const originalWarn = console.warn;
    const warnings = [];
    console.warn = (message) => {
      warnings.push(message);
    };
    
    jest.setTimeout(5000);
    
    // Restore console.warn
    console.warn = originalWarn;
    
    // Verify a warning was shown
    expect(warnings.length).toBeGreaterThan(0);
    expect(warnings[0]).toContain('setTimeout');
  });
});
