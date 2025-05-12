// This test verifies the fake timers functionality
// The adapter is imported via the --import flag in the test command

describe('Fake Timers', () => {
  beforeEach(() => {
    // Make sure we start with real timers
    jest.useRealTimers();
  });

  afterEach(() => {
    // Clean up after each test
    jest.useRealTimers();
  });

  test('jest.useFakeTimers should mock setTimeout', () => {
    // Setup
    jest.useFakeTimers();
    const callback = jest.fn();
    
    // Act
    setTimeout(callback, 1000);
    
    // Assert - callback should not be called yet
    expect(callback).not.toHaveBeenCalled();
    
    // Advance timers
    jest.runAllTimers();
    
    // Assert - callback should now be called
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('jest.advanceTimersByTime should advance timers by the specified time', () => {
    // Setup
    jest.useFakeTimers();
    const callback = jest.fn();
    
    // Act
    setTimeout(callback, 1000);
    
    // Assert - callback should not be called yet
    expect(callback).not.toHaveBeenCalled();
    
    // Advance timers by 500ms (not enough to trigger the callback)
    jest.advanceTimersByTime(500);
    
    // Assert - callback should still not be called
    expect(callback).not.toHaveBeenCalled();
    
    // Advance timers by another 500ms (enough to trigger the callback)
    jest.advanceTimersByTime(500);
    
    // Assert - callback should now be called
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('jest.setSystemTime should set the system time', () => {
    // Setup
    jest.useFakeTimers();
    const mockDate = new Date(2020, 0, 1); // January 1, 2020
    
    // Act
    jest.setSystemTime(mockDate);
    
    // Assert
    const currentDate = new Date();
    expect(currentDate.getFullYear()).toBe(2020);
    expect(currentDate.getMonth()).toBe(0); // January
    expect(currentDate.getDate()).toBe(1);
  });

  test('nested timers should work correctly', () => {
    // Setup
    jest.useFakeTimers();
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    
    // Act
    setTimeout(() => {
      callback1();
      setTimeout(callback2, 1000);
    }, 1000);
    
    // Assert - no callbacks should be called yet
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();
    
    // Advance timers by 1000ms (enough to trigger the first callback)
    jest.advanceTimersByTime(1000);
    
    // Assert - first callback should be called, second should not
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).not.toHaveBeenCalled();
    
    // Advance timers by another 1000ms (enough to trigger the second callback)
    jest.advanceTimersByTime(1000);
    
    // Assert - both callbacks should now be called
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  test('clearAllTimers should clear all pending timers', () => {
    // Setup
    jest.useFakeTimers();
    const callback = jest.fn();
    
    // Act
    setTimeout(callback, 1000);
    
    // Assert - callback should not be called yet
    expect(callback).not.toHaveBeenCalled();
    
    // Clear all timers
    jest.clearAllTimers();
    
    // Advance timers
    jest.runAllTimers();
    
    // Assert - callback should still not be called because timers were cleared
    expect(callback).not.toHaveBeenCalled();
  });

  test('vi.useFakeTimers should also work for Vitest compatibility', () => {
    // Setup
    vi.useFakeTimers();
    const callback = jest.fn();
    
    // Act
    setTimeout(callback, 1000);
    
    // Assert - callback should not be called yet
    expect(callback).not.toHaveBeenCalled();
    
    // Advance timers
    vi.runAllTimers();
    
    // Assert - callback should now be called
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
