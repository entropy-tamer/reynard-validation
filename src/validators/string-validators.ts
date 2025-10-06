/**
 * String validation utilities for specialized string format validation.
 *
 * This module provides a collection of static methods for validating
 * specific string formats and patterns. These validators are used internally
 * by the core validation engine and can also be used directly for
 * specialized string validation scenarios.
 *
 * All validators follow a consistent pattern:
 * - Check if the value is a string (return early if not)
 * - Apply format-specific validation logic
 * - Add error messages to the provided errors array
 *
 * @example
 * ```typescript
 * import { StringValidators } from './string-validators.js';
 *
 * const errors: string[] = [];
 * StringValidators.validateEmail('user@example.com', 'email', errors, schema);
 *
 * if (errors.length > 0) {
 *   console.log('Validation errors:', errors);
 * }
 * ```
 *
 * @since 1.0.0
 * @author Swift-Quantum-7
 *
 * @remarks
 * Performance characteristics:
 * - Time complexity: O(1) for most validators, O(n) for complex patterns
 * - Memory usage: O(1) constant space
 * - Optimized for high-frequency validation scenarios
 */

import type { ValidationSchema } from "../types.js";

/**
 * Collection of static methods for validating specific string formats and patterns.
 *
 * This class provides specialized string validation methods that are used internally
 * by the core validation engine. Each method validates a specific string format
 * and adds appropriate error messages to the provided errors array.
 *
 * @since 1.0.0
 */
export class StringValidators {
  /**
   * Validates an email address format using a comprehensive regex pattern.
   *
   * This method checks if the provided string matches a valid email format
   * including proper structure with @ symbol and domain extension.
   *
   * @param value - The value to validate (must be a string)
   * @param fieldName - Name of the field for error messages
   * @param errors - Array to collect validation errors
   * @param schema - Validation schema (unused in this validator)
   *
   * @example
   * ```typescript
   * const errors: string[] = [];
   * StringValidators.validateEmail('user@example.com', 'email', errors, schema);
   * // errors will be empty if valid
   *
   * StringValidators.validateEmail('invalid-email', 'email', errors, schema);
   * // errors will contain: ['email must be a valid email address']
   * ```
   *
   * @since 1.0.0
   */
  static validateEmail(value: unknown, fieldName: string, errors: string[], schema: ValidationSchema): void {
    if (typeof value !== "string") return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      errors.push(`${fieldName} must be a valid email address`);
    }
  }

  /**
   * Validates a URL format and protocol using the native URL constructor.
   *
   * This method validates that the string is a properly formatted URL and
   * restricts protocols to HTTP and HTTPS only for security reasons.
   *
   * @param value - The value to validate (must be a string)
   * @param fieldName - Name of the field for error messages
   * @param errors - Array to collect validation errors
   * @param schema - Validation schema (unused in this validator)
   *
   * @example
   * ```typescript
   * const errors: string[] = [];
   * StringValidators.validateUrl('https://example.com', 'url', errors, schema);
   * // errors will be empty if valid
   *
   * StringValidators.validateUrl('ftp://example.com', 'url', errors, schema);
   * // errors will contain: ['url must be a valid HTTP or HTTPS URL']
   * ```
   *
   * @since 1.0.0
   */
  static validateUrl(value: unknown, fieldName: string, errors: string[], schema: ValidationSchema): void {
    if (typeof value !== "string") return;

    try {
      const url = new URL(value);
      // Only allow http and https protocols
      if (!["http:", "https:"].includes(url.protocol)) {
        errors.push(`${fieldName} must be a valid HTTP or HTTPS URL`);
      }
    } catch {
      errors.push(`${fieldName} must be a valid URL`);
    }
  }

  static validatePhone(value: unknown, fieldName: string, errors: string[], schema: ValidationSchema): void {
    if (typeof value !== "string") return;

    const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
    if (!phoneRegex.test(value)) {
      errors.push(`${fieldName} must be a valid phone number`);
    }
  }

  /**
   * Validates a filename format ensuring it doesn't contain invalid characters.
   *
   * This method checks that the filename doesn't contain characters that are
   * invalid for file systems, including control characters and special symbols.
   *
   * @param value - The value to validate (must be a string)
   * @param fieldName - Name of the field for error messages
   * @param errors - Array to collect validation errors
   * @param schema - Validation schema (unused in this validator)
   *
   * @since 1.0.0
   */
  static validateFilename(value: unknown, fieldName: string, errors: string[], schema: ValidationSchema): void {
    if (typeof value !== "string") return;

    const filenameRegex = /^[^<>:"/\\|?*\x00-\x1f]+$/;
    if (!filenameRegex.test(value)) {
      errors.push(`${fieldName} cannot contain invalid characters`);
    }
  }

  static validateMimeType(value: unknown, fieldName: string, errors: string[], schema: ValidationSchema): void {
    if (typeof value !== "string") return;

    const mimeTypeRegex = /^[a-zA-Z0-9][a-zA-Z0-9!#$&\-^_]*\/[a-zA-Z0-9][a-zA-Z0-9!#$&\-^_]*$/;
    if (!mimeTypeRegex.test(value)) {
      errors.push(`${fieldName} must be a valid MIME type`);
    }
  }

  static validateColor(value: unknown, fieldName: string, errors: string[], schema: ValidationSchema): void {
    if (typeof value !== "string") return;

    const colorRegex =
      /^#[0-9A-Fa-f]{6}$|^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$|^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/;
    if (!colorRegex.test(value)) {
      errors.push(`${fieldName} must be a valid color`);
    }
  }
}
