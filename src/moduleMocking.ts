// Implementation of Jest's module mocking functionality using Node.js test runner's mock.module()
import { test } from 'node:test';
import { moduleRegistry } from './registry.js';

// Implementation of jest.mock() using Node.js test runner's mock.module()
function mockModule(moduleName: string, factory?: () => any, options?: { virtual?: boolean }) {
  // Check if the module is already mocked
  if (moduleRegistry.hasMockedModule(moduleName)) {
    return;
  }

  let moduleExports: any;

  // If a factory function is provided, use it to create the mock
  if (factory) {
    moduleExports = factory();
  } else {
    // Default mock implementation
    moduleExports = {};
  }

  try {
    // Use test.mock.module directly for better compatibility
    const mockContext = test.mock.module(moduleName, {
      defaultExport: moduleExports.__esModule ? moduleExports.default : moduleExports,
      namedExports: moduleExports.__esModule ? moduleExports : moduleExports,
    });

    // Store the mock context for later use
    moduleRegistry.registerMockedModule(moduleName, mockContext);

    return mockContext;
  } catch (error) {
    console.error(`Error mocking module ${moduleName}:`, error);
    throw error;
  }
}

// Implementation of jest.unmock()
function unmockModule(moduleName: string) {
  moduleRegistry.unmockModule(moduleName);
}

// Implementation of jest.resetModules()
function resetAllModules() {
  moduleRegistry.resetAllModules();
}

// Export the module mocking functionality
export const moduleMocking = {
  mock: mockModule,
  unmock: unmockModule,
  resetModules: resetAllModules
};
