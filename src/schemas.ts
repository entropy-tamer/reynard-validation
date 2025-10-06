/**
 * Common validation schemas and schema builders for the Reynard framework.
 *
 * This module provides a comprehensive collection of pre-built validation schemas
 * for common data types and use cases, along with utility functions for creating
 * custom validation schemas. It serves as the foundation for consistent validation
 * across the entire Reynard ecosystem.
 *
 * The schemas are organized into categories:
 * - **CommonSchemas**: Individual field validation schemas
 * - **FormSchemas**: Complete form validation schemas
 * - **Schema Builders**: Utility functions for creating custom schemas
 *
 * @example
 * ```typescript
 * import { CommonSchemas, FormSchemas, createStringSchema } from './schemas.js';
 *
 * // Use pre-built schemas
 * const emailResult = ValidationUtils.validateValue('user@example.com', CommonSchemas.email);
 *
 * // Use form schemas
 * const loginResult = ValidationUtils.validateFields(loginData, FormSchemas.login);
 *
 * // Create custom schemas
 * const customSchema = createStringSchema({
 *   minLength: 5,
 *   maxLength: 50,
 *   pattern: /^[A-Z][a-z]+$/
 * });
 * ```
 *
 * @since 1.0.0
 * @author Swift-Quantum-7
 *
 * @remarks
 * All schemas are:
 * - Type-safe with comprehensive TypeScript support
 * - Optimized for performance and memory usage
 * - Extensible for custom validation scenarios
 * - Well-tested and production-ready
 */

import type { ValidationSchema } from "./types.js";

// ============================================================================
// Common Validation Schemas
// ============================================================================

/**
 * Collection of pre-built validation schemas for common data types and formats.
 *
 * This object contains ready-to-use validation schemas for the most common
 * validation scenarios in web applications. Each schema is optimized for
 * performance and provides clear, user-friendly error messages.
 *
 * @example
 * ```typescript
 * import { CommonSchemas } from './schemas.js';
 *
 * // Validate an email
 * const emailResult = ValidationUtils.validateValue('user@example.com', CommonSchemas.email);
 *
 * // Validate a password
 * const passwordResult = ValidationUtils.validateValue('SecurePass123!', CommonSchemas.password);
 *
 * // Validate a URL
 * const urlResult = ValidationUtils.validateValue('https://example.com', CommonSchemas.url);
 * ```
 *
 * @since 1.0.0
 */
export const CommonSchemas = {
  email: {
    type: "email" as const,
    required: true,
    errorMessage: "Please enter a valid email address",
  },

  password: {
    type: "password" as const,
    required: true,
    minLength: 8,
    maxLength: 128,
    errorMessage: "Password must be 8-128 characters with uppercase, lowercase, number, and special character",
  },

  username: {
    type: "username" as const,
    required: true,
    minLength: 3,
    maxLength: 30,
    errorMessage: "Username must be 3-30 characters with only letters, numbers, hyphens, and underscores",
  },

  url: {
    type: "url" as const,
    required: true,
    errorMessage: "Please enter a valid URL",
  },

  positiveNumber: {
    type: "number" as const,
    required: true,
    min: 0,
    errorMessage: "Must be a positive number",
  },

  nonEmptyString: {
    type: "string" as const,
    required: true,
    minLength: 1,
    errorMessage: "This field cannot be empty",
  },

  apiKey: {
    type: "api-key" as const,
    required: true,
    minLength: 10,
    maxLength: 256,
    errorMessage: "API key must be 10-256 characters with only letters, numbers, underscores, and hyphens",
  },

  token: {
    type: "token" as const,
    required: true,
    minLength: 20,
    maxLength: 512,
    errorMessage: "Token must be 20-512 characters",
  },

  filename: {
    type: "filename" as const,
    required: true,
    minLength: 1,
    maxLength: 255,
    errorMessage: "Filename cannot contain invalid characters",
  },

  mimeType: {
    type: "mime-type" as const,
    required: true,
    errorMessage: "Must be a valid MIME type",
  },

  port: {
    type: "port" as const,
    required: true,
    min: 1,
    max: 65535,
    errorMessage: "Port must be between 1 and 65535",
  },

  timeout: {
    type: "timeout" as const,
    required: true,
    min: 1000,
    max: 300000,
    errorMessage: "Timeout must be between 1 second and 5 minutes",
  },

  modelName: {
    type: "model-name" as const,
    required: true,
    minLength: 1,
    maxLength: 100,
    errorMessage: "Model name must be 1-100 characters with only letters, numbers, dots, underscores, and hyphens",
  },

  prompt: {
    type: "prompt" as const,
    required: true,
    minLength: 1,
    maxLength: 10000,
    errorMessage: "Prompt must be 1-10000 characters",
  },

  temperature: {
    type: "temperature" as const,
    required: true,
    min: 0,
    max: 2,
    errorMessage: "Temperature must be between 0 and 2",
  },

  maxTokens: {
    type: "max-tokens" as const,
    required: true,
    min: 1,
    max: 100000,
    errorMessage: "Max tokens must be between 1 and 100000",
  },

  theme: {
    type: "theme" as const,
    required: true,
    enum: ["light", "dark", "auto"],
    errorMessage: "Theme must be light, dark, or auto",
  },

  language: {
    type: "language" as const,
    required: true,
    minLength: 2,
    maxLength: 5,
    errorMessage: "Language must be a valid locale code (e.g., 'en' or 'en-US')",
  },

  color: {
    type: "color" as const,
    required: true,
    errorMessage: "Color must be a valid hex, RGB, or HSL color",
  },

  phone: {
    type: "phone" as const,
    required: true,
    errorMessage: "Must be a valid phone number",
  },

  ip: {
    type: "ip" as const,
    required: true,
    errorMessage: "Must be a valid IP address",
  },

  hexColor: {
    type: "hex-color" as const,
    required: true,
    errorMessage: "Must be a valid hex color",
  },
} as const satisfies Record<string, ValidationSchema>;

