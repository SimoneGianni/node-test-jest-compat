// Implementation of Jest's snapshot testing using Node.js test runner's snapshot functionality
import { test } from 'node:test';
import path from 'node:path';
import fs from 'node:fs';
import { expect as expectLib } from 'expect';
import { testContextRegistry } from './registry.js';

// Track if we've already set up the snapshot path resolver
let resolverSet = false;

// Default serializer for snapshots
const defaultSerializer = (value: any): string => {
  return JSON.stringify(value, null, 2);
};

// Set up the snapshot path resolver to match Jest's behavior
function setupSnapshotPathResolver() {
  if (resolverSet) return;
  
  test.snapshot.setResolveSnapshotPath((testPath: string|undefined) => {
    if (!testPath) {
      throw new Error('Cannot resolve snapshot path without a test file path');
    }
    
    const snapshotDir = path.join(path.dirname(testPath), '__snapshots__');
    const snapshotFile = path.join(snapshotDir, `${path.basename(testPath)}.snap`);
    
    // Ensure the snapshot directory exists
    if (!fs.existsSync(snapshotDir)) {
      fs.mkdirSync(snapshotDir, { recursive: true });
    }
    
    return snapshotFile;
  });
  
  // Set default serializers
  test.snapshot.setDefaultSnapshotSerializers([defaultSerializer]);
  
  resolverSet = true;
}

// Function to set the current test context
export function setCurrentTestContext(context: any) {
  testContextRegistry.setCurrentTestContext(context);
}

// Extend Jest's expect with toMatchSnapshot
function extendExpect() {
  // Add toMatchSnapshot to Jest's expect
  if (!expectLib.extend) {
    console.warn('Warning: expect.extend is not available. Snapshot testing may not work correctly.');
    return;
  }

  expectLib.extend({
    toMatchSnapshot(received: any) {
      // Use the current test context
      const context = testContextRegistry.getCurrentTestContext();
      if (!context || !context.assert) {
        throw new Error('Snapshot testing requires a test context with assert property');
      }
      
      try {
        // Use the Node.js test runner's snapshot functionality
        context.assert.snapshot(received);
        return {
          message: () => 'Snapshot matches',
          pass: true,
        };
      } catch (error: any) {
        return {
          message: () => error.message || 'Snapshot does not match',
          pass: false,
        };
      }
    },
  });
}

// Initialize the snapshot functionality
export function initializeSnapshot() {
  setupSnapshotPathResolver();
  extendExpect();
}

// Export the snapshot functionality to be used in the main module
export const snapshotTesting = {
  initializeSnapshot,
  setCurrentTestContext,
};
