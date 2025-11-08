/**
 * Convenience validation functions for common use cases in the Reynard validation system.
 *
 * This module provides a comprehensive collection of standalone validation functions
 * for common data types and formats. These functions offer a simple, convenient
 * API for validating individual values without needing to define schemas manually.
 *
 * All functions return ValidationResult objects with detailed error information
 * and are optimized for high-performance validation scenarios.
 *
 * @example
 * ```typescript
 * import { validateEmail, validatePassword, validateUrl } from './utils.js';
 *
 * // Email validation
 * const emailResult = validateEmail('user@example.com');
 * if (!emailResult.isValid) {
 *   console.log('Email error:', emailResult.error);
 * }
 *
 * // Password validation with strength checking
 * const passwordResult = validatePassword('SecurePass123!');
 *
 * // URL validation with security checks
 * const urlResult = validateUrl('https://example.com');
 * ```
 *
 * @since 1.0.0
 * @author Swift-Quantum-7
 *
 * @remarks
 * Performance characteristics:
 * - Time complexity: O(1) for most validators, O(n) for complex patterns
 * - Memory usage: O(1) constant space for all operations
 * - Validation speed: Optimized for high-frequency validation scenarios
 */

import { ValidationUtils } from "./core.js";
import { CommonSchemas } from "./schemas.js";
import type { PasswordStrength, ValidationResult, ValidationRules } from "./types.js";

// ============================================================================
// Basic Field Validators
// ============================================================================

/**
 * Validates an email address format and structure.
 *
 * This function performs comprehensive email validation including format checking,
 * domain validation, and length constraints. It uses a robust email regex pattern
 * and additional checks to ensure the email is properly formatted.
 *
 * @param email - The email address to validate
 * @param fieldName - Name of the field for error messages (default: "email")
 * @returns ValidationResult with validation status and error details
 *
 * @example
 * ```typescript
 * const result = validateEmail('user@example.com');
 * if (result.isValid) {
 *   console.log('Email is valid');
 * } else {
 *   console.log('Email error:', result.error);
 * }
 *
 * // With custom field name
 * const result2 = validateEmail('invalid-email', 'contactEmail');
 * ```
 *
 * @since 1.0.0
 *
 * @remarks
 * Performance characteristics:
 * - Time complexity: O(1)
 * - Memory usage: O(1)
 * - Supports international email formats
 */
export function validateEmail(email: string, fieldName = "email"): ValidationResult {
  return ValidationUtils.validateValue(email, CommonSchemas.email, { fieldName });
}

/**
 * Validates a password for strength and security requirements.
 *
 * This function performs comprehensive password validation including length checks,
 * character requirements (uppercase, lowercase, numbers, special characters),
 * and common password security patterns.
 *
 * @param password - The password to validate
 * @param fieldName - Name of the field for error messages (default: "password")
 * @returns ValidationResult with validation status and error details
 *
 * @example
 * ```typescript
 * const result = validatePassword('SecurePass123!');
 * if (result.isValid) {
 *   console.log('Password is valid');
 * } else {
 *   console.log('Password errors:', result.errors);
 * }
 * ```
 *
 * @since 1.0.0
 *
 * @remarks
 * Performance characteristics:
 * - Time complexity: O(1)
 * - Memory usage: O(1)
 * - Enforces strong password requirements
 */
export function validatePassword(password: string, fieldName = "password"): ValidationResult {
  return ValidationUtils.validateValue(password, CommonSchemas.password, { fieldName });
}

/**
 * Validates a username format and constraints.
 *
 * This function validates usernames according to common standards, ensuring
 * they contain only allowed characters (letters, numbers, hyphens, underscores)
 * and meet length requirements.
 *
 * @param username - The username to validate
 * @param fieldName - Name of the field for error messages (default: "username")
 * @returns ValidationResult with validation status and error details
 *
 * @example
 * ```typescript
 * const result = validateUsername('user123');
 * if (result.isValid) {
 *   console.log('Username is valid');
 * } else {
 *   console.log('Username error:', result.error);
 * }
 * ```
 *
 * @since 1.0.0
 *
 * @remarks
 * Performance characteristics:
 * - Time complexity: O(1)
 * - Memory usage: O(1)
 * - Supports alphanumeric characters, hyphens, and underscores
 */
export function validateUsername(username: string, fieldName = "username"): ValidationResult {
  return ValidationUtils.validateValue(username, CommonSchemas.username, { fieldName });
}

