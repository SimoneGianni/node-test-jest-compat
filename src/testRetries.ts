/**
 * Implementation of Jest's test retries functionality using Node.js test context
 * 
 * This module provides functionality to retry failed tests a specified number of times,
 * similar to Jest's retryTimes feature. It works by:
 * 1. Maintaining a global retry count for the current test suite
 * 2. Wrapping test functions to implement retry logic
 * 3. Providing a clean API that matches Jest's retryTimes method
 */
import { test } from 'node:test';
import { retryRegistry } from './registry.js';

/**
 * Sets the current global retry count for tests
 * @param count Number of times to retry failed tests
 */
function setGlobalRetryCount(count: number) {
  retryRegistry.setGlobalRetryCount(count);
}

/**
 * Gets the current retry count (either from current describe block or global)
 */
function getCurrentRetryCount(): number {
  return retryRegistry.getCurrentRetryCount();
}

/**
 * Pushes a new describe block onto the stack
 * @param name Name of the describe block
 */
function pushDescribeBlock(name: string) {
  retryRegistry.pushDescribeBlock(name);
}

/**
 * Pops the current describe block from the stack
 */
function popDescribeBlock() {
  retryRegistry.popDescribeBlock();
}

/**
 * Wraps the original test function to implement retry logic
 * @param testFn Original test function from Node.js
 * @returns Wrapped test function with retry capability
 */
function withRetries(testFn: any) {
  return function retryableTest(name: string, options: any = {}, fn?: Function) {
    // If options is a function, shift arguments
    if (typeof options === 'function') {
      fn = options;
      options = {};
    }
    
    // Get the current retry count
    const retryCount = getCurrentRetryCount();
    
    // If no test function provided, just pass through
    if (!fn) {
      return testFn(name, options);
    }
    
    // Create a wrapper function that handles retries
    const wrappedFn = async (t: any, ...args: any[]) => {
      let lastError: Error | undefined;
      let attempt = 0;
      
      // Try the test up to retryCount + 1 times (original attempt + retries)
      while (attempt <= retryCount) {
        try {
          // Run the test
          await fn(t, ...args);
          // If successful, break out of the loop
          return;
        } catch (error: any) {
          // Store the error
          lastError = error;
          // Log the error if not the last attempt
          if (attempt < retryCount) {
            console.log(`Test "${name}" failed on attempt ${attempt + 1}, retrying... (${error.message})`);
          }
          // Increment the attempt counter
          attempt++;
        }
      }
      
      // If we've exhausted all retries and still failed, throw the last error
      if (lastError) {
        throw lastError;
      }
    };
    
    // Call the original test function with the wrapped function
    return testFn(name, options, wrappedFn);
  };
}

/**
 * Enhances the describe function to track describe blocks for retry context
 * @param describeFn Original describe function
 * @returns Enhanced describe function that tracks blocks for retry context
 */
function enhanceDescribeFunction(describeFn: any) {
  // Create enhanced describe function that tracks retry context
  const enhancedDescribe: any = function(name: string, options: any = {}, fn?: Function) {
    // If options is a function, shift arguments
    if (typeof options === 'function') {
      fn = options;
      options = {};
    }
    
    return describeFn(name, options, () => {
      // Push this describe block onto the stack before running its tests
      pushDescribeBlock(name);
      
      // Run the describe block function
      if (fn) fn();
      
      // Pop this describe block from the stack after running its tests
      popDescribeBlock();
    });
  };
  
  // Copy all properties from the original describe function
  Object.keys(describeFn).forEach(key => {
    if (key === 'only' || key === 'todo') {
      // For special methods like only, todo, wrap them to maintain retry context
      enhancedDescribe[key] = function(name: string, options: any = {}, fn: Function) {

        // If options is a function, shift arguments
        if (typeof options === 'function') {
          fn = options;
          options = {};
        }
        
        return describeFn[key](name, options, () => {
          // Push this describe block onto the stack before running its tests
          pushDescribeBlock(name);
          
          // Run the describe block function
          if (fn) fn();
          
          // Pop this describe block from the stack after running its tests
          popDescribeBlock();
        });
      };
    } else {
      // For other properties, just copy them directly
      enhancedDescribe[key] = describeFn[key];
    }
  });
  
  return enhancedDescribe;
}

/**
 * Adds the retryTimes method to the test function
 * @param testFn Test function to enhance
 * @returns Enhanced test function with retryTimes method
 */
function addRetryTimes(testFn: any) {
  // Add retryTimes method to the test function
  testFn.retryTimes = (count: number, options?: { logErrorsBeforeRetry?: boolean }) => {
    // Set the retry count for subsequent tests
    setGlobalRetryCount(count);
    
    // Return the test function for chaining
    return testFn;
  };
  
  // Also add retryTimes as a global method on jest
  if (global.jest) {
    global.jest.retryTimes = (count: number, options?: any) => {
      // Set the retry count for subsequent tests
      setGlobalRetryCount(count);
      
      // Return jest for chaining
      return global.jest;
    };
  }
  
  return testFn;
}

// Export the test retries functionality
export const testRetries = {
  setGlobalRetryCount,
  getCurrentRetryCount,
  pushDescribeBlock,
  popDescribeBlock,
  withRetries,
  enhanceDescribeFunction,
  addRetryTimes
};
