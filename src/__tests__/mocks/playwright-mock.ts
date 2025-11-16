/**
 * Mock for playwright/test to avoid dependency issues in tests.
 *
 * This mock provides a minimal implementation to satisfy imports
 * from the testing package without requiring playwright to be installed.
 */

export const expect = (actual: unknown) => ({
  toBe: (expected: unknown) => {
    if (actual !== expected) {
      throw new Error(`Expected ${actual} to be ${expected}`);
    }
  },
  toEqual: (expected: unknown) => {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(`Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`);
    }
  },
  toBeTruthy: () => {
    if (!actual) {
      throw new Error(`Expected ${actual} to be truthy`);
    }
  },
  toBeFalsy: () => {
    if (actual) {
      throw new Error(`Expected ${actual} to be falsy`);
    }
  },
});

export const test = (name: string, fn: () => void | Promise<void>) => {
  // Mock implementation - actual tests use vitest
  return fn();
};

export default { expect, test };