/**
 * Validates a URL format and structure.
 *
 * This function performs comprehensive URL validation including protocol checking,
 * domain validation, and format verification. It supports both HTTP and HTTPS
 * protocols and validates the overall URL structure.
 *
 * @param url - The URL to validate
 * @param fieldName - Name of the field for error messages (default: "url")
 * @returns ValidationResult with validation status and error details
 *
 * @example
 * ```typescript
 * const result = validateUrl('https://example.com');
 * if (result.isValid) {
 *   console.log('URL is valid');
 * } else {
 *   console.log('URL error:', result.error);
 * }
 * ```
 *
 * @since 1.0.0
 *
 * @remarks
 * Performance characteristics:
 * - Time complexity: O(1)
 * - Memory usage: O(1)
 * - Supports HTTP and HTTPS protocols
 */
export function validateUrl(url: string, fieldName = "url"): ValidationResult {
  return ValidationUtils.validateValue(url, CommonSchemas.url, { fieldName });
}

/**
 * Validates any value against a validation schema.
 *
 * This is a generic validation function that accepts any value type and validates
 * it against a provided validation schema. It's useful when you need to validate
 * values dynamically or when the value type is not known at compile time.
 *
 * @param value - The value to validate (can be any type)
 * @param schema - The validation schema defining the rules and constraints
 * @param fieldName - Name of the field for error messages (default: "field")
 * @returns ValidationResult with validation status and error details
 *
 * @example
 * ```typescript
 * // Validate a string
 * const result1 = validateValue('user@example.com', {
 *   type: 'email',
 *   required: true
 * }, 'email');
 *
 * // Validate a number
 * const result2 = validateValue(42, {
 *   type: 'number',
 *   min: 0,
 *   max: 100
 * }, 'age');
 *
 * // Validate an array
 * const result3 = validateValue([1, 2, 3], {
 *   type: 'array',
 *   minLength: 1,
 *   maxLength: 10
 * }, 'items');
 * ```
 *
 * @since 1.0.0
 *
 * @remarks
 * Performance characteristics:
 * - Time complexity: O(1) for basic validations, O(n) for complex schemas
 * - Memory usage: O(1) constant space
 * - Supports all validation schema types and constraints
 */
export function validateValue(
  value: unknown,
  schema: {
    type:
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
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
    enum?: unknown[];
    errorMessage?: string;
  },
  fieldName = "field"
): ValidationResult {
  return ValidationUtils.validateValue(value, schema, { fieldName });
}

// ============================================================================
// API Validators
// ============================================================================

/**
 * Validates an API key format and security requirements.
 *
 * This function validates that an API key meets common security standards,
 * including minimum length requirements and allowed character sets.
 * API keys should only contain alphanumeric characters, underscores, and hyphens.
 *
 * @param apiKey - The API key string to validate
 * @param fieldName - Name of the field for error messages (default: "apiKey")
 * @returns ValidationResult with validation status and error details
 *
 * @example
 * ```typescript
 * const result = validateApiKey('sk-1234567890abcdef');
 * if (result.isValid) {
 *   console.log('API key is valid');
 * } else {
 *   console.log('API key errors:', result.errors);
 * }
 * ```
 *
 * @since 1.0.0
 *
 * @remarks
 * Performance characteristics:
 * - Time complexity: O(1)
 * - Memory usage: O(1)
 * - Enforces security best practices for API keys
 */
export function validateApiKey(apiKey: string, fieldName = "apiKey"): ValidationResult {
  return ValidationUtils.validateValue(apiKey, CommonSchemas.apiKey, { fieldName });
}

/**
 * Validates an authentication token format and minimum length requirements.
 *
 * This function validates that an authentication token meets security requirements,
 * including minimum length to ensure sufficient entropy. Tokens should be long
 * enough to resist brute-force attacks.
 *
 * @param token - The authentication token string to validate
 * @param fieldName - Name of the field for error messages (default: "token")
 * @returns ValidationResult with validation status and error details
 *
 * @example
 * ```typescript
 * const result = validateToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
 * if (result.isValid) {
 *   console.log('Token is valid');
 * } else {
 *   console.log('Token errors:', result.errors);
 * }
 * ```
 *
 * @since 1.0.0
 *
 * @remarks
 * Performance characteristics:
 * - Time complexity: O(1)
 * - Memory usage: O(1)
 * - Enforces minimum token length for security
 */
export function validateToken(token: string, fieldName = "token"): ValidationResult {
  return ValidationUtils.validateValue(token, CommonSchemas.token, { fieldName });
}

// ============================================================================
// File and Media Validators
// ============================================================================

