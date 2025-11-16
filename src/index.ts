/**
 * Reynard Validation Package - Unified validation utilities for the Reynard framework.
 *
 * This package consolidates all validation logic from across the ecosystem
 * into a single, consistent, and powerful validation system. It provides
 * comprehensive validation capabilities including:
 *
 * - **Core Validation Engine**: Type-safe validation with customizable schemas
 * - **Built-in Validators**: Email, URL, password, file, and API validation
 * - **JSON Remediation**: Automatic fixing of malformed JSON files
 * - **Schema System**: Flexible validation schemas with custom rules
 * - **Error Handling**: Detailed validation errors with context information
 *
 * @example
 * ```typescript
 * import { ValidationUtils, validateEmail, validatePassword } from 'reynard-validation';
 *
 * // Basic validation
 * const emailResult = validateEmail('user@example.com');
 * const passwordResult = validatePassword('SecurePass123!');
 *
 * // Schema-based validation
 * const schema = { type: 'email', required: true };
 * const result = ValidationUtils.validateValue('user@example.com', schema);
 * ```
 *
 * @since 1.0.0
 * @author Swift-Quantum-7
 *
 * @remarks
 * Performance characteristics:
 * - Time complexity: O(1) for basic validators, O(n) for complex schemas
 * - Memory usage: O(1) constant space for most operations
 * - Validation speed: Optimized for high-frequency validation scenarios
 */

// ============================================================================
// Core Exports
// ============================================================================

/**
 * Core validation engine providing schema-based validation capabilities.
 *
 * @example
 * ```typescript
 * import { ValidationUtils } from 'reynard-validation';
 *
 * const result = ValidationUtils.validateValue('user@example.com', {
 *   type: 'email',
 *   required: true
 * });
 * ```
 */
export { ValidationUtils } from "./core.js";

/**
 * Custom error class for validation failures with detailed context information.
 *
 * @example
 * ```typescript
 * import { ValidationError } from 'reynard-validation';
 *
 * try {
 *   ValidationUtils.validateOrThrow('invalid', schema);
 * } catch (error) {
 *   if (error instanceof ValidationError) {
 *     console.log(error.context.field);
 *   }
 * }
 * ```
 */
export { ValidationError } from "./types.js";

// ============================================================================
// Type Exports
// ============================================================================

/**
 * TypeScript type definitions for the validation system.
 *
 * @example
 * ```typescript
 * import type { ValidationSchema, ValidationResult } from 'reynard-validation';
 *
 * const schema: ValidationSchema = {
 *   type: 'email',
 *   required: true,
 *   minLength: 5
 * };
 *
 * const result: ValidationResult = ValidationUtils.validateValue('test@example.com', schema);
 * ```
 */
export type {
  FieldValidationOptions,
  FileValidationOptions,
  FileValidationResult,
  FormValidationOptions,
  FormValidationResult,
  MultiValidationResult,
  PasswordStrength,
  URLValidationResult,
  ValidationErrorContext,
  ValidationResult,
  ValidationRules,
  ValidationSchema,
} from "./types.js";

// ============================================================================
// Schema Exports
// ============================================================================

/**
 * Pre-built validation schemas and schema creation utilities.
 *
 * @example
 * ```typescript
 * import { CommonSchemas, createStringSchema } from 'reynard-validation';
 *
 * // Use pre-built schemas
 * const emailResult = ValidationUtils.validateValue('user@example.com', CommonSchemas.email);
 *
 * // Create custom schemas
 * const customSchema = createStringSchema({
 *   minLength: 3,
 *   maxLength: 50,
 *   pattern: /^[a-zA-Z0-9]+$/
 * });
 * ```
 */
export {
  CommonSchemas,
  FormSchemas,
  createCustomSchema,
  createEnumSchema,
  createNumberSchema,
  createStringSchema,
} from "./schemas.js";

// ============================================================================
// Utility Function Exports
// ============================================================================

/**
 * Comprehensive collection of validation utility functions for common use cases.
 *
 * These functions provide convenient, standalone validation for specific data types
 * and formats commonly used in web applications and APIs.
 *
 * @example
 * ```typescript
 * import { validateEmail, validatePassword, validateUrl } from 'reynard-validation';
 *
 * // Email validation
 * const emailResult = validateEmail('user@example.com');
 *
 * // Password validation with strength checking
 * const passwordResult = validatePassword('SecurePass123!');
 *
 * // URL validation with security checks
 * const urlResult = validateUrl('https://example.com');
 * ```
 *
 * @remarks
 * All utility functions return ValidationResult objects with isValid boolean
 * and detailed error information for easy integration with form validation.
 */
