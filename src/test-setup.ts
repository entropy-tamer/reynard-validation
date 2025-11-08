/**
 * Test setup configuration for the validation package.
 *
 * This module configures the test environment for the validation package using
 * the unified core test setup from the reynard-testing package. It ensures
 * consistent test configuration across all validation package tests.
 *
 * The setup includes:
 * - Test environment configuration
 * - Mock and fixture setup
 * - Shared test utilities
 * - Common test helpers
 *
 * @example
 * ```typescript
 * // This file is automatically imported by test files
 * // No manual setup required in individual test files
 * ```
 *
 * @since 1.0.0
 * @author Reynard Validation Package
 *
 * @remarks
 * This setup is automatically applied to all test files in the validation package.
 * Individual test files should not need to import or configure this setup manually.
 */

import { setupCoreTest } from "@entropy-tamer/reynard-testing";

/**
 * Initializes the core test environment for the validation package.
 *
 * This function sets up the unified test configuration from the reynard-testing
 * package, ensuring all validation package tests run with consistent settings
 * and shared utilities.
 *
 * @since 1.0.0
 */
setupCoreTest();