/**
 * Validates a filename format ensuring it doesn't contain invalid filesystem characters.
 *
 * This function validates that a filename is safe to use across different operating
 * systems by checking for invalid characters that could cause filesystem errors or
 * security issues. It prevents control characters and special symbols that are
 * reserved by various filesystems.
 *
 * @param fileName - The filename string to validate
 * @param fieldName - Name of the field for error messages (default: "fileName")
 * @returns ValidationResult with validation status and error details
 *
 * @example
 * ```typescript
 * const result = validateFileName('my-document.pdf');
 * if (result.isValid) {
 *   console.log('Filename is valid');
 * } else {
 *   console.log('Filename errors:', result.errors);
 * }
 *
 * // Invalid filename
 * const invalidResult = validateFileName('file<>name.txt');
 * // Will fail due to invalid characters
 * ```
 *
 * @since 1.0.0
 *
 * @remarks
 * Performance characteristics:
 * - Time complexity: O(1)
 * - Memory usage: O(1)
 * - Prevents filesystem errors and security vulnerabilities
 */
export function validateFileName(fileName: string, fieldName = "fileName"): ValidationResult {
  return ValidationUtils.validateValue(fileName, CommonSchemas.filename, { fieldName });
}

/**
 * Validates a MIME type format according to RFC 2045 standards.
 *
 * This function validates that a MIME type string follows the proper format:
 * `type/subtype` where both type and subtype contain only allowed characters.
 * It ensures the MIME type is properly formatted for use in HTTP headers and
 * content-type declarations.
 *
 * @param mimeType - The MIME type string to validate (e.g., "application/json")
 * @param fieldName - Name of the field for error messages (default: "mimeType")
 * @returns ValidationResult with validation status and error details
 *
 * @example
 * ```typescript
 * const result = validateMimeType('application/json');
 * if (result.isValid) {
 *   console.log('MIME type is valid');
 * } else {
 *   console.log('MIME type errors:', result.errors);
 * }
 *
 * // Common valid MIME types
 * validateMimeType('text/html');        // Valid
 * validateMimeType('image/png');        // Valid
 * validateMimeType('application/pdf');   // Valid
 * ```
 *
 * @since 1.0.0
 *
 * @remarks
 * Performance characteristics:
 * - Time complexity: O(1)
 * - Memory usage: O(1)
 * - Complies with RFC 2045 MIME type specifications
 */
export function validateMimeType(mimeType: string, fieldName = "mimeType"): ValidationResult {
  return ValidationUtils.validateValue(mimeType, CommonSchemas.mimeType, { fieldName });
}

/**
 * Validates file size against maximum size constraints.
 *
 * This function validates that a file size (in bytes) is within acceptable limits,
 * preventing oversized files that could cause memory issues or storage problems.
 * The default maximum size is 100MB, but this can be customized.
 *
 * @param fileSize - The file size in bytes to validate
 * @param fieldName - Name of the field for error messages (default: "fileSize")
 * @param maxSize - Maximum allowed file size in bytes (default: 100MB)
 * @returns ValidationResult with validation status and error details
 *
 * @example
 * ```typescript
 * // Validate with default 100MB limit
 * const result1 = validateFileSize(50 * 1024 * 1024); // 50MB
 * if (result1.isValid) {
 *   console.log('File size is acceptable');
 * }
 *
 * // Validate with custom limit
 * const result2 = validateFileSize(200 * 1024 * 1024, 'upload', 50 * 1024 * 1024);
 * // Will fail if file is larger than 50MB
 * ```
 *
 * @since 1.0.0
 *
 * @remarks
 * Performance characteristics:
 * - Time complexity: O(1)
 * - Memory usage: O(1)
 * - Prevents memory exhaustion from oversized files
 */
export function validateFileSize(
  fileSize: number,
  fieldName = "fileSize",
  maxSize = 100 * 1024 * 1024 // 100MB default
): ValidationResult {
  return ValidationUtils.validateValue(
    fileSize,
    {
      type: "number",
      required: true,
      min: 0,
      max: maxSize,
      errorMessage: `File size must be between 0 and ${Math.round(maxSize / 1024 / 1024)}MB`,
    },
    { fieldName }
  );
}

// ============================================================================
// Configuration Validators
// ============================================================================

/**
 * Validates a network port number within the valid TCP/UDP port range.
 *
 * This function validates that a port number is within the standard range of
 * 1-65535, which is the valid range for TCP and UDP ports. Port 0 is reserved
 * and not allowed for most use cases.
 *
 * @param port - The port number to validate (must be between 1 and 65535)
 * @param fieldName - Name of the field for error messages (default: "port")
 * @returns ValidationResult with validation status and error details
 *
 * @example
 * ```typescript
 * const result = validatePort(8080);
 * if (result.isValid) {
 *   console.log('Port is valid');
 * } else {
 *   console.log('Port errors:', result.errors);
 * }
 *
 * // Common valid ports
 * validatePort(80);    // HTTP - Valid
 * validatePort(443);   // HTTPS - Valid
 * validatePort(3000);  // Development server - Valid
 * validatePort(0);     // Invalid (reserved)
 * validatePort(70000); // Invalid (out of range)
 * ```
 *
 * @since 1.0.0
 *
 * @remarks
 * Performance characteristics:
 * - Time complexity: O(1)
 * - Memory usage: O(1)
 * - Enforces standard TCP/UDP port range constraints
 */
