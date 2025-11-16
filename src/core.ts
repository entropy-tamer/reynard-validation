/**
 * Core validation utilities and engine for the Reynard validation system.
 *
 * This module provides the central ValidationUtils class that serves as the
 * main validation engine. It handles schema-based validation, type checking,
 * and provides comprehensive validation capabilities for various data types.
 *
 * @example
 * ```typescript
 * import { ValidationUtils } from './core.js';
 *
 * // Basic validation
 * const result = ValidationUtils.validateValue('user@example.com', {
 *   type: 'email',
 *   required: true
 * });
 *
 * // Multi-field validation
 * const multiResult = ValidationUtils.validateFields({
 *   email: 'user@example.com',
 *   password: 'SecurePass123!'
 * }, {
 *   email: { type: 'email', required: true },
 *   password: { type: 'password', required: true, minLength: 8 }
 * });
 * ```
 *
 * @since 1.0.0
 * @author Swift-Quantum-7
 *
 * @remarks
 * Performance characteristics:
 * - Time complexity: O(1) for basic type checks, O(n) for complex validations
 * - Memory usage: O(1) constant space for most operations
 * - Validation speed: Optimized for high-frequency validation scenarios
 */

import {
  ValidationError,
  type FieldValidationOptions,
  type MultiValidationResult,
  type ValidationResult,
  type ValidationSchema,
  type ValidationErrorContext,
} from "./types.js";
import { StringValidators } from "./validators/string-validators.js";
import { NumberValidators } from "./validators/number-validators.js";
import { ArrayValidators } from "./validators/array-validators.js";
import { SecurityValidators } from "./validators/security-validators.js";

// ============================================================================
// Core Validation Engine
// ============================================================================

/**
 * Core validation engine providing comprehensive validation capabilities.
 *
 * The ValidationUtils class serves as the central validation engine for the
 * Reynard validation system. It provides static methods for validating individual
 * values, multiple fields, and throwing validation errors when needed.
 *
 * @example
 * ```typescript
 * import { ValidationUtils } from './core.js';
 *
 * // Validate a single value
 * const result = ValidationUtils.validateValue('user@example.com', {
 *   type: 'email',
 *   required: true
 * });
 *
 * // Validate multiple fields
 * const multiResult = ValidationUtils.validateFields(data, schemas);
 *
 * // Validate and throw on error
 * ValidationUtils.validateOrThrow(value, schema);
 * ```
 *
 * @since 1.0.0
 * @author Swift-Quantum-7
 */
