/**
 * Simplified test function implementation
 * 
 * This module provides a unified approach to implementing test and describe functions
 * with all necessary capabilities (retries, filtering, context tracking, etc.)
 * in a single layer, without excessive decoration.
 */
import { test as nodeTest, describe as nodeDescribe } from 'node:test';
import { testContextRegistry, retryRegistry, filterRegistry } from './registry.js';

/**
 * Creates a test function with all Jest-compatible features in a single implementation
 * @returns Test function with all Jest features
 */
export function createTestFunction() {
  // Create a single function that handles all features
  const testFunction = (name: string, fnOrOptions?: Function | object, maybeTimeout?: number | Function) => {
    // Determine the actual parameters based on Jest's API
    let fn: Function | undefined;
    let options: any = {};
    
    // Handle Jest API: test(name, fn, timeout?)
    if (typeof fnOrOptions === 'function') {
      fn = fnOrOptions;
      // If timeout is provided, add it to options
      if (typeof maybeTimeout === 'number') {
        options.timeout = maybeTimeout;
      }
    } 
    // Handle Node.js API: test(name, options?, fn?)
    else if (typeof fnOrOptions === 'object' && fnOrOptions !== null) {
      options = fnOrOptions;
      // Only assign if it's a function
      if (typeof maybeTimeout === 'function') {
        fn = maybeTimeout as Function;
      }
    }
    
    // Create a wrapper function that sets the current test context and handles retries
    const wrappedFn = fn ? (t: any, ...args: any[]) => {
      // Set the current test context for snapshot testing
      testContextRegistry.setCurrentTestContext(t);
      
      // Apply retry logic directly
      const retryCount = retryRegistry.getCurrentRetryCount();
      if (retryCount > 0) {
        return handleRetries(t, fn!, retryCount, name, ...args);
      }
      
      // Call the original test function
      return fn!(t, ...args);
    } : undefined;
    
    // Call the Node.js test function with the processed parameters
    return nodeTest(name, options, wrappedFn);
  };
  
  // Add .only, .skip, .todo methods directly
  testFunction.only = (name: string, fn?: Function, timeout?: number) => {
    const options: any = { only: true };
    if (typeof timeout === 'number') {
      options.timeout = timeout;
    }
    
    // Set the only mode flag
    filterRegistry.setOnlyMode(true);
    
    return testFunction(name, options, fn);
  };
  
  testFunction.skip = (name: string, fn?: Function) => {
    return testFunction(name, { skip: true }, fn);
  };
  
  testFunction.todo = (name: string) => {
    return testFunction(name, { todo: true });
  };
  
  // Add retryTimes method directly
  testFunction.retryTimes = (count: number, options?: { logErrorsBeforeRetry?: boolean }) => {
    retryRegistry.setGlobalRetryCount(count);
    return testFunction;
  };
  
  return testFunction;
}

/**
 * Creates a describe function with all Jest-compatible features in a single implementation
 * @returns Describe function with all Jest features
 */
export function createDescribeFunction() {
  // Create a single function that handles all features
  const describeFunction = (name: string, fnOrOptions?: Function | object, fn?: Function) => {
    let options: any = {};
    
    // Handle the case where options is a function
    if (typeof fnOrOptions === 'function') {
      fn = fnOrOptions;
    } else if (typeof fnOrOptions === 'object' && fnOrOptions !== null) {
      options = fnOrOptions;
    }
    
    // Create a wrapper function that handles describe block tracking for retries
    const wrappedFn = fn ? () => {
      // Push this describe block onto the stack before running its tests
      retryRegistry.pushDescribeBlock(name);
      
      // Run the describe block function
      fn!();
      
      // Pop this describe block from the stack after running its tests
      retryRegistry.popDescribeBlock();
    } : undefined;
    
    // Call the Node.js describe function with the processed parameters
    return nodeDescribe(name, options, wrappedFn);
  };
  
  // Add .only, .skip, .todo methods directly
  describeFunction.only = (name: string, fn: Function) => {
    // Set the only mode flag
    filterRegistry.setOnlyMode(true);
    
    return describeFunction(name, { only: true }, fn);
  };
  
  describeFunction.skip = (name: string, fn: Function) => {
    return describeFunction(name, { skip: true }, fn);
  };
  
  describeFunction.todo = (name: string, fn?: Function) => {
    return describeFunction(name, { todo: true }, fn);
  };
  
  return describeFunction;
}

/**
 * Helper function for handling retries
 */
async function handleRetries(t: any, fn: Function, retryCount: number, testName: string, ...args: any[]) {
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
        console.log(`Test "${testName}" failed on attempt ${attempt + 1}, retrying... (${error.message})`);
      }
      // Increment the attempt counter
      attempt++;
    }
  }
  
  // If we've exhausted all retries and still failed, throw the last error
  if (lastError) {
    throw lastError;
  }
}

/**
 * Creates all the test-related global functions and exports
 * @returns Object containing all test-related functions
 */
export function createTestFunctions() {
  const test = createTestFunction();
  const describe = createDescribeFunction();
  
  // Create aliases
  const it = test;
  
  // Create lifecycle hooks
  const beforeEach = (fn: any) => {
    nodeTest.beforeEach(fn);
  };
  
  const afterEach = (fn: any) => {
    nodeTest.afterEach(fn);
  };
  
  const beforeAll = (fn: any) => {
    nodeTest.before(fn);
  };
  
  const afterAll = (fn: any) => {
    nodeTest.after(fn);
  };
  
  return {
    test,
    it,
    describe,
    beforeEach,
    afterEach,
    beforeAll,
    afterAll
  };
}