export function validatePort(port: number, fieldName = "port"): ValidationResult {
  return ValidationUtils.validateValue(port, CommonSchemas.port, { fieldName });
}

/**
 * Validates a timeout value in milliseconds within reasonable bounds.
 *
 * This function validates that a timeout value is within acceptable limits
 * (1 second to 5 minutes by default) to prevent excessively short or long
 * timeouts that could cause performance issues or user experience problems.
 *
 * @param timeout - The timeout value in milliseconds to validate
 * @param fieldName - Name of the field for error messages (default: "timeout")
 * @returns ValidationResult with validation status and error details
 *
 * @example
 * ```typescript
 * const result = validateTimeout(5000); // 5 seconds
 * if (result.isValid) {
 *   console.log('Timeout is valid');
 * } else {
 *   console.log('Timeout errors:', result.errors);
 * }
 *
 * // Common timeout values
 * validateTimeout(1000);   // 1 second - Valid
 * validateTimeout(30000);  // 30 seconds - Valid
 * validateTimeout(500);    // Invalid (too short)
 * validateTimeout(600000); // Invalid (too long)
 * ```
 *
 * @since 1.0.0
 *
 * @remarks
 * Performance characteristics:
 * - Time complexity: O(1)
 * - Memory usage: O(1)
 * - Prevents unreasonable timeout values
 */
export function validateTimeout(timeout: number, fieldName = "timeout"): ValidationResult {
  return ValidationUtils.validateValue(timeout, CommonSchemas.timeout, { fieldName });
}

/**
 * Validates a retry count value within acceptable limits.
 *
 * This function validates that a retry count is within reasonable bounds (0-10)
 * to prevent excessive retry attempts that could cause performance degradation
 * or resource exhaustion. A retry count of 0 means no retries will be attempted.
 *
 * @param retryCount - The retry count to validate (must be between 0 and 10)
 * @param fieldName - Name of the field for error messages (default: "retryCount")
 * @returns ValidationResult with validation status and error details
 *
 * @example
 * ```typescript
 * const result = validateRetryCount(3);
 * if (result.isValid) {
 *   console.log('Retry count is valid');
 * } else {
 *   console.log('Retry count errors:', result.errors);
 * }
 *
 * // Common retry counts
 * validateRetryCount(0);  // No retries - Valid
 * validateRetryCount(3);  // Standard retry - Valid
 * validateRetryCount(5);  // Moderate retry - Valid
 * validateRetryCount(15); // Invalid (exceeds maximum)
 * ```
 *
 * @since 1.0.0
 *
 * @remarks
 * Performance characteristics:
 * - Time complexity: O(1)
 * - Memory usage: O(1)
 * - Prevents excessive retry attempts
 */
export function validateRetryCount(retryCount: number, fieldName = "retryCount"): ValidationResult {
  return ValidationUtils.validateValue(
    retryCount,
    {
      type: "number",
      required: true,
      min: 0,
      max: 10,
      errorMessage: "Retry count must be between 0 and 10",
    },
    { fieldName }
  );
}

// ============================================================================
// AI/ML Validators
// ============================================================================

/**
 * Validates an AI/ML model name format and constraints.
 *
 * This function validates that a model name follows common naming conventions
 * for machine learning models, ensuring it contains only allowed characters
 * (letters, numbers, dots, underscores, and hyphens) and meets length requirements.
 *
 * @param modelName - The model name string to validate (e.g., "gpt-4", "claude-3-opus")
 * @param fieldName - Name of the field for error messages (default: "modelName")
 * @returns ValidationResult with validation status and error details
 *
 * @example
 * ```typescript
 * const result = validateModelName('gpt-4');
 * if (result.isValid) {
 *   console.log('Model name is valid');
 * } else {
 *   console.log('Model name errors:', result.errors);
 * }
 *
 * // Common model names
 * validateModelName('gpt-4');           // Valid
 * validateModelName('claude-3-opus');   // Valid
 * validateModelName('llama-2-70b');     // Valid
 * validateModelName('model@name');      // Invalid (contains @)
 * ```
 *
 * @since 1.0.0
 *
 * @remarks
 * Performance characteristics:
 * - Time complexity: O(1)
 * - Memory usage: O(1)
 * - Enforces standard model naming conventions
 */
export function validateModelName(modelName: string, fieldName = "modelName"): ValidationResult {
  return ValidationUtils.validateValue(modelName, CommonSchemas.modelName, { fieldName });
}