export class ValidationUtils {
  /**
   * Validates a single value against a validation schema.
   *
   * This method performs comprehensive validation including type checking,
   * format validation, length constraints, and custom validation rules.
   * It returns a detailed ValidationResult with success status and error information.
   *
   * @param value - The value to validate
   * @param schema - The validation schema defining the rules
   * @param options - Additional validation options
   * @returns ValidationResult containing validation status and error details
   *
   * @example
   * ```typescript
   * const result = ValidationUtils.validateValue('user@example.com', {
   *   type: 'email',
   *   required: true,
   *   minLength: 5
   * });
   *
   * if (result.isValid) {
   *   console.log('Validation passed');
   * } else {
   *   console.log('Validation failed:', result.errors);
   * }
   * ```
   *
   * @since 1.0.0
   *
   * @remarks
   * Performance characteristics:
   * - Time complexity: O(1) for basic validations, O(n) for complex schemas
   * - Memory usage: O(1) constant space
   * - Supports custom validators and complex validation rules
   */
  static validateValue(
    value: unknown,
    schema: ValidationSchema,
    options: FieldValidationOptions = {}
  ): ValidationResult {
    const { fieldName = "field", context, strict: _strict = false } = options;
    const errors: string[] = [];

    // Check required
    if (schema.required && this.isEmpty(value)) {
      errors.push(schema.errorMessage || `${fieldName} is required`);
      return { isValid: false, errors };
    }

    // Skip validation if value is empty and not required
    if (this.isEmpty(value) && !schema.required) {
      return { isValid: true, errors: [] };
    }

    // Type validation
    this.validateType(value, fieldName, errors, schema);

    // String validations
    if (typeof value === "string") {
      this.validateString(value, fieldName, errors, schema);
      
      // Security validation for base64-encoded JSON storage URLs
      // This detects the Contagious Interview attack pattern
      if (schema.securityCheck !== false) {
        SecurityValidators.detectBase64JsonStorageUrl(value, fieldName, errors, schema);
      }
    }

    // Number validations
    if (typeof value === "number") {
      this.validateNumber(value, fieldName, errors, schema);
    }

    // Array validations
    if (Array.isArray(value)) {
      this.validateArray(value, fieldName, errors, schema);
    }

    // Custom validation
    if (schema.customValidator) {
      const customResult = schema.customValidator(value, context);
      if (!customResult.isValid) {
        errors.push(customResult.error || `${fieldName} is invalid`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      error: errors.length > 0 ? errors[0] : undefined,
    };
  }

  /**
   * Checks if a value is considered empty for validation purposes.
   *
   * @private
   * @param value - The value to check
   * @returns True if the value is null, undefined, or empty string
   *
   * @since 1.0.0
   */
  private static isEmpty(value: unknown): boolean {
    return value === null || value === undefined || value === "";
  }

  /**
   * Validates the type of a value against the schema type requirements.
   *
   * @private
   * @param value - The value to validate
   * @param fieldName - The name of the field being validated
   * @param errors - Array to collect validation errors
   * @param schema - The validation schema
   *
   * @since 1.0.0
   */
  private static validateType(value: unknown, fieldName: string, errors: string[], schema: ValidationSchema): void {
    if (!schema.type) return;

    // Handle custom types that are actually strings
    const customStringTypes = [
      "email",
      "url",
      "phone",
      "ip",
      "hex-color",
      "username",
      "password",
      "api-key",
      "token",
      "filename",
      "mime-type",
      "port",
      "timeout",
      "model-name",
      "prompt",
      "temperature",
      "max-tokens",
      "theme",
      "language",
      "color",
    ];

    if (customStringTypes.includes(schema.type)) {
      if (typeof value !== "string") {
        errors.push(schema.errorMessage || `${fieldName} must be a string`);
      }
    } else if (typeof value !== schema.type) {
      errors.push(schema.errorMessage || `${fieldName} must be of type ${schema.type}`);
    }
  }

  /**
   * Validates string-specific constraints and formats.
   *
   * @private
   * @param value - The string value to validate
   * @param fieldName - The name of the field being validated
   * @param errors - Array to collect validation errors
   * @param schema - The validation schema
   *
   * @since 1.0.0
   */
  private static validateString(value: string, fieldName: string, errors: string[], schema: ValidationSchema): void {
    // Length validations
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      errors.push(schema.errorMessage || `${fieldName} must be at least ${schema.minLength} characters`);
    }

    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
      errors.push(schema.errorMessage || `${fieldName} must be at most ${schema.maxLength} characters`);
    }

    // Pattern validation
    if (schema.pattern && !schema.pattern.test(value)) {
      errors.push(schema.errorMessage || `${fieldName} format is invalid`);
    }

    // Enum validation
    if (schema.enum && !schema.enum.includes(value)) {
      errors.push(schema.errorMessage || `${fieldName} must be one of: ${schema.enum.join(", ")}`);
    }

    // Specific string type validations based on schema.type
    if (schema.type) {
      switch (schema.type) {
        case "email":
          StringValidators.validateEmail(value, fieldName, errors, schema);
          break;
        case "url":
          StringValidators.validateUrl(value, fieldName, errors, schema);
          break;
        case "phone":
          StringValidators.validatePhone(value, fieldName, errors, schema);
          break;
        case "filename":
          StringValidators.validateFilename(value, fieldName, errors, schema);
          break;
        case "mime-type":
          StringValidators.validateMimeType(value, fieldName, errors, schema);
          break;
        case "color":
          StringValidators.validateColor(value, fieldName, errors, schema);
          break;
        case "username":
          this.validateUsername(value, fieldName, errors, schema);
          break;
        case "password":
          this.validatePassword(value, fieldName, errors, schema);
          break;
        case "api-key":
          this.validateApiKey(value, fieldName, errors, schema);
          break;
        case "token":
          this.validateToken(value, fieldName, errors, schema);
          break;
      }
    }

    // Format validation (legacy support)
    if (schema.format) {
      switch (schema.format) {
        case "email":
          StringValidators.validateEmail(value, fieldName, errors, schema);
          break;
        case "url":
          StringValidators.validateUrl(value, fieldName, errors, schema);
          break;
        case "phone":
          StringValidators.validatePhone(value, fieldName, errors, schema);
          break;
        case "filename":
          StringValidators.validateFilename(value, fieldName, errors, schema);
          break;
        case "mimeType":
          StringValidators.validateMimeType(value, fieldName, errors, schema);
          break;
        case "color":
          StringValidators.validateColor(value, fieldName, errors, schema);
          break;
      }
    }
  }

