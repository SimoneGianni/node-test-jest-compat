/**
 * Centralized mock function creation and management
 * 
 * This module provides a unified approach to creating and managing mock functions,
 * spies, and related functionality to reduce duplication and improve maintainability.
 */
import { fn, spyOn } from 'jest-mock';
import { mockRegistry, moduleRegistry } from './registry.js';

/**
 * Creates a mock function and registers it for tracking
 * @param implementation Optional implementation for the mock function
 * @returns Mock function
 */
export function createMockFunction(implementation?: (...args: any[]) => any): any {
  const mockFn = fn(implementation);
  return mockRegistry.registerMock(mockFn);
}

/**
 * Creates a spy on an object's method and registers it for tracking
 * @param object Object to spy on
 * @param methodName Method name to spy on
 * @param accessType Optional access type for property accessors
 * @returns Spy function
 */
export function createSpyFunction(object: any, methodName: any, accessType?: any): any {
  const original = accessType ? 
    Object.getOwnPropertyDescriptor(object, methodName) : 
    object[methodName];
  
  const spyInstance = spyOn(object, methodName, accessType);
  return mockRegistry.registerSpy(spyInstance, object, methodName, original, accessType);
}

/**
 * Clears all mocks
 */
export function clearAllMocks(): void {
  mockRegistry.clearAllMocks();
}

/**
 * Resets all mocks
 */
export function resetAllMocks(): void {
  mockRegistry.resetAllMocks();
}

/**
 * Restores all mocks
 */
export function restoreAllMocks(): void {
  mockRegistry.restoreAllMocks();
}

/**
 * Checks if a function is a mock
 * @param fn Function to check
 * @returns True if the function is a mock, false otherwise
 */
export function isMockFunction(fn: any): boolean {
  return mockRegistry.isMockFunction(fn);
}

/**
 * Require the actual module
 * @param moduleName Module name to require
 * @returns Actual module
 */
export function requireActual(moduleName: string): any {
  try {
    return require(moduleName);
  } catch (e) {
    // For ESM modules
    return import(moduleName);
  }
}

/**
 * Require a mocked module
 * @param moduleName Module name to require
 * @returns Mocked module
 */
export function requireMock(moduleName: string): any {
  const cachedModule = moduleRegistry.getCachedModule(moduleName);
  if (cachedModule) {
    return cachedModule;
  }
  
  // In a real implementation, this would return a mocked version
  // For now, just return the actual module
  return requireActual(moduleName);
}

/**
 * Creates all the mock-related functions
 * @returns Object containing all mock-related functions
 */
export function createMockFunctions() {
  return {
    fn: createMockFunction,
    spyOn: createSpyFunction,
    clearAllMocks,
    resetAllMocks,
    restoreAllMocks,
    isMockFunction,
    requireActual,
    requireMock
  };
}
