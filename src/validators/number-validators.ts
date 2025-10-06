/**
 * Number validation utilities
 */

import type { ValidationSchema } from "../types.js";

export class NumberValidators {
  static validateMin(value: unknown, fieldName: string, errors: string[], schema: ValidationSchema): void {
    if (typeof value !== "number") return;

    if (schema.min !== undefined && value < schema.min) {
      errors.push(schema.errorMessage || `${fieldName} must be at least ${schema.min}`);
    }
  }

  static validateMax(value: unknown, fieldName: string, errors: string[], schema: ValidationSchema): void {
    if (typeof value !== "number") return;

    if (schema.max !== undefined && value > schema.max) {
      errors.push(schema.errorMessage || `${fieldName} must be at most ${schema.max}`);
    }
  }

  static validateInteger(value: unknown, fieldName: string, errors: string[], schema: ValidationSchema): void {
    if (typeof value !== "number") return;

    if (schema.integer && !Number.isInteger(value)) {
      errors.push(schema.errorMessage || `${fieldName} must be an integer`);
    }
  }

  static validatePositive(value: unknown, fieldName: string, errors: string[], schema: ValidationSchema): void {
    if (typeof value !== "number") return;

    if (schema.positive && value <= 0) {
      errors.push(schema.errorMessage || `${fieldName} must be positive`);
    }
  }

  static validateNegative(value: unknown, fieldName: string, errors: string[], schema: ValidationSchema): void {
    if (typeof value !== "number") return;

    if (schema.negative && value >= 0) {
      errors.push(schema.errorMessage || `${fieldName} must be negative`);
    }
  }
}
