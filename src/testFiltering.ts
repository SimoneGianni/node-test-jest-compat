/**
 * Implementation of Jest's test filtering functionality using Node.js test runner's filtering capabilities
 * 
 * This module provides functionality to filter tests using .only, .skip, and .todo methods,
 * similar to Jest's filtering features. It works by:
 * 1. Enhancing the test and describe functions with .only, .skip, and .todo methods
 * 2. Setting appropriate options on the test and describe calls
 * 3. Tracking the "only" mode to determine which tests should be run
 */
import { test } from 'node:test';
import { filterRegistry } from './registry.js';

/**
 * Sets the "only" mode flag
 * @param enabled Whether "only" mode is enabled
 */
function setOnlyMode(enabled: boolean) {
  filterRegistry.setOnlyMode(enabled);
}

/**
 * Checks if we're in "only" mode
 * @returns True if in "only" mode, false otherwise
 */
function isOnlyMode() {
  return filterRegistry.isOnlyMode();
}

/**
 * Enhances the test function with .only, .skip, and .todo methods
 * @param testFn Original test function
 * @returns Enhanced test function with filtering methods
 */
function enhanceTestFunction(testFn: any) {
  // Add .only method to the test function
  testFn.only = (name: string, options: any = {}, fn?: Function) => {
    // If options is a function, shift arguments
    if (typeof options === 'function') {
      fn = options;
      options = {};
    }
    
    // Set the only option
    options = { ...options, only: true };
    
    // Call the original test function
    return testFn(name, options, fn);
  };
  
  // Add .skip method to the test function
  testFn.skip = (name: string, options: any = {}, fn?: Function) => {
    // If options is a function, shift arguments
    if (typeof options === 'function') {
      fn = options;
      options = {};
    }
    
    // Set the skip option
    options = { ...options, skip: true };
    
    // Call the original test function
    return testFn(name, options, fn);
  };
  
  // Add .todo method to the test function
  testFn.todo = (name: string, options: any = {}, fn?: Function) => {
    // If options is a function, shift arguments
    if (typeof options === 'function') {
      fn = options;
      options = {};
    }
    
    // Set the todo option
    options = { ...options, todo: true };
    
    // Call the original test function
    return testFn(name, options, fn);
  };
  
  return testFn;
}

/**
 * Enhances the describe function with .only, .skip, and .todo methods
 * @param describeFn Original describe function
 * @returns Enhanced describe function with filtering methods
 */
function enhanceDescribeFunction(describeFn: any) {
  // Create a wrapper function that preserves the original function's properties
  const enhancedDescribe: any = function(name: string, options: any = {}, fn?: Function) {
    // If options is a function, shift arguments
    if (typeof options === 'function') {
      fn = options;
      options = {};
    }
    
    // Call the original describe function
    return describeFn(name, options, fn);
  };
  
  // Copy all properties from the original describe function
  Object.keys(describeFn).forEach(key => {
    enhancedDescribe[key] = describeFn[key];
  });
  
  // Add .only method to the describe function
  enhancedDescribe.only = (name: string, fn: Function) => {
    // Set the only option
    const options = { only: true };
    
    // Call the original describe function
    return describeFn(name, options, fn);
  };
  
  // Add .skip method to the describe function
  enhancedDescribe.skip = (name: string, fn: Function) => {
    // Set the skip option
    const options = { skip: true };
    
    // Call the original describe function
    return describeFn(name, options, fn);
  };
  
  // Add .todo method to the describe function
  enhancedDescribe.todo = (name: string, fn: Function) => {
    // Set the todo option
    const options = { todo: true };
    
    // Call the original describe function
    return describeFn(name, options, fn);
  };
  
  return enhancedDescribe;
}

// Export the test filtering functionality
export const testFiltering = {
  setOnlyMode,
  isOnlyMode,
  enhanceTestFunction,
  enhanceDescribeFunction
};
