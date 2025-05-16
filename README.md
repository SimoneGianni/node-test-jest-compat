# @simonegianni/node-test-jest-compat

Run your existing Jest suites on Node's built-in test runner without having to rewrite your tests.

## Features

- **Drop-in replacement** for Jest's test runner
- **Compatible with both ESM and CommonJS** modules
- **Uses Jest's own mocking library** for maximum compatibility
- **Supports all common Jest globals** (`describe`, `test`, `it`, `beforeEach`, etc.)
- **Includes Jest's expect assertions** for seamless test migration
- **No need to change your test files** - just change how you run them

## Installation

Just install the package as a development dependency in your project using your preferred package manager:

```bash
npm install --save-dev @simonegianni/node-test-jest-compat

yarn add --dev @simonegianni/node-test-jest-compat

pnpm add --save-dev @simonegianni/node-test-jest-compat

bun add --dev @simonegianni/node-test-jest-compat
```

## Code changes

If you import or require 'jest' in your test files, you need to change it to import 'node-test-jest-compat' instead. This is because the package is a drop-in replacement for Jest's test runner.

```javascript
// Before
import 'jest';
// After
import '@simonegianni/node-test-jest-compat';
```

## What you do not need to do

- You do not need to change your test files. The package is designed to be a drop-in replacement for Jest's test runner (but see below for unsupported features).
- You do not need to change your `tsconfig.json` or `jsconfig.json` files. From a typing perspective, you can keep using jest types.


## Usage

You can run your tests using Node's built-in test runner by running the following command:

```bash
node --test
```

See [Node.js documentation](https://nodejs.org/api/test.html#test_test) for more information on the test runner.

If you are not importing `@simonegianni/node-test-jest-compat` in your test files, you can run the tests with the following command:

```bash
node --test --import @simonegianni/node-test-jest-compat
```

Or, if you are using CommonJS modules, you can run the tests with the following command:

```bash
node --test --require @simonegianni/node-test-jest-compat
```

For TypeScript projects, you can easily stack ts-node:

```bash
node --test --import ts-node/esm --import @simonegianni/node-test-jest-compat
```

However note that there are various issues with ts-node, ESM and loaders, as the NodeJS team is evolving those APIs and they are not yet stable. So, pre-compiling your TypeScript files to JavaScript and running them with Node's test runner is recommended.

## Supported Jest Features

### Basic Features
- ✅ `describe`, `test`, `it` for defining test suites and cases
- ✅ `beforeEach`, `afterEach`, `beforeAll`, `afterAll` hooks
- ✅ `expect` assertions (using Jest's own expect library)
- ✅ `jest.getSeed()` - Returns a seed value for deterministic randomness

### Mocking and Spying
- ✅ Mock functions with `jest.fn()` or `vi.fn()`
- ✅ Spies with `jest.spyOn()` or `vi.spyOn()`
- ✅ Mock clearing with `jest.clearAllMocks()` or `vi.clearAllMocks()`
- ✅ Mock resetting with `jest.resetAllMocks()` or `vi.resetAllMocks()`
- ✅ Mock restoring with `jest.restoreAllMocks()` or `vi.restoreAllMocks()`
- ✅ Check if a function is a mock with `jest.isMockFunction(fn)` or `vi.isMockFunction(fn)`
- ✅ Require actual modules with `jest.requireActual(moduleName)`
- ✅ Require mocked modules with `jest.requireMock(moduleName)`
- ✅ Reset module registry with `jest.resetModules()`
- ✅ Set test timeout with `jest.setTimeout(timeout)`
- ✅ Fake timers with `jest.useFakeTimers()`, `jest.useRealTimers()`, etc.

### Snapshot Testing
- ✅ `expect().toMatchSnapshot()` - Uses Node.js test runner's snapshot functionality
- ✅ Snapshot file generation and comparison
- ✅ Snapshot directory structure matching Jest's conventions

### Module Mocking
NOTICE: This is currently still experimental in NodeJs and works only under certain conditions. See [Node.js documentation](https://nodejs.org/api/test.html#test_test_mocking) for more information.
- ✅ `jest.mock()` - Uses Node.js test runner's mock.module() function
- ✅ `jest.unmock()` - Restores mocked modules
- ✅ Factory functions for custom mock implementations

### Test Filtering
- ✅ `test.only()` - Runs only tests marked with .only
- ✅ `describe.only()` - Runs only test suites marked with .only
- ✅ `it.only()` - Alias for test.only()

### Test Retries
- ✅ `jest.retryTimes()` - Retries failed tests a specified number of times
- ✅ Support for logging errors before retry

## Unsupported Jest Features

The following Jest features are *NOT* supported:

### Automocking
- ❌ `jest.enableAutomock()` - Node's test runner doesn't have an automocking system
- ❌ `jest.disableAutomock()` - Related to automocking

### Misc
- ❌ `jest.isEnvironmentTornDown()` - Specific to Jest's test environment

## Module Support

The package is designed to work with both CommonJS and ESM modules. You can use it in your existing projects without any issues.

- If you are using ESM, you can import the package using `import { test, expect } from '@simonegianni/node-test-jest-compat'`.
- If you are using CommonJS, you can import the package using `const { test, expect } = require('@simonegianni/node-test-jest-compat')`.

## Implementation Details

This package:

1. Uses TypeScript to build both ESM and CommonJS versions
2. Uses jest-mock for mocking functions
3. Uses the actual Jest expect for assertions
4. Provides a seamless compatibility layer between Jest's API and Node's built-in test runner

## For Developers

### Development Workflow

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Make your changes in the `src` directory
4. Build the project:
   ```bash
   npm run build
   ```
5. Build and then run tests:
   ```bash
   npm test
   ```

### Publishing to npm

To publish a new version to npm:

1. Update the version in package.json
2. Build and run tests to ensure everything works:
   ```bash
   npm test
   ```
3. Publish to npm:
   ```bash
   npm publish
   ```

Note: You need to be logged in to npm (`npm login`) and have appropriate permissions to publish the package.

## License

APACHE 2.0