// ============================================================================
// Form Validation Schemas
// ============================================================================

/**
 * Collection of pre-built form validation schemas for common application forms.
 *
 * This object contains complete validation schemas for typical form scenarios,
 * combining multiple CommonSchemas into cohesive form validation configurations.
 * Each form schema is designed for specific use cases like login, registration,
 * profile management, and application settings.
 *
 * @example
 * ```typescript
 * import { FormSchemas } from './schemas.js';
 *
 * // Validate login form
 * const loginData = { email: 'user@example.com', password: 'SecurePass123!' };
 * const loginResult = ValidationUtils.validateFields(loginData, FormSchemas.login);
 *
 * // Validate registration form
 * const regData = { email: 'user@example.com', username: 'user123', password: 'SecurePass123!' };
 * const regResult = ValidationUtils.validateFields(regData, FormSchemas.registration);
 * ```
 *
 * @since 1.0.0
 */
export const FormSchemas = {
  login: {
    email: CommonSchemas.email,
    password: CommonSchemas.password,
  },

  registration: {
    email: CommonSchemas.email,
    username: CommonSchemas.username,
    password: CommonSchemas.password,
  },

  profile: {
    username: CommonSchemas.username,
    email: CommonSchemas.email,
  },

  settings: {
    theme: CommonSchemas.theme,
    language: CommonSchemas.language,
  },

  api: {
    apiKey: CommonSchemas.apiKey,
    modelName: CommonSchemas.modelName,
    temperature: CommonSchemas.temperature,
    maxTokens: CommonSchemas.maxTokens,
  },

  file: {
    filename: CommonSchemas.filename,
    mimeType: CommonSchemas.mimeType,
  },

  network: {
    url: CommonSchemas.url,
    port: CommonSchemas.port,
    timeout: CommonSchemas.timeout,
  },
} as const;

// ============================================================================
// Validation Schema Builders
// ============================================================================

/**
 * Creates a custom string validation schema with specified constraints.
 *
 * This function provides a convenient way to create string validation schemas
 * with custom length constraints, pattern matching, and error messages.
 * It's particularly useful when the pre-built schemas don't meet specific requirements.
 *
 * @param options - Configuration options for the string schema
 * @param options.required - Whether the field is required (default: true)
 * @param options.minLength - Minimum string length
 * @param options.maxLength - Maximum string length
 * @param options.pattern - Regular expression pattern for validation
 * @param options.errorMessage - Custom error message for validation failures
 * @returns ValidationSchema configured for string validation
 *
 * @example
 * ```typescript
 * // Create a schema for usernames
 * const usernameSchema = createStringSchema({
 *   minLength: 3,
 *   maxLength: 20,
 *   pattern: /^[a-zA-Z0-9_]+$/,
 *   errorMessage: 'Username must be 3-20 characters with only letters, numbers, and underscores'
 * });
 *
 * // Create a schema for optional descriptions
 * const descriptionSchema = createStringSchema({
 *   required: false,
 *   maxLength: 500,
 *   errorMessage: 'Description cannot exceed 500 characters'
 * });
 * ```
 *
 * @since 1.0.0
 */
export function createStringSchema(options: {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  errorMessage?: string;
}): ValidationSchema {
  return {
    type: "string",
    required: options.required ?? true,
    minLength: options.minLength,
    maxLength: options.maxLength,
    pattern: options.pattern,
    errorMessage: options.errorMessage,
  };
}

