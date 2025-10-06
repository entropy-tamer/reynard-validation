/**
 * Array validation utilities
 */

import type { ValidationSchema } from "../types.js";

export class ArrayValidators {
  static validateMinLength(value: unknown, fieldName: string, errors: string[], schema: ValidationSchema): void {
    if (!Array.isArray(value)) return;

    if (schema.minLength !== undefined && value.length < schema.minLength) {
      errors.push(schema.errorMessage || `${fieldName} must have at least ${schema.minLength} items`);
    }
  }

  static validateMaxLength(value: unknown, fieldName: string, errors: string[], schema: ValidationSchema): void {
    if (!Array.isArray(value)) return;

    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
      errors.push(schema.errorMessage || `${fieldName} must have at most ${schema.maxLength} items`);
    }
  }

  static validateUnique(value: unknown, fieldName: string, errors: string[], schema: ValidationSchema): void {
    if (!Array.isArray(value)) return;

    if (schema.unique) {
      const uniqueValues = new Set(value);
      if (uniqueValues.size !== value.length) {
        errors.push(schema.errorMessage || `${fieldName} must contain unique values`);
      }
    }
  }

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
