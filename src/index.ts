// This adapter provides compatibility between Jest/Vitest syntax and Node.js test runner
// @ts-nocheck - We're intentionally creating a compatibility layer
// NOTE: we need to use ".js" extension in imports for ESM compatibility
import { expect as expectLib } from 'expect';
import { fakeTimers } from './fakeTimers.js';
import { createMockFunctions } from './mockFunctions.js';
import { moduleMocking } from './moduleMocking.js';
import { mockRegistry, moduleRegistry } from './registry.js';
import { getSeed } from './seed.js';
import { snapshotTesting } from './snapshot.js';
import { createTestFunctions } from './testFunctions.js';

// Initialize snapshot functionality
snapshotTesting.initializeSnapshot();

// Create test functions using the implementation
const { 
  test, 
  it, 
  describe, 
  beforeEach, 
  afterEach, 
  beforeAll, 
  afterAll 
} = createTestFunctions();

// Create mock functions
const {
  fn,
  spyOn,
  clearAllMocks,
  resetAllMocks,
  restoreAllMocks,
  isMockFunction,
  requireActual,
  requireMock
} = createMockFunctions();

// Set timeout for tests (no-op implementation for compatibility)
const setTimeout = (timeout: number) => {
  console.warn('Warning: jest.setTimeout() is not supported in @simonegianni/node-test-jest-compat. Node.js test runner uses a different timeout mechanism.');
};

// Reset the module registry
const resetModules = () => {
  console.warn('Warning: jest.resetModules() is only partially supported in @simonegianni/node-test-jest-compat. Module cache clearing is limited.');
  moduleRegistry.resetAllModules();
};

// Use the actual Jest expect
const expect = expectLib;

// Create the Jest API
const jest = {
  fn,
  spyOn,
  clearAllMocks,
  resetAllMocks,
  restoreAllMocks,
  isMockFunction,
  requireActual,
  requireMock,
  resetModules,
  setTimeout,
  // Add fake timers methods
  useFakeTimers: fakeTimers.useFakeTimers.bind(fakeTimers),
  useRealTimers: fakeTimers.useRealTimers.bind(fakeTimers),
  runAllTimers: fakeTimers.runAllTimers.bind(fakeTimers),
  runAllTimersAsync: fakeTimers.runAllTimersAsync.bind(fakeTimers),
  runOnlyPendingTimers: fakeTimers.runOnlyPendingTimers.bind(fakeTimers),
  runOnlyPendingTimersAsync: fakeTimers.runOnlyPendingTimersAsync.bind(fakeTimers),
  advanceTimersByTime: fakeTimers.advanceTimersByTime.bind(fakeTimers),
  advanceTimersByTimeAsync: fakeTimers.advanceTimersByTimeAsync.bind(fakeTimers),
  advanceTimersToNextTimer: fakeTimers.advanceTimersToNextTimer.bind(fakeTimers),
  advanceTimersToNextTimerAsync: fakeTimers.advanceTimersToNextTimerAsync.bind(fakeTimers),
  clearAllTimers: fakeTimers.clearAllTimers.bind(fakeTimers),
  getTimerCount: fakeTimers.getTimerCount.bind(fakeTimers),
  setSystemTime: fakeTimers.setSystemTime.bind(fakeTimers),
  getRealSystemTime: fakeTimers.getRealSystemTime.bind(fakeTimers),
  now: fakeTimers.now.bind(fakeTimers),
  // Add module mocking functionality
  mock: moduleMocking.mock,
  unmock: moduleMocking.unmock,
  // Add retryTimes functionality (will be added by testFunctions)
  retryTimes: test.retryTimes,
  // Add seed functionality
  getSeed
};

// Use the same API for Vitest (vi)
const vi = jest;

// Set up global objects
global.test = test;
global.it = it;
global.describe = describe;
global.beforeEach = beforeEach;
global.afterEach = afterEach;
global.beforeAll = beforeAll;
global.afterAll = afterAll;
global.expect = expect;
global.jest = jest;
global.vi = vi;

// Export the functions for direct import
export {
  test,
  it,
  describe,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
  expect,
  jest,
  vi
};

// Default export for ESM
export default {
  test,
  it,
  describe,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
  expect,
  jest,
  vi
};
