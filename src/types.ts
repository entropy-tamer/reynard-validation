/**
 * Core validation types and interfaces for the Reynard validation system.
 *
 * This module defines all the TypeScript types and interfaces used throughout
 * the validation system. It provides comprehensive type definitions for
 * validation results, schemas, error handling, and specialized validation
 * scenarios like password strength and file validation.
 *
 * @example
 * ```typescript
 * import type { ValidationSchema, ValidationResult, ValidationError } from './types.js';
 *
 * // Define a validation schema
 * const schema: ValidationSchema = {
 *   type: 'email',
 *   required: true,
 *   minLength: 5
 * };
 *
 * // Use validation result type
 * const result: ValidationResult = {
 *   isValid: true,
 *   errors: []
 * };
 * ```
 *
 * @since 1.0.0
 * @author Swift-Quantum-7
 *
 * @remarks
 * All types are designed to be:
 * - Type-safe with comprehensive TypeScript support
 * - Extensible for custom validation scenarios
 * - Compatible with modern JavaScript features
 * - Well-documented for easy integration
 */

// ============================================================================
// Core Types
// ============================================================================

/**
 * Result of a validation operation containing success status and error information.
 *
 * This type represents the outcome of any validation operation, providing
 * both a simple boolean success indicator and detailed error information
 * for debugging and user feedback.
 *
 * @example
 * ```typescript
 * const result: ValidationResult = {
 *   isValid: false,
 *   error: "Email format is invalid",
 *   field: "email",
 *   value: "invalid-email",
 *   errors: ["Email format is invalid", "Email must contain @ symbol"]
 * };
 * ```
 *
 * @since 1.0.0
 */
export type ValidationResult = {
  /** Whether the validation passed */
  isValid: boolean;
  /** Primary error message (first error if multiple) */
  error?: string;
  /** Name of the field that was validated */
  field?: string;
  /** The value that was validated */
  value?: unknown;
  /** Array of all validation error messages */
  errors?: string[];
};

/**
 * Result of validating multiple fields with individual and aggregate results.
 *
 * This type provides comprehensive results for batch validation operations,
 * including individual field results and aggregated error information.
 *
 * @example
 * ```typescript
 * const result: MultiValidationResult = {
 *   isValid: false,
 *   results: {
 *     email: { isValid: true, errors: [] },
 *     password: { isValid: false, errors: ["Password too short"] }
 *   },
 *   errors: ["Password too short"]
 * };
 * ```
 *
 * @since 1.0.0
 */
export type MultiValidationResult = {
  /** Whether all validations passed */
  isValid: boolean;
  /** Individual validation results for each field */
  results: Record<string, ValidationResult>;
  /** Aggregated list of all error messages */
  errors: string[];
};

/**
 * Comprehensive validation schema defining rules and constraints for data validation.
 *
 * This type provides a flexible and extensible way to define validation rules
 * for any data type. It supports both basic type validation and advanced
 * constraints like patterns, ranges, and custom validators.
 *
 * @example
 * ```typescript
 * const emailSchema: ValidationSchema = {
 *   type: 'email',
 *   required: true,
 *   minLength: 5,
 *   maxLength: 100,
 *   errorMessage: 'Please provide a valid email address'
 * };
 *
 * const numberSchema: ValidationSchema = {
 *   type: 'number',
 *   required: true,
 *   min: 0,
 *   max: 100,
 *   integer: true,
 *   positive: true
 * };
 *
 * const customSchema: ValidationSchema = {
 *   type: 'string',
 *   required: true,
 *   pattern: /^[A-Z][a-z]+$/,
 *   customValidator: (value, context) => {
 *     // Custom validation logic
 *     return { isValid: true, errors: [] };
 *   }
 * };
 * ```
 *
 * @since 1.0.0
 */
export type ValidationSchema = {
  /**
   * The expected data type or specialized format type.
   * Supports both basic types and specialized formats like email, url, etc.
   */
  type?:
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "array"
    | "email"
    | "url"
    | "date"
    | "phone"
    | "ip"
    | "hex-color"
    | "username"
    | "password"
    | "api-key"
    | "token"
    | "filename"
    | "mime-type"
    | "port"
    | "timeout"
    | "model-name"
    | "prompt"
    | "temperature"
    | "max-tokens"
    | "theme"
    | "language"
    | "color";
  /** Whether the field is required (cannot be null, undefined, or empty) */
  required?: boolean;
  /** Minimum length for strings and arrays */
  minLength?: number;
  /** Maximum length for strings and arrays */
  maxLength?: number;
  /** Minimum value for numbers */
  min?: number;
  /** Maximum value for numbers */
  max?: number;
  /** Regular expression pattern for string validation */
  pattern?: RegExp;
  /** Array of allowed values (enum validation) */
  enum?: unknown[];
  /** Custom error message to display when validation fails */
  errorMessage?: string;
  /** Custom validation function for complex validation logic */
  customValidator?: (value: unknown, context?: ValidationErrorContext) => ValidationResult;
  /** String format validation (legacy support) */
  format?: "email" | "url" | "phone" | "filename" | "mimeType" | "color";
  /** Whether number must be an integer */
  integer?: boolean;
  /** Whether number must be positive */
  positive?: boolean;
  /** Whether number must be negative */
  negative?: boolean;
  /** Whether array items must be unique */
  unique?: boolean;
  /** Regular expression for validating array items */
  items?: RegExp;
  /** Whether to perform security checks (defaults to true, set to false to disable) */
  securityCheck?: boolean;
};