/**
 * Validates a prompt string for AI/ML model inputs.
 *
 * This function validates that a prompt string meets length requirements and
 * is suitable for use with AI models. Prompts must be non-empty and within
 * reasonable length limits to ensure proper processing.
 *
 * @param prompt - The prompt string to validate
 * @param fieldName - Name of the field for error messages (default: "prompt")
 * @returns ValidationResult with validation status and error details
 *
 * @example
 * ```typescript
 * const result = validatePrompt('What is the capital of France?');
 * if (result.isValid) {
 *   console.log('Prompt is valid');
 * } else {
 *   console.log('Prompt errors:', result.errors);
 * }
 *
 * // Valid prompts
 * validatePrompt('Hello, world!');        // Valid
 * validatePrompt('Explain quantum computing'); // Valid
 *
 * // Invalid prompts
 * validatePrompt('');                     // Invalid (empty)
 * validatePrompt('x'.repeat(20000));      // Invalid (too long)
 * ```
 *
 * @since 1.0.0
 *
 * @remarks
 * Performance characteristics:
 * - Time complexity: O(1)
 * - Memory usage: O(1)
 * - Enforces reasonable prompt length limits
 */
export function validatePrompt(prompt: string, fieldName = "prompt"): ValidationResult {
  return ValidationUtils.validateValue(prompt, CommonSchemas.prompt, { fieldName });
}

/**
 * Validates a temperature parameter for AI/ML model configuration.
 *
 * This function validates that a temperature value is within the standard range
 * (0-2) used by most AI models. Temperature controls the randomness of model
 * outputs, with 0 being deterministic and higher values being more creative.
 *
 * @param temperature - The temperature value to validate (must be between 0 and 2)
 * @param fieldName - Name of the field for error messages (default: "temperature")
 * @returns ValidationResult with validation status and error details
 *
 * @example
 * ```typescript
 * const result = validateTemperature(0.7);
 * if (result.isValid) {
 *   console.log('Temperature is valid');
 * } else {
 *   console.log('Temperature errors:', result.errors);
 * }
 *
 * // Common temperature values
 * validateTemperature(0);    // Deterministic - Valid
 * validateTemperature(0.7);  // Balanced - Valid
 * validateTemperature(1.0);  // Standard - Valid
 * validateTemperature(2.0);  // Maximum creativity - Valid
 * validateTemperature(3.0);  // Invalid (exceeds maximum)
 * ```
 *
 * @since 1.0.0
 *
 * @remarks
 * Performance characteristics:
 * - Time complexity: O(1)
 * - Memory usage: O(1)
 * - Enforces standard AI model temperature range
 */
export function validateTemperature(temperature: number, fieldName = "temperature"): ValidationResult {
  return ValidationUtils.validateValue(temperature, CommonSchemas.temperature, { fieldName });
}

/**
 * Validates a max tokens parameter for AI/ML model configuration.
 *
 * This function validates that a max tokens value is within reasonable bounds
 * (1-100,000) to prevent excessive token generation that could cause performance
 * issues or exceed model limits. Max tokens controls the maximum length of the
 * generated response.
 *
 * @param maxTokens - The max tokens value to validate (must be between 1 and 100,000)
 * @param fieldName - Name of the field for error messages (default: "maxTokens")
 * @returns ValidationResult with validation status and error details
 *
 * @example
 * ```typescript
 * const result = validateMaxTokens(1000);
 * if (result.isValid) {
 *   console.log('Max tokens is valid');
 * } else {
 *   console.log('Max tokens errors:', result.errors);
 * }
 *
 * // Common max tokens values
 * validateMaxTokens(100);    // Short response - Valid
 * validateMaxTokens(1000);   // Standard response - Valid
 * validateMaxTokens(4000);   // Long response - Valid
 * validateMaxTokens(0);      // Invalid (must be at least 1)
 * validateMaxTokens(200000); // Invalid (exceeds maximum)
 * ```
 *
 * @since 1.0.0
 *
 * @remarks
 * Performance characteristics:
 * - Time complexity: O(1)
 * - Memory usage: O(1)
 * - Prevents excessive token generation
 */
export function validateMaxTokens(maxTokens: number, fieldName = "maxTokens"): ValidationResult {
  return ValidationUtils.validateValue(maxTokens, CommonSchemas.maxTokens, { fieldName });
}

// ============================================================================
// UI/UX Validators
// ============================================================================