  /**
   * Validates number-specific constraints and ranges.
   *
   * @private
   * @param value - The number value to validate
   * @param fieldName - The name of the field being validated
   * @param errors - Array to collect validation errors
   * @param schema - The validation schema
   *
   * @since 1.0.0
   */
  private static validateNumber(value: number, fieldName: string, errors: string[], schema: ValidationSchema): void {
    NumberValidators.validateMin(value, fieldName, errors, schema);
    NumberValidators.validateMax(value, fieldName, errors, schema);
    NumberValidators.validateInteger(value, fieldName, errors, schema);
    NumberValidators.validatePositive(value, fieldName, errors, schema);
    NumberValidators.validateNegative(value, fieldName, errors, schema);
  }

  /**
   * Validates array-specific constraints and item validation.
   *
   * @private
   * @param value - The array value to validate
   * @param fieldName - The name of the field being validated
   * @param errors - Array to collect validation errors
   * @param schema - The validation schema
   *
   * @since 1.0.0
   */
  private static validateArray(value: unknown[], fieldName: string, errors: string[], schema: ValidationSchema): void {
    ArrayValidators.validateMinLength(value, fieldName, errors, schema);
    ArrayValidators.validateMaxLength(value, fieldName, errors, schema);
    ArrayValidators.validateUnique(value, fieldName, errors, schema);
    ArrayValidators.validateItems(value, fieldName, errors, schema);
  }

  /**
   * Validates username format and constraints.
   *
   * @private
   * @param value - The username value to validate
   * @param fieldName - The name of the field being validated
   * @param errors - Array to collect validation errors
   * @param schema - The validation schema
   *
   * @since 1.0.0
   */
  private static validateUsername(value: string, fieldName: string, errors: string[], schema: ValidationSchema): void {
    // Username should only contain letters, numbers, hyphens, and underscores
    const usernamePattern = /^[a-zA-Z0-9_-]+$/;
    if (!usernamePattern.test(value)) {
      errors.push(schema.errorMessage || `${fieldName} can only contain letters, numbers, hyphens, and underscores`);
    }
  }

