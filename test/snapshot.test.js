import fs from 'fs';

// This test demonstrates the new features added to node-test-jest-compat:
// 1. Snapshot Testing
// 2. Module Mocking
// 3. Test Filtering (test.only, describe.only)
// 4. Test Retries

// Example object for snapshot testing
const exampleObject = {
  name: 'Example Object',
  properties: {
    a: 1,
    b: 'string',
    c: true
  },
  methods: ['method1', 'method2', 'method3'],
  nested: {
    value: 42,
    array: [1, 2, 3]
  }
};

// Demonstrate snapshot testing
describe('Snapshot Testing', () => {
  test('should match snapshot of an object', () => {
    expect(exampleObject).toMatchSnapshot();
  });

  test('should match snapshot of a primitive', () => {
    expect(42).toMatchSnapshot();
  });

  test('should match snapshot of an array', () => {
    expect([1, 2, 3]).toMatchSnapshot();
  });
});

// Demonstrate module mocking
describe.skip('Module Mocking', () => {
  beforeEach(() => {
    // Mock the fs module
    jest.mock('fs', () => ({
      readFileSync: jest.fn(() => 'mocked file content'),
      existsSync: jest.fn(() => true)
    }));
  });

  afterEach(() => {
    // Unmock the fs module
    jest.unmock('fs');
  });

  test('should mock fs.readFileSync', () => {
    const content = fs.readFileSync('some-file.txt');
    expect(content).toBe('mocked file content');
    expect(fs.readFileSync).toHaveBeenCalledWith('some-file.txt');
  });

  test('should mock fs.existsSync', () => {
    const exists = fs.existsSync('some-file.txt');
    expect(exists).toBe(true);
    expect(fs.existsSync).toHaveBeenCalledWith('some-file.txt');
  });
});

// Demonstrate test filtering with .only
// Note: This test will only run when the test runner is started with --test-only
describe('Test Filtering', () => {
  test('this test will run normally', () => {
    expect(true).toBe(true);
  });

  test.only('this test will run with .only', () => {
    expect(true).toBe(true);
  });

  describe.only('this describe block will run with .only', () => {
    test('this test will run because its parent has .only', () => {
      expect(true).toBe(true);
    });
  });
});

// Demonstrate test retries
describe('Test Retries', () => {
  // This variable will be incremented on each test run
  let counter = 0;

  // This test will fail on the first attempt but pass on the second
  jest.retryTimes(2, { logErrorsBeforeRetry: true });
  test('this test will be retried until it passes', () => {
    counter++;
    console.log(`Test attempt #${counter}`);
    
    // The test will fail on the first attempt but pass on the second
    expect(counter).toBeGreaterThan(1);
  });
});
