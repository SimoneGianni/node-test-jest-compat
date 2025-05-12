/**
 * Central registry for managing state across the test adapter
 * 
 * This module provides a centralized place to store and manage state that was previously
 * scattered across multiple files as global variables. This includes:
 * - Mock functions and spies
 * - Module mocks
 * - Current test context
 * - Retry counts
 * - Only mode tracking
 */

// Track all created mocks for reset/restore operations
const createdMocks = new Set<any>();
const spiedFunctions = new Map<any, { object: any; methodName: string; original: any; accessType?: string }>();

// Module mocking state
const mockedModules = new Map<string, any>();
const moduleCache = new Map<string, any>();

// Test context state
let currentTestContext: any = null;

// Test retry state
let currentRetryCount = 0;
const describeStack: { name: string; retryCount: number }[] = [];

// Test filtering state
let onlyMode = false;

// Registry for managing mocks
export const mockRegistry = {
  // Mock functions
  registerMock: (mock: any) => {
    createdMocks.add(mock);
    return mock;
  },
  
  registerSpy: (spy: any, object: any, methodName: string, original: any, accessType?: string) => {
    spiedFunctions.set(spy, { object, methodName, original, accessType });
    createdMocks.add(spy);
    return spy;
  },
  
  clearAllMocks: () => {
    createdMocks.forEach(mock => {
      if (typeof mock.mockClear === 'function') {
        mock.mockClear();
      }
    });
  },
  
  resetAllMocks: () => {
    createdMocks.forEach(mock => {
      if (typeof mock.mockReset === 'function') {
        mock.mockReset();
      }
    });
  },
  
  restoreAllMocks: () => {
    spiedFunctions.forEach((info, spy) => {
      if (typeof spy.mockRestore === 'function') {
        spy.mockRestore();
      }
    });
    spiedFunctions.clear();
  },
  
  isMockFunction: (fn: any) => {
    return fn && !!fn._isMockFunction;
  }
};

// Registry for module mocking
export const moduleRegistry = {
  registerMockedModule: (moduleName: string, mockContext: any) => {
    mockedModules.set(moduleName, mockContext);
    return mockContext;
  },
  
  getMockedModule: (moduleName: string) => {
    return mockedModules.get(moduleName);
  },
  
  hasMockedModule: (moduleName: string) => {
    return mockedModules.has(moduleName);
  },
  
  unmockModule: (moduleName: string) => {
    const mockContext = mockedModules.get(moduleName);
    if (mockContext) {
      mockContext.restore();
      mockedModules.delete(moduleName);
    }
  },
  
  resetAllModules: () => {
    for (const [moduleName, mockContext] of mockedModules.entries()) {
      mockContext.restore();
    }
    mockedModules.clear();
    moduleCache.clear();
    
    // In ESM modules, we can't directly access require.cache
    // We only clear our internal moduleCache
    try {
      // This will work in CommonJS but not in ESM
      if (typeof require !== 'undefined' && require.cache) {
        Object.keys(require.cache).forEach(key => {
          delete require.cache[key];
        });
      }
    } catch (e) {
      // Ignore errors in ESM context
    }
  },
  
  cacheModule: (moduleName: string, module: any) => {
    moduleCache.set(moduleName, module);
  },
  
  getCachedModule: (moduleName: string) => {
    return moduleCache.get(moduleName);
  }
};

// Registry for test context
export const testContextRegistry = {
  setCurrentTestContext: (context: any) => {
    currentTestContext = context;
  },
  
  getCurrentTestContext: () => {
    return currentTestContext;
  }
};

// Registry for test retries
export const retryRegistry = {
  setGlobalRetryCount: (count: number) => {
    currentRetryCount = count;
    
    // If we're inside a describe block, update the current describe block's retry count
    if (describeStack.length > 0) {
      describeStack[describeStack.length - 1].retryCount = count;
    }
  },
  
  getCurrentRetryCount: () => {
    // If we're inside a describe block, use its retry count
    if (describeStack.length > 0) {
      return describeStack[describeStack.length - 1].retryCount;
    }
    
    // Otherwise use the global retry count
    return currentRetryCount;
  },
  
  pushDescribeBlock: (name: string) => {
    // Inherit retry count from parent describe block or global
    const inheritedRetryCount = retryRegistry.getCurrentRetryCount();
    describeStack.push({ name, retryCount: inheritedRetryCount });
  },
  
  popDescribeBlock: () => {
    describeStack.pop();
  }
};

// Registry for test filtering
export const filterRegistry = {
  setOnlyMode: (enabled: boolean) => {
    onlyMode = enabled;
  },
  
  isOnlyMode: () => {
    return onlyMode;
  }
};