/**
 * Validates a theme name against allowed theme values.
 *
 * This function validates that a theme name is one of the standard theme options
 * (light, dark, or auto). The auto theme typically follows system preferences.
 *
 * @param theme - The theme name to validate (must be "light", "dark", or "auto")
 * @param fieldName - Name of the field for error messages (default: "theme")
 * @returns ValidationResult with validation status and error details
 *
 * @example
 * ```typescript
 * const result = validateTheme('dark');
 * if (result.isValid) {
 *   console.log('Theme is valid');
 * } else {
 *   console.log('Theme errors:', result.errors);
 * }
 *
 * // Valid themes
 * validateTheme('light');  // Valid
 * validateTheme('dark');   // Valid
 * validateTheme('auto');   // Valid
 *
 * // Invalid themes
 * validateTheme('blue');   // Invalid (not in enum)
 * validateTheme('custom'); // Invalid (not in enum)
 * ```
 *
 * @since 1.0.0
 *
 * @remarks
 * Performance characteristics:
 * - Time complexity: O(1)
 * - Memory usage: O(1)
 * - Enforces standard theme options
 */
export function validateTheme(theme: string, fieldName = "theme"): ValidationResult {
  return ValidationUtils.validateValue(theme, CommonSchemas.theme, { fieldName });
}

/**
 * Validates a language/locale code format.
 *
 * This function validates that a language code follows standard locale format
 * (e.g., "en", "en-US", "fr-CA"). Language codes must be 2-5 characters and
 * follow ISO 639-1 and ISO 3166-1 alpha-2 standards.
 *
 * @param language - The language code to validate (e.g., "en", "en-US", "fr")
 * @param fieldName - Name of the field for error messages (default: "language")
 * @returns ValidationResult with validation status and error details
 *
 * @example
 * ```typescript
 * const result = validateLanguage('en-US');
 * if (result.isValid) {
 *   console.log('Language code is valid');
 * } else {
 *   console.log('Language code errors:', result.errors);
 * }
 *
 * // Valid language codes
 * validateLanguage('en');      // Valid (2 characters)
 * validateLanguage('en-US');    // Valid (locale format)
 * validateLanguage('fr-CA');    // Valid (locale format)
 *
 * // Invalid language codes
 * validateLanguage('e');        // Invalid (too short)
 * validateLanguage('english');  // Invalid (too long, not a code)
 * ```
 *
 * @since 1.0.0
 *
 * @remarks
 * Performance characteristics:
 * - Time complexity: O(1)
 * - Memory usage: O(1)
 * - Follows ISO 639-1 and ISO 3166-1 standards
 */
export function validateLanguage(language: string, fieldName = "language"): ValidationResult {
  return ValidationUtils.validateValue(language, CommonSchemas.language, { fieldName });
}

/**
 * Validates a color value in various formats (hex, RGB, HSL).
 *
 * This function validates that a color string is in a valid format that can be
 * used in CSS or other color contexts. It supports hex colors (#RRGGBB), RGB
 * (rgb(r, g, b)), and HSL (hsl(h, s%, l%)) formats.
 *
 * @param color - The color string to validate
 * @param fieldName - Name of the field for error messages (default: "color")
 * @returns ValidationResult with validation status and error details
 *
 * @example
 * ```typescript
 * const result = validateColor('#FF5733');
 * if (result.isValid) {
 *   console.log('Color is valid');
 * } else {
 *   console.log('Color errors:', result.errors);
 * }
 *
 * // Valid color formats
 * validateColor('#FF5733');                    // Hex - Valid
 * validateColor('rgb(255, 87, 51)');           // RGB - Valid
 * validateColor('hsl(9, 100%, 60%)');          // HSL - Valid
 *
 * // Invalid colors
 * validateColor('red');                         // Invalid (not a valid format)
 * validateColor('#GG5733');                    // Invalid (invalid hex)
 * ```
 *
 * @since 1.0.0
 *
 * @remarks
 * Performance characteristics:
 * - Time complexity: O(1)
 * - Memory usage: O(1)
 * - Supports multiple color format standards
 */
export function validateColor(color: string, fieldName = "color"): ValidationResult {
  return ValidationUtils.validateValue(color, CommonSchemas.color, { fieldName });
}

// ============================================================================
// Utility Validators
// ============================================================================

/**
 * Validates that a value is not empty (null, undefined, or empty string).
 *
 * This function provides a simple check to ensure a value has been provided
 * and is not empty. It's useful for basic required field validation when
 * you don't need complex schema validation.
 *
 * @param value - The value to validate (can be any type)
 * @param fieldName - Name of the field for error messages (default: "field")
 * @returns ValidationResult with validation status and error details
 *
 * @example
 * ```typescript
 * const result = validateNotEmpty('Hello');
 * if (result.isValid) {
 *   console.log('Value is not empty');
 * } else {
 *   console.log('Value is empty');
 * }
 *
 * // Valid values
 * validateNotEmpty('text');     // Valid
 * validateNotEmpty(0);          // Valid (0 is not empty)
 * validateNotEmpty(false);      // Valid (false is not empty)
 * validateNotEmpty([]);         // Valid (empty array is not considered empty)
 *
 * // Invalid values
 * validateNotEmpty('');         // Invalid (empty string)
 * validateNotEmpty(null);       // Invalid
 * validateNotEmpty(undefined);  // Invalid
 * ```
 *
 * @since 1.0.0
 *
 * @remarks
 * Performance characteristics:
 * - Time complexity: O(1)
 * - Memory usage: O(1)
 * - Simple and fast empty value check
 */