/**
 * Options for configuring field validation behavior.
 *
 * This type provides configuration options that control how validation
 * is performed on individual fields, including error handling and
 * validation strictness.
 *
 * @example
 * ```typescript
 * const options: FieldValidationOptions = {
 *   fieldName: 'email',
 *   strict: true,
 *   allowEmpty: false,
 *   context: {
 *     field: 'email',
 *     value: 'user@example.com',
 *     constraint: 'format',
 *     timestamp: new Date().toISOString()
 *   }
 * };
 * ```
 *
 * @since 1.0.0
 */
export type FieldValidationOptions = {
  /** Name of the field being validated (used in error messages) */
  fieldName?: string;
  /** Additional context information for validation */
  context?: ValidationErrorContext;
  /** Whether to use strict validation mode */
  strict?: boolean;
  /** Whether to allow empty values */
  allowEmpty?: boolean;
};

/**
 * Context information for validation errors providing detailed debugging information.
 *
 * This type provides comprehensive context about validation failures,
 * including field information, constraint details, and timing information
 * for debugging and error reporting.
 *
 * @example
 * ```typescript
 * const context: ValidationErrorContext = {
 *   field: 'email',
 *   value: 'invalid-email',
 *   constraint: 'email-format',
 *   timestamp: '2025-01-01T12:00:00.000Z',
 *   source: 'ValidationUtils.validateValue'
 * };
 * ```
 *
 * @since 1.0.0
 */
export type ValidationErrorContext = {
  /** Name of the field that failed validation */
  field: string;
  /** The value that failed validation */
  value: unknown;
  /** The specific constraint that was violated */
  constraint: string;
  /** ISO timestamp when the validation occurred */
  timestamp?: string;
  /** Source function or method that performed the validation */
  source?: string;
};

// ============================================================================
// Password Validation Types
// ============================================================================

export type PasswordStrength = {
  isValid: boolean;
  score: number;
  feedback: "weak" | "medium" | "strong" | "very-strong";
  suggestions: string[];
  crackTime?: string;
};

export type ValidationRules = {
  minLength?: number;
  maxLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumber?: boolean;
  requireSpecialChar?: boolean;
  emailPattern?: RegExp;
};

// ============================================================================
// URL Validation Types
// ============================================================================

export type URLValidationResult = {
  isValid: boolean;
  sanitized?: string;
  protocol?: string;
  hostname?: string;
  port?: string;
  pathname?: string;
  search?: string;
  hash?: string;
};

// ============================================================================
// File Validation Types
// ============================================================================

export type FileValidationOptions = {
  maxSize?: number;
  allowedTypes?: string[];
  allowedExtensions?: string[];
  requireExtension?: boolean;
};

export type FileValidationResult = {
  isValid: boolean;
  errors: string[];
  fileInfo?: {
    name: string;
    size: number;
    type: string;
    extension: string;
  };
};

// ============================================================================
// Form Validation Types
// ============================================================================

export type FormValidationResult = {
  isValid: boolean;
  errors: Record<string, string[]>;
  warnings: Record<string, string[]>;
  validFields: string[];
  invalidFields: string[];
  warningFields: string[];
};

export type FormValidationOptions = {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  showWarnings?: boolean;
  stopOnFirstError?: boolean;
};

// ============================================================================
// Validation Error Class
// ============================================================================

/**
 * Custom error class for validation failures with detailed context information.
 *
 * This class extends the standard Error class to provide comprehensive
 * information about validation failures, including field context, constraint
 * details, and timing information for debugging and error handling.
 *
 * @example
 * ```typescript
 * try {
 *   ValidationUtils.validateOrThrow('invalid-email', emailSchema);
 * } catch (error) {
 *   if (error instanceof ValidationError) {
 *     console.log('Field:', error.field);
 *     console.log('Value:', error.value);
 *     console.log('Constraint:', error.constraint);
 *     console.log('Context:', error.context);
 *   }
 * }
 * ```
 *
 * @since 1.0.0
 */
export class ValidationError extends Error {
  /** Detailed context information about the validation failure */
  public readonly context: ValidationErrorContext;
  /** Name of the field that failed validation */
  public readonly field: string;
  /** The value that failed validation */
  public readonly value: unknown;
  /** The specific constraint that was violated */
  public readonly constraint: string;

  /**
   * Creates a new ValidationError instance.
   *
   * @param message - Error message describing the validation failure
   * @param context - Detailed context information about the failure
   *
   * @since 1.0.0
   */
  constructor(message: string, context: ValidationErrorContext) {
    super(message);
    this.name = "ValidationError";
    this.context = context;
    this.field = context.field;
    this.value = context.value;
    this.constraint = context.constraint;
  }
}