  /**
   * Validates password strength and security requirements.
   *
   * @private
   * @param value - The password value to validate
   * @param fieldName - The name of the field being validated
   * @param errors - Array to collect validation errors
   * @param schema - The validation schema
   *
   * @since 1.0.0
   */
  private static validatePassword(value: string, fieldName: string, errors: string[], schema: ValidationSchema): void {
    // Password should contain at least one uppercase, lowercase, number, and special character
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value);

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      errors.push(
        schema.errorMessage || `${fieldName} must contain uppercase, lowercase, number, and special character`
      );
    }
  }

  /**
   * Validates API key format and constraints.
   *
   * @private
   * @param value - The API key value to validate
   * @param fieldName - The name of the field being validated
   * @param errors - Array to collect validation errors
   * @param schema - The validation schema
   *
   * @since 1.0.0
   */
  private static validateApiKey(value: string, fieldName: string, errors: string[], schema: ValidationSchema): void {
    // API key should only contain letters, numbers, underscores, and hyphens
    const apiKeyPattern = /^[a-zA-Z0-9_-]+$/;
    if (!apiKeyPattern.test(value)) {
      errors.push(schema.errorMessage || `${fieldName} can only contain letters, numbers, underscores, and hyphens`);
    }
  }

  /**
   * Validates token format and minimum length requirements.
   *
   * @private
   * @param value - The token value to validate
   * @param fieldName - The name of the field being validated
   * @param errors - Array to collect validation errors
   * @param schema - The validation schema
   *
   * @since 1.0.0
   */
  private static validateToken(value: string, fieldName: string, errors: string[], schema: ValidationSchema): void {
    // Token should be a valid string (basic validation)
    if (value.length < 20) {
      errors.push(schema.errorMessage || `${fieldName} must be at least 20 characters`);
    }
  }

  /**
   * Validates multiple fields against their respective schemas.
   *
   * This method performs batch validation of multiple fields, returning
   * comprehensive results for each field and overall validation status.
   * It's particularly useful for form validation and API request validation.
   *
   * @param data - Object containing the field values to validate
   * @param schemas - Object mapping field names to their validation schemas
   * @param options - Validation options including strict mode
   * @returns MultiValidationResult containing results for all fields
   *
   * @example
   * ```typescript
   * const data = {
   *   email: 'user@example.com',
   *   password: 'SecurePass123!',
   *   age: 25
   * };
   *
   * const schemas = {
   *   email: { type: 'email', required: true },
   *   password: { type: 'password', required: true, minLength: 8 },
   *   age: { type: 'number', required: true, min: 18, max: 120 }
   * };
   *
   * const result = ValidationUtils.validateFields(data, schemas);
   *
   * if (result.isValid) {
   *   console.log('All fields are valid');
   * } else {
   *   console.log('Validation errors:', result.errors);
   * }
   * ```
   *
   * @since 1.0.0
   *
   * @remarks
   * Performance characteristics:
   * - Time complexity: O(n) where n is the number of fields
   * - Memory usage: O(n) for storing results
   * - Supports strict mode for unknown fields
   */
  static validateFields(
    data: Record<string, unknown>,
    schemas: Record<string, ValidationSchema>,
    options: { strict?: boolean } = {}
  ): MultiValidationResult {
    const results: Record<string, ValidationResult> = {};
    const allErrors: string[] = [];

    for (const [fieldName, value] of Object.entries(data)) {
      const schema = schemas[fieldName];
      if (!schema) {
        if (options.strict) {
          allErrors.push(`Unknown field: ${fieldName}`);
        }
        continue;
      }

      const result = this.validateValue(value, schema, { fieldName });
      results[fieldName] = result;
      if (result.errors) {
        allErrors.push(...result.errors);
      }
    }

    return {
      isValid: allErrors.length === 0,
      results,
      errors: allErrors,
    };
  }

  /**
   * Validates a value and throws a ValidationError if validation fails.
   *
   * This method provides a convenient way to validate values and immediately
   * throw an error if validation fails. It's useful for scenarios where
   * validation failure should immediately halt execution.
   *
   * @param value - The value to validate
   * @param schema - The validation schema defining the rules
   * @param options - Additional validation options
   * @throws {ValidationError} Throws when validation fails
   *
   * @example
   * ```typescript
   * try {
   *   ValidationUtils.validateOrThrow('user@example.com', {
   *     type: 'email',
   *     required: true
   *   });
   *   console.log('Validation passed');
   * } catch (error) {
   *   if (error instanceof ValidationError) {
   *     console.log('Validation failed:', error.message);
   *     console.log('Field:', error.field);
   *   }
   * }
   * ```
   *
   * @since 1.0.0
   *
   * @remarks
   * Performance characteristics:
   * - Time complexity: O(1) for basic validations, O(n) for complex schemas
   * - Memory usage: O(1) constant space
   * - Throws immediately on first validation failure
   */
  static validateOrThrow(value: unknown, schema: ValidationSchema, options: FieldValidationOptions = {}): void {
    const result = this.validateValue(value, schema, options);
    if (!result.isValid) {
      const errorMessage = result.errors?.join(", ") || "Validation failed";
      const context: ValidationErrorContext = {
        field: options.fieldName || "field",
        value,
        constraint: "validation",
        timestamp: new Date().toISOString(),
        source: "ValidationUtils.validateOrThrow",
      };
      throw new ValidationError(errorMessage, context);
    }
  }

  /**
   * Validates config file content for security threats.
   *
   * This method scans config file content for malicious patterns, including
   * base64-encoded JSON storage URLs from the Contagious Interview campaign.
   *
   * @param content - Config file content to validate
   * @param options - Validation options including strict mode
   * @returns ValidationResult containing security threat detection results
   *
   * @example
   * ```typescript
   * const configContent = 'CONFIG_URL=aHR0cHM6Ly9qc29ua2VlcGVyLmNvbS9iL0dOT1g0\n';
   * const result = ValidationUtils.validateConfigFileSecurity(configContent, { strict: true });
   * if (!result.isValid) {
   *   console.log('Security threats detected:', result.errors);
   * }
   * ```
   *
   * @since 1.0.0
   */
  static validateConfigFileSecurity(
    content: string,
    options: { strict?: boolean } = {}
  ): ValidationResult {
    const errors: string[] = [];
    SecurityValidators.validateConfigFileSecurity(content, errors, options);

    return {
      isValid: errors.length === 0,
      errors,
      error: errors.length > 0 ? errors[0] : undefined,
    };
  }
}
