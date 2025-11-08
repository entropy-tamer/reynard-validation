/**
 * Number validation utilities for validating numeric constraints.
 *
 * This module provides a collection of static methods for validating numbers
 * according to various constraints including range, integer requirements, and
 * sign validation. These validators are used internally by the core validation engine.
 *
 * @example
 * ```typescript
 * import { NumberValidators } from './number-validators.js';
 *
 * const errors: string[] = [];
 * const schema = { type: 'number', min: 0, max: 100, integer: true };
 * NumberValidators.validateMin(42, 'age', errors, schema);
 * ```
 *
 * @since 1.0.0
 * @author Reynard Validation Package
 */

import type { ValidationSchema } from "../types.js";

/**
 * Collection of static methods for validating number-specific constraints.
 *
 * This class provides specialized number validation methods that are used internally
 * by the core validation engine. Each method validates a specific numeric constraint
 * and adds appropriate error messages to the provided errors array.
 *
 * @since 1.0.0
 */
export class NumberValidators {
  /**
   * Validates that a number meets the minimum value requirement.
   *
   * This method checks if a number is greater than or equal to the specified
   * minimum value. If the value is not a number, the validation is skipped.
   *
   * @param value - The value to validate (must be a number)
   * @param fieldName - Name of the field for error messages
   * @param errors - Array to collect validation errors
   * @param schema - Validation schema containing min constraint
   *
   * @example
   * ```typescript
   * const errors: string[] = [];
   * const schema = { type: 'number', min: 18 };
   * NumberValidators.validateMin(15, 'age', errors, schema);
   * // errors will contain: ['age must be at least 18']
   * ```
   *
   * @since 1.0.0
   */
  static validateMin(value: unknown, fieldName: string, errors: string[], schema: ValidationSchema): void {
    if (typeof value !== "number") return;

    if (schema.min !== undefined && value < schema.min) {
      errors.push(schema.errorMessage || `${fieldName} must be at least ${schema.min}`);
    }
  }

  /**
   * Validates that a number does not exceed the maximum value requirement.
   *
   * This method checks if a number is less than or equal to the specified
   * maximum value. If the value is not a number, the validation is skipped.
   *
   * @param value - The value to validate (must be a number)
   * @param fieldName - Name of the field for error messages
   * @param errors - Array to collect validation errors
   * @param schema - Validation schema containing max constraint
   *
   * @example
   * ```typescript
   * const errors: string[] = [];
   * const schema = { type: 'number', max: 100 };
   * NumberValidators.validateMax(150, 'score', errors, schema);
   * // errors will contain: ['score must be at most 100']
   * ```
   *
   * @since 1.0.0
   */
  static validateMax(value: unknown, fieldName: string, errors: string[], schema: ValidationSchema): void {
    if (typeof value !== "number") return;

    if (schema.max !== undefined && value > schema.max) {
      errors.push(schema.errorMessage || `${fieldName} must be at most ${schema.max}`);
    }
  }

  /**
   * Validates that a number is an integer (whole number).
   *
   * This method checks if a number is an integer using Number.isInteger().
   * If the value is not a number, the validation is skipped.
   *
   * @param value - The value to validate (must be a number)
   * @param fieldName - Name of the field for error messages
   * @param errors - Array to collect validation errors
   * @param schema - Validation schema with integer: true constraint
   *
   * @example
   * ```typescript
   * const errors: string[] = [];
   * const schema = { type: 'number', integer: true };
   * NumberValidators.validateInteger(3.14, 'count', errors, schema);
   * // errors will contain: ['count must be an integer']
   * ```
   *
   * @since 1.0.0
   */
  static validateInteger(value: unknown, fieldName: string, errors: string[], schema: ValidationSchema): void {
    if (typeof value !== "number") return;

    if (schema.integer && !Number.isInteger(value)) {
      errors.push(schema.errorMessage || `${fieldName} must be an integer`);
    }
  }

  /**
   * Validates that a number is positive (greater than zero).
   *
   * This method checks if a number is greater than zero. Zero and negative
   * numbers will fail validation. If the value is not a number, the validation is skipped.
   *
   * @param value - The value to validate (must be a number)
   * @param fieldName - Name of the field for error messages
   * @param errors - Array to collect validation errors
   * @param schema - Validation schema with positive: true constraint
   *
   * @example
   * ```typescript
   * const errors: string[] = [];
   * const schema = { type: 'number', positive: true };
   * NumberValidators.validatePositive(-5, 'quantity', errors, schema);
   * // errors will contain: ['quantity must be positive']
   * ```
   *
   * @since 1.0.0
   */
  static validatePositive(value: unknown, fieldName: string, errors: string[], schema: ValidationSchema): void {
    if (typeof value !== "number") return;

    if (schema.positive && value <= 0) {
      errors.push(schema.errorMessage || `${fieldName} must be positive`);
    }
  }

  /**
   * Validates that a number is negative (less than zero).
   *
   * This method checks if a number is less than zero. Zero and positive
   * numbers will fail validation. If the value is not a number, the validation is skipped.
   *
   * @param value - The value to validate (must be a number)
   * @param fieldName - Name of the field for error messages
   * @param errors - Array to collect validation errors
   * @param schema - Validation schema with negative: true constraint
   *
   * @example
   * ```typescript
   * const errors: string[] = [];
   * const schema = { type: 'number', negative: true };
   * NumberValidators.validateNegative(5, 'temperature', errors, schema);
   * // errors will contain: ['temperature must be negative']
   * ```
   *
   * @since 1.0.0
   */
  static validateNegative(value: unknown, fieldName: string, errors: string[], schema: ValidationSchema): void {
    if (typeof value !== "number") return;

    if (schema.negative && value >= 0) {
      errors.push(schema.errorMessage || `${fieldName} must be negative`);
    }
  }
}
