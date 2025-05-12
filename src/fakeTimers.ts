// Implementation of Jest's fake timers using Node.js test runner's mock timers
import { mock } from 'node:test';
// Class to wrap Node.js's MockTimers and provide a Jest-compatible API
export class FakeTimers {
  private mockTimers: typeof mock.timers;
  private isFaking: boolean = false;
  // Node.js test runner only supports these APIs directly
  private defaultApis = ['setTimeout', 'setInterval', 'setImmediate', 'Date'];

  constructor() {
    this.mockTimers = mock.timers;
    this.isFaking = false;
  }

  // Jest API: useFakeTimers
  useFakeTimers(config: any = {}) {
    if (this.isFaking) {
      this.mockTimers.reset();
    }

    const apis :any = config.doNotFake 
      ? this.defaultApis.filter(api => !config.doNotFake.includes(api))
      : this.defaultApis;

    const now = config.now !== undefined ? config.now : 0;

    this.mockTimers.enable({ 
      apis, 
      now 
    });
    this.isFaking = true;
  }

  // Jest API: useRealTimers
  useRealTimers() {
    if (this.isFaking) {
      this.mockTimers.reset();
      this.isFaking = false;
    }
  }

  // Jest API: runAllTimers
  runAllTimers() {
    this.ensureFakingTime();
    this.mockTimers.runAll();
  }

  // Jest API: runAllTimersAsync
  async runAllTimersAsync() {
    this.ensureFakingTime();
    // Node.js doesn't have a direct equivalent, but runAll should work
    this.mockTimers.runAll();
  }

  // Jest API: runOnlyPendingTimers
  runOnlyPendingTimers() {
    this.ensureFakingTime();
    // Node.js doesn't have a direct equivalent, but runAll should work
    this.mockTimers.runAll();
  }

  // Jest API: runOnlyPendingTimersAsync
  async runOnlyPendingTimersAsync() {
    this.ensureFakingTime();
    // Node.js doesn't have a direct equivalent, but runAll should work
    this.mockTimers.runAll();
  }

  // Jest API: advanceTimersByTime
  advanceTimersByTime(msToRun: number) {
    this.ensureFakingTime();
    this.mockTimers.tick(msToRun);
  }

  // Jest API: advanceTimersByTimeAsync
  async advanceTimersByTimeAsync(msToRun: number) {
    this.ensureFakingTime();
    this.mockTimers.tick(msToRun);
  }

  // Jest API: advanceTimersToNextTimer
  advanceTimersToNextTimer(steps = 1) {
    this.ensureFakingTime();
    // Node.js doesn't have a direct equivalent, but we can use tick with a small value
    for (let i = 0; i < steps; i++) {
      this.mockTimers.tick(1);
    }
  }

  // Jest API: advanceTimersToNextTimerAsync
  async advanceTimersToNextTimerAsync(steps = 1) {
    this.ensureFakingTime();
    // Node.js doesn't have a direct equivalent, but we can use tick with a small value
    for (let i = 0; i < steps; i++) {
      this.mockTimers.tick(1);
    }
  }

  // Jest API: clearAllTimers
  clearAllTimers() {
    this.ensureFakingTime();
    this.mockTimers.reset();
    // Re-enable timers after reset
    this.mockTimers.enable({ apis: this.defaultApis as any});
  }

  // Jest API: getTimerCount
  getTimerCount() {
    // Node.js doesn't expose a direct way to get timer count
    // This is a placeholder implementation
    console.warn('getTimerCount is not supported in Node.js test runner.');
    return 0;
  }

  // Jest API: setSystemTime
  setSystemTime(now?: number | Date) {
    this.ensureFakingTime();
    const time = now instanceof Date ? now.getTime() : (now || 0);
    this.mockTimers.setTime(time);
  }

  // Jest API: getRealSystemTime
  getRealSystemTime() {
    return Date.now();
  }

  // Jest API: now
  now() {
    if (this.isFaking) {
      // There's no direct equivalent in Node.js, but we can use Date.now()
      // since we're mocking Date
      return Date.now();
    }
    return Date.now();
  }

  // Helper method to ensure fake timers are enabled
  private ensureFakingTime() {
    if (!this.isFaking) {
      console.warn(
        'A function to advance timers was called but the timers APIs are not replaced ' +
        'with fake timers. Call `jest.useFakeTimers()` in this test file or enable ' +
        "fake timers for all tests by setting 'fakeTimers': {'enableGlobally': true} " +
        'in Jest configuration file.'
      );
    }
    return this.isFaking;
  }
}

// Create a singleton instance
export const fakeTimers = new FakeTimers();