/**
 * Creates a custom number validation schema with specified constraints.
 *
 * This function provides a convenient way to create number validation schemas
 * with custom range constraints and error messages. It's useful for validating
 * numeric inputs like ages, quantities, prices, and configuration values.
 *
 * @param options - Configuration options for the number schema
 * @param options.required - Whether the field is required (default: true)
 * @param options.min - Minimum allowed value
 * @param options.max - Maximum allowed value
 * @param options.errorMessage - Custom error message for validation failures
 * @returns ValidationSchema configured for number validation
 *
 * @example
 * ```typescript
 * // Create a schema for age validation
 * const ageSchema = createNumberSchema({
 *   min: 0,
 *   max: 150,
 *   errorMessage: 'Age must be between 0 and 150'
 * });
 *
 * // Create a schema for positive numbers only
 * const positiveSchema = createNumberSchema({
 *   min: 0,
 *   errorMessage: 'Value must be positive'
 * });
 *
 * // Create a schema for optional numeric fields
 * const optionalSchema = createNumberSchema({
 *   required: false,
 *   min: 1,
 *   max: 100
 * });
 * ```
 *
 * @since 1.0.0
 */
export function createNumberSchema(options: {
  required?: boolean;
  min?: number;
  max?: number;
  errorMessage?: string;
}): ValidationSchema {
  return {
    type: "number",
    required: options.required ?? true,
    min: options.min,
    max: options.max,
    errorMessage: options.errorMessage,
  };
}

/**
 * Creates a custom enum validation schema with specified allowed values.
 *
 * This function creates a validation schema that ensures the input value
 * is one of the specified allowed values. It's useful for dropdown selections,
 * status fields, and any scenario where only specific values are acceptable.
 *
 * @param values - Array of allowed values for the enum
 * @param options - Configuration options for the enum schema
 * @param options.required - Whether the field is required (default: true)
 * @param options.errorMessage - Custom error message for validation failures
 * @returns ValidationSchema configured for enum validation
 *
 * @example
 * ```typescript
 * // Create a schema for status selection
 * const statusSchema = createEnumSchema(['active', 'inactive', 'pending'], {
 *   errorMessage: 'Status must be active, inactive, or pending'
 * });
 *
 * // Create a schema for priority levels
 * const prioritySchema = createEnumSchema(['low', 'medium', 'high', 'critical']);
 *
 * // Create a schema for optional enum fields
 * const optionalSchema = createEnumSchema(['option1', 'option2', 'option3'], {
 *   required: false
 * });
 * ```
 *
 * @since 1.0.0
 */
export function createEnumSchema<T>(
  values: T[],
  options: {
    required?: boolean;
    errorMessage?: string;
  } = {}
): ValidationSchema {
  return {
    type: "string",
    required: options.required ?? true,
    enum: values,
    errorMessage: options.errorMessage || `Must be one of: ${values.join(", ")}`,
  };
}

/**
 * Creates a custom validation schema with a user-defined validator function.
 *
 * This function allows you to create validation schemas with completely custom
 * validation logic. It's useful for complex validation scenarios that can't
 * be handled by the built-in validation rules or when you need domain-specific
 * validation logic.
 *
 * @param validator - Custom validation function that returns validation result
 * @param options - Configuration options for the custom schema
 * @param options.required - Whether the field is required (default: true)
 * @param options.errorMessage - Custom error message for validation failures
 * @returns ValidationSchema configured with custom validation logic
 *
 * @example
 * ```typescript
 * // Create a schema for custom business logic validation
 * const customSchema = createCustomSchema(
 *   (value) => {
 *     if (typeof value !== 'string') {
 *       return { isValid: false, error: 'Must be a string' };
 *     }
 *     if (value.length < 5) {
 *       return { isValid: false, error: 'Must be at least 5 characters' };
 *     }
 *     if (!value.includes('@')) {
 *       return { isValid: false, error: 'Must contain @ symbol' };
 *     }
 *     return { isValid: true };
 *   },
 *   { errorMessage: 'Custom validation failed' }
 * );
 *
 * // Create a schema for complex domain validation
 * const domainSchema = createCustomSchema(
 *   (value) => {
 *     // Complex business logic here
 *     return { isValid: true };
 *   }
 * );
 * ```
 *
 * @since 1.0.0
 */
export function createCustomSchema<_T>(
  validator: (value: unknown) => { isValid: boolean; error?: string },
  options: {
    required?: boolean;
    errorMessage?: string;
  } = {}
): ValidationSchema {
  return {
    type: "string",
    required: options.required ?? true,
    customValidator: validator,
    errorMessage: options.errorMessage,
  };
}