export function validateNotEmpty(value: unknown, fieldName = "field"): ValidationResult {
  if (value === null || value === undefined || value === "") {
    return {
      isValid: false,
      error: `${fieldName} cannot be empty`,
      field: fieldName,
      value,
    };
  }
  return { isValid: true, field: fieldName, value };
}

/**
 * Validates that a value is a positive number (greater than zero).
 *
 * This function ensures that a numeric value is positive, which is useful for
 * quantities, counts, prices, and other values that must be greater than zero.
 * Zero is not considered positive.
 *
 * @param value - The number to validate (must be greater than 0)
 * @param fieldName - Name of the field for error messages (default: "field")
 * @returns ValidationResult with validation status and error details
 *
 * @example
 * ```typescript
 * const result = validatePositive(42);
 * if (result.isValid) {
 *   console.log('Value is positive');
 * } else {
 *   console.log('Value is not positive');
 * }
 *
 * // Valid values
 * validatePositive(1);      // Valid
 * validatePositive(100);   // Valid
 * validatePositive(0.5);  // Valid
 *
 * // Invalid values
 * validatePositive(0);     // Invalid (zero is not positive)
 * validatePositive(-5);    // Invalid (negative)
 * validatePositive(-0.1);  // Invalid (negative)
 * ```
 *
 * @since 1.0.0
 *
 * @remarks
 * Performance characteristics:
 * - Time complexity: O(1)
 * - Memory usage: O(1)
 * - Simple positive number validation
 */
export function validatePositive(value: number, fieldName = "field"): ValidationResult {
  if (typeof value !== "number" || value <= 0) {
    return {
      isValid: false,
      error: `${fieldName} must be a positive number`,
      field: fieldName,
      value,
    };
  }
  return { isValid: true, field: fieldName, value };
}

/**
 * Validates that a numeric value is within a specified range (inclusive).
 *
 * This function ensures that a number falls within a defined range, which is
 * useful for validating values like ages, percentages, scores, and other
 * bounded numeric inputs. Both min and max are inclusive.
 *
 * @param value - The number to validate
 * @param min - Minimum allowed value (inclusive)
 * @param max - Maximum allowed value (inclusive)
 * @param fieldName - Name of the field for error messages (default: "field")
 * @returns ValidationResult with validation status and error details
 *
 * @example
 * ```typescript
 * const result = validateRange(25, 18, 120);
 * if (result.isValid) {
 *   console.log('Value is within range');
 * } else {
 *   console.log('Value is out of range');
 * }
 *
 * // Valid values
 * validateRange(25, 18, 120);  // Valid (within range)
 * validateRange(18, 18, 120); // Valid (at minimum)
 * validateRange(120, 18, 120); // Valid (at maximum)
 *
 * // Invalid values
 * validateRange(15, 18, 120); // Invalid (below minimum)
 * validateRange(150, 18, 120); // Invalid (above maximum)
 * ```
 *
 * @since 1.0.0
 *
 * @remarks
 * Performance characteristics:
 * - Time complexity: O(1)
 * - Memory usage: O(1)
 * - Inclusive range validation
 */
export function validateRange(value: number, min: number, max: number, fieldName = "field"): ValidationResult {
  if (typeof value !== "number" || value < min || value > max) {
    return {
      isValid: false,
      error: `${fieldName} must be between ${min} and ${max}`,
      field: fieldName,
      value,
    };
  }
  return { isValid: true, field: fieldName, value };
}

// ============================================================================
// Advanced Password Validation
// ============================================================================