export {
  // API validators
  validateApiKey,
  validateColor,
  // Basic validators
  validateEmail,
  // File validators
  validateFileName,
  validateFileSize,
  validateLanguage,
  validateMaxTokens,
  validateMimeType,
  // AI/ML validators
  validateModelName,
  // Utility validators
  validateNotEmpty,
  validatePassword,
  // Advanced validators
  validatePasswordStrength,
  // Configuration validators
  validatePort,
  validatePositive,
  validatePrompt,
  validateRange,
  validateRetryCount,
  validateTemperature,
  // UI/UX validators
  validateTheme,
  validateTimeout,
  validateToken,
  validateUrl,
  validateUrlSecurity,
  validateUsername,
  validateValue,
} from "./utils.js";

// ============================================================================
// JSON Remediation Exports
// ============================================================================

/**
 * JSON remediation utilities for fixing malformed JSON files.
 *
 * Provides automatic detection and correction of common JSON syntax errors
 * including missing commas, trailing commas, and malformed package.json files.
 *
 * @example
 * ```typescript
 * import { JsonRemediator, fixJsonSyntax } from 'reynard-validation';
 *
 * // Fix JSON syntax errors
 * const result = fixJsonSyntax('{"name": "test" "version": "1.0.0"}');
 *
 * // Use the remediator class for advanced operations
 * const remediator = new JsonRemediator();
 * const fixed = remediator.fixJson('malformed.json');
 * ```
 */
export { JsonRemediator, fixJsonSyntax, fixPackageJson } from "./json-remediator.js";

/**
 * Enhanced JSON remediation with advanced error detection and correction.
 *
 * Provides more sophisticated JSON fixing capabilities with better error
 * detection and context-aware corrections.
 *
 * @example
 * ```typescript
 * import { JsonRemediatorFinal } from 'reynard-validation';
 *
 * const remediator = new JsonRemediatorFinal();
 * const result = remediator.remediateFile('package.json');
 * ```
 */
export { JsonRemediatorFinal } from "./json-remediator-final.js";

/**
 * TypeScript types for JSON remediation operations.
 *
 * @example
 * ```typescript
 * import type { JsonSyntaxError, JsonRemediationResult } from 'reynard-validation';
 *
 * const error: JsonSyntaxError = {
 *   type: 'missing-comma',
 *   line: 5,
 *   column: 10,
 *   message: 'Expected comma after property'
 * };
 * ```
 */
export type { JsonSyntaxError, JsonRemediationResult } from "./json-remediator.js";

// ============================================================================
// Security Validators Exports
// ============================================================================

/**
 * Security validation utilities for detecting malicious patterns and attack vectors.
 *
 * Provides detection for the Contagious Interview campaign's use of base64-encoded
 * JSON storage service URLs for malware delivery.
 *
 * @example
 * ```typescript
 * import { SecurityValidators } from 'reynard-validation';
 *
 * const errors: string[] = [];
 * SecurityValidators.detectBase64JsonStorageUrl(
 *   'aHR0cHM6Ly9qc29ua2VlcGVyLmNvbS9iL0dOT1g0',
 *   'configUrl',
 *   errors,
 *   schema
 * );
 * ```
 */
export {
  SecurityValidators,
  KNOWN_MALICIOUS_URLS,
  MALICIOUS_JSON_STORAGE_DOMAINS,
} from "./validators/security-validators.js";

// ============================================================================
// Re-exports for backward compatibility
// ============================================================================

/**
 * Backward compatibility exports for legacy code.
 *
 * These exports maintain compatibility with existing code that might import
 * from the old validation locations. They are aliases to the main validation
 * functions with "Core" suffix for disambiguation.
 *
 * @deprecated Use the main validation functions directly instead of these aliases.
 *
 * @example
 * ```typescript
 * // Legacy usage (deprecated)
 * import { validateEmailCore } from 'reynard-validation';
 *
 * // Recommended usage
 * import { validateEmail } from 'reynard-validation';
 * ```
 */
export {
  validateEmail as validateEmailCore,
  validatePassword as validatePasswordCore,
  validateUrl as validateUrlCore,
  validateUsername as validateUsernameCore,
} from "./utils.js";
