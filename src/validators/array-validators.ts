/**
 * Array validation utilities for validating array-specific constraints.
 *
 * This module provides a collection of static methods for validating arrays
 * according to various constraints including length, uniqueness, and item validation.
 * These validators are used internally by the core validation engine.
 *
 * @example
 * ```typescript
 * import { ArrayValidators } from './array-validators.js';
 *
 * const errors: string[] = [];
 * const schema = { type: 'array', minLength: 2, unique: true };
 * ArrayValidators.validateMinLength([1, 2, 3], 'items', errors, schema);
 * ```
 *
 * @since 1.0.0
 * @author Reynard Validation Package
 */

import type { ValidationSchema } from "../types.js";

/**
 * Collection of static methods for validating array-specific constraints.
 *
 * This class provides specialized array validation methods that are used internally
 * by the core validation engine. Each method validates a specific array constraint
 * and adds appropriate error messages to the provided errors array.
 *
 * @since 1.0.0
 */
export class ArrayValidators {
  /**
   * Validates that an array meets the minimum length requirement.
   *
   * This method checks if an array has at least the specified minimum number of items.
   * If the value is not an array, the validation is skipped (no error is added).
   *
   * @param value - The value to validate (must be an array)
   * @param fieldName - Name of the field for error messages
   * @param errors - Array to collect validation errors
   * @param schema - Validation schema containing minLength constraint
   *
   * @example
   * ```typescript
   * const errors: string[] = [];
   * const schema = { type: 'array', minLength: 3 };
   * ArrayValidators.validateMinLength([1, 2], 'items', errors, schema);
   * // errors will contain: ['items must have at least 3 items']
   * ```
   *
   * @since 1.0.0
   */
  static validateMinLength(value: unknown, fieldName: string, errors: string[], schema: ValidationSchema): void {
    if (!Array.isArray(value)) return;

    if (schema.minLength !== undefined && value.length < schema.minLength) {
      errors.push(schema.errorMessage || `${fieldName} must have at least ${schema.minLength} items`);
    }
  }

  /**
   * Validates that an array does not exceed the maximum length requirement.
   *
   * This method checks if an array has at most the specified maximum number of items.
   * If the value is not an array, the validation is skipped (no error is added).
   *
   * @param value - The value to validate (must be an array)
   * @param fieldName - Name of the field for error messages
   * @param errors - Array to collect validation errors
   * @param schema - Validation schema containing maxLength constraint
   *
   * @example
   * ```typescript
   * const errors: string[] = [];
   * const schema = { type: 'array', maxLength: 2 };
   * ArrayValidators.validateMaxLength([1, 2, 3], 'items', errors, schema);
   * // errors will contain: ['items must have at most 2 items']
   * ```
   *
   * @since 1.0.0
   */
  static validateMaxLength(value: unknown, fieldName: string, errors: string[], schema: ValidationSchema): void {
    if (!Array.isArray(value)) return;

    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
      errors.push(schema.errorMessage || `${fieldName} must have at most ${schema.maxLength} items`);
    }
  }

  /**
   * Validates that all items in an array are unique (no duplicates).
   *
   * This method checks if an array contains only unique values by comparing
   * the array length with the size of a Set created from the array. If the
   * value is not an array, the validation is skipped (no error is added).
   *
   * @param value - The value to validate (must be an array)
   * @param fieldName - Name of the field for error messages
   * @param errors - Array to collect validation errors
   * @param schema - Validation schema with unique: true constraint
   *
   * @example
   * ```typescript
   * const errors: string[] = [];
   * const schema = { type: 'array', unique: true };
   * ArrayValidators.validateUnique([1, 2, 2, 3], 'items', errors, schema);
   * // errors will contain: ['items must contain unique values']
   * ```
   *
   * @since 1.0.0
   */
  static validateUnique(value: unknown, fieldName: string, errors: string[], schema: ValidationSchema): void {
    if (!Array.isArray(value)) return;

    if (schema.unique) {
      const uniqueValues = new Set(value);
      if (uniqueValues.size !== value.length) {
        errors.push(schema.errorMessage || `${fieldName} must contain unique values`);
      }
    }
  }

  /**
   * Validates that all items in an array match a specified pattern.
   *
   * This method validates each item in the array against a regular expression
   * pattern. If any item doesn't match the pattern, an error is added for that
   * specific item. If the value is not an array, the validation is skipped.
   *
   * @param value - The value to validate (must be an array)
   * @param fieldName - Name of the field for error messages
   * @param errors - Array to collect validation errors
   * @param schema - Validation schema containing items pattern constraint
   *
   * @example
   * ```typescript
   * const errors: string[] = [];
   * const schema = { type: 'array', items: /^[a-z]+$/ };
   * ArrayValidators.validateItems(['abc', 'def', '123'], 'items', errors, schema);
   * // errors will contain: ['items[2] is invalid']
   * ```
   *
   * @since 1.0.0
   */
  static validateItems(value: unknown, fieldName: string, errors: string[], schema: ValidationSchema): void {
    if (!Array.isArray(value)) return;

    if (schema.items) {
      value.forEach((item, index) => {
        if (!schema.items!.test(item)) {
          errors.push(schema.errorMessage || `${fieldName}[${index}] is invalid`);
        }
      });
    }
  }
}