/**
 * Validates password strength with comprehensive feedback and scoring.
 *
 * This function performs detailed password strength analysis, checking multiple
 * criteria including length, character variety (uppercase, lowercase, numbers,
 * special characters), and providing a strength score and feedback. It returns
 * a PasswordStrength object with detailed information about the password's
 * security level.
 *
 * @param password - The password string to validate
 * @param rules - Validation rules configuration (optional, has sensible defaults)
 * @param rules.minLength - Minimum password length (default: 8)
 * @param rules.requireUppercase - Require uppercase letters (default: true)
 * @param rules.requireLowercase - Require lowercase letters (default: true)
 * @param rules.requireNumber - Require numeric characters (default: true)
 * @param rules.requireSpecialChar - Require special characters (default: true)
 * @returns PasswordStrength object with score, feedback, and suggestions
 *
 * @example
 * ```typescript
 * const result = validatePasswordStrength('SecurePass123!');
 * if (result.isValid) {
 *   console.log('Password strength:', result.feedback);
 *   console.log('Score:', result.score);
 * } else {
 *   console.log('Password suggestions:', result.suggestions);
 * }
 *
 * // Strong password
 * const strong = validatePasswordStrength('MyStr0ng!P@ss');
 * // Returns: { isValid: true, score: 5, feedback: 'very-strong', suggestions: [] }
 *
 * // Weak password
 * const weak = validatePasswordStrength('password');
 * // Returns: { isValid: false, score: 1, feedback: 'weak', suggestions: [...] }
 * ```
 *
 * @since 1.0.0
 *
 * @remarks
 * Performance characteristics:
 * - Time complexity: O(n) where n is password length
 * - Memory usage: O(1)
 * - Provides comprehensive password security analysis
 */
export function validatePasswordStrength(
  password: string,
  rules: ValidationRules = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true,
  }
): PasswordStrength {
  const errors: string[] = [];
  let score = 0;

  // Length check
  if (rules.minLength && password.length < rules.minLength) {
    errors.push(`Password must be at least ${rules.minLength} characters long`);
  } else if (rules.minLength && password.length >= rules.minLength) {
    score += 1;
  }

  // Uppercase check
  if (rules.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  } else if (rules.requireUppercase && /[A-Z]/.test(password)) {
    score += 1;
  }

  // Lowercase check
  if (rules.requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  } else if (rules.requireLowercase && /[a-z]/.test(password)) {
    score += 1;
  }

  // Number check
  if (rules.requireNumber && !/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  } else if (rules.requireNumber && /\d/.test(password)) {
    score += 1;
  }

  // Special character check
  if (rules.requireSpecialChar && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  } else if (rules.requireSpecialChar && /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    score += 1;
  }

  // Determine strength level
  let strength: "weak" | "medium" | "strong" | "very-strong";
  if (score <= 2) strength = "weak";
  else if (score <= 3) strength = "medium";
  else if (score <= 4) strength = "strong";
  else if (score >= 5 && password.length >= 12) strength = "very-strong";
  else strength = "strong";

  return {
    isValid: errors.length === 0,
    score,
    feedback: strength,
    suggestions: errors,
  };
}

// ============================================================================
// URL Validation with Security
// ============================================================================

/**
 * Validates a URL for security concerns and returns a sanitized version.
 *
 * This function performs security-focused URL validation, checking for:
 * - Allowed protocols (HTTP and HTTPS only)
 * - Private/localhost addresses (blocked for security)
 * - Suspicious patterns (javascript:, data:, etc.)
 * - Returns a sanitized URL if valid
 *
 * @param url - The URL string to validate
 * @returns Object with isValid boolean and optional sanitized URL string
 *
 * @example
 * ```typescript
 * const result = validateUrlSecurity('https://example.com');
 * if (result.isValid) {
 *   console.log('Safe URL:', result.sanitized);
 * } else {
 *   console.log('URL is not safe');
 * }
 *
 * // Safe URLs
 * validateUrlSecurity('https://example.com');  // Valid
 * validateUrlSecurity('http://api.example.com'); // Valid
 *
 * // Unsafe URLs (blocked)
 * validateUrlSecurity('javascript:alert(1)');  // Invalid (dangerous protocol)
 * validateUrlSecurity('http://localhost');    // Invalid (localhost blocked)
 * validateUrlSecurity('http://192.168.1.1');  // Invalid (private IP blocked)
 * ```
 *
 * @since 1.0.0
 *
 * @remarks
 * Performance characteristics:
 * - Time complexity: O(1)
 * - Memory usage: O(1)
 * - Provides security-focused URL validation
 * - Blocks potentially dangerous URL patterns
 */
export function validateUrlSecurity(url: string): {
  isValid: boolean;
  sanitized?: string;
} {
  if (!url || typeof url !== "string") {
    return { isValid: false };
  }

  try {
    const parsed = new URL(url);

    // Only allow http and https protocols
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { isValid: false };
    }

    // Reject localhost and private IP addresses
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("172.")
    ) {
      return { isValid: false };
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [/javascript:/i, /data:/i, /vbscript:/i, /file:/i, /ftp:/i];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(url)) {
        return { isValid: false };
      }
    }

    // Add trailing slash if missing
    let sanitized = url;
    if (!sanitized.endsWith("/") && !sanitized.includes("?")) {
      sanitized += "/";
    }

    return { isValid: true, sanitized };
  } catch {
    return { isValid: false };
  }
}
