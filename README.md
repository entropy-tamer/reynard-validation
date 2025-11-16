# Reynard Validation

Validation utilities for the Reynard framework.

## Overview

The `reynard-validation` package provides a comprehensive, unified validation system for the entire Reynard ecosystem. It consolidates all validation logic from across the ecosystem into a single, consistent, and powerful validation system with full TypeScript support, comprehensive error handling, and advanced features like JSON remediation.

## Features

- **Unified API**: Single validation system across all Reynard packages
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Extensible**: Easy to add custom validators and schemas
- **Performance**: Optimized validation engine with minimal overhead (O(1) for basic validations, O(n) for complex schemas)
- **Security**: Built-in security validation for URLs, passwords, and file uploads
  - **Contagious Interview Attack Detection**: Automatically detects base64-encoded JSON storage URLs used for malware delivery
  - **Config File Security Validation**: Scans config files for malicious patterns
  - **Known IOC Detection**: Identifies known malicious indicators from threat intelligence
- **Flexible**: Support for both simple and complex validation scenarios
- **JSON Remediation**: Advanced JSON syntax fixing and package.json validation
- **Comprehensive Validators**: 20+ built-in validators for common use cases
- **Schema System**: Flexible validation schemas with custom rules and error messages
- **Error Handling**: Detailed validation errors with context information

## Installation

```bash
pnpm add reynard-validation
```

## Quick Start

### Basic Validation

```typescript
import { validateEmail, validatePassword, validateUsername } from "reynard-validation";

// Simple validation
const emailResult = validateEmail("user@example.com");
console.log(emailResult.isValid); // true

const passwordResult = validatePassword("weak");
console.log(passwordResult.isValid); // false
console.log(passwordResult.error); // "Password must be 8-128 characters..."

// With custom field names
const usernameResult = validateUsername("john_doe", "displayName");
```

### Schema-Based Validation

```typescript
import { ValidationUtils, CommonSchemas } from "reynard-validation";

// Using predefined schemas
const result = ValidationUtils.validateValue("user@example.com", CommonSchemas.email, { fieldName: "email" });

// Custom schema
const customSchema = {
  type: "string" as const,
  required: true,
  minLength: 5,
  maxLength: 50,
  pattern: /^[a-zA-Z0-9_]+$/,
  errorMessage: "Username must be 5-50 alphanumeric characters",
};

const customResult = ValidationUtils.validateValue("john_doe", customSchema, { fieldName: "username" });
```

### Form Validation

```typescript
import { ValidationUtils, FormSchemas } from "reynard-validation";

const formData = {
  email: "user@example.com",
  username: "john_doe",
  password: "SecurePass123!",
};

const result = ValidationUtils.validateFields(formData, FormSchemas.registration);

console.log(result.isValid); // true
console.log(result.results); // { email: {...}, username: {...}, password: {...} }
console.log(result.errors); // [] (empty if all valid)
```

## JSON Remediation

The `reynard-validation` package includes powerful JSON remediation tools for fixing common JSON syntax errors, particularly useful for maintaining clean `package.json` files across large monorepos.

### Quick Start - JSON Remediation

```typescript
import { JsonRemediatorFinal } from "reynard-validation";

// Create a remediator instance
const remediator = new JsonRemediatorFinal();

// Fix a malformed JSON string
const malformedJson = '{"name": "test" "version": "1.0.0"}';
const result = remediator.remediate(malformedJson);

console.log(result.isValid); // true
console.log(result.fixedJson); // '{"name": "test", "version": "1.0.0"}'
console.log(result.errors); // Array of fixed errors
```

### CLI Usage

The package provides convenient CLI commands for JSON remediation:

```bash
# Check JSON files for syntax errors
pnpm json:check

# Fix a specific JSON file
pnpm json:fix path/to/file.json

# Fix all package.json files in the monorepo
pnpm json:fix-all
```

**See [JSON Remediation Documentation](./docs/json-remediation.md)** for comprehensive documentation including:

- Complete API reference for `JsonRemediator` and `JsonRemediatorFinal` classes
- Utility functions: `fixJsonSyntax`, `fixPackageJson`
- All supported error types and fixes
- CLI usage and integration examples
- Error handling and troubleshooting

## API Reference

### Core Classes

#### `ValidationUtils`

The main validation engine class.

```typescript
class ValidationUtils {
  static validateValue(value: unknown, schema: ValidationSchema, options?: FieldValidationOptions): ValidationResult;

  static validateFields(
    data: Record<string, unknown>,
    schemas: Record<string, ValidationSchema>,
    options?: { strict?: boolean }
  ): MultiValidationResult;

  static validateOrThrow(value: unknown, schema: ValidationSchema, options?: FieldValidationOptions): void;
}
```

#### `JsonRemediatorFinal`

The production-ready JSON remediation class for fixing JSON syntax errors.

```typescript
class JsonRemediatorFinal {
  remediate(jsonString: string): JsonRemediationResult;
  remediatePackageJson(packageJsonContent: string): JsonRemediationResult;
}
```

#### `JsonRemediator`

The comprehensive JSON remediation class with detailed error tracking.

```typescript
class JsonRemediator {
  remediate(jsonString: string): JsonRemediationResult;
  remediatePackageJson(packageJsonContent: string): JsonRemediationResult;
}
```

### Types

#### `ValidationResult`

```typescript
type ValidationResult = {
  isValid: boolean;
  error?: string;
  field?: string;
  value?: unknown;
  errors?: string[];
};
```

#### `ValidationSchema`

```typescript
type ValidationSchema = {
  type: "string" | "number" | "email" | "url" | "password" | ...;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  enum?: unknown[];
  errorMessage?: string;
  customValidator?: (value: unknown) => ValidationResult;
};
```

#### `JsonRemediationResult`

```typescript
type JsonRemediationResult = {
  isValid: boolean;
  fixedJson: string;
  errors: JsonSyntaxError[];
  unfixableErrors: string[];
};
```

#### `JsonSyntaxError`

```typescript
type JsonSyntaxError = {
  type:
    | "missing-comma"
    | "trailing-comma"
    | "missing-quote"
    | "invalid-escape"
    | "malformed-object"
    | "malformed-array";
  line: number;
  column: number;
  description: string;
  fix: string;
};
```

#### `MultiValidationResult`

Result of validating multiple fields with individual and aggregate results.

```typescript
type MultiValidationResult = {
  isValid: boolean;
  results: Record<string, ValidationResult>;
  errors: string[];
};
```

### Predefined Schemas

#### `CommonSchemas`

Predefined schemas for common validation patterns:

- `email` - Email address validation
- `password` - Password strength validation
- `username` - Username format validation
- `url` - URL format validation
- `apiKey` - API key format validation
- `token` - Authentication token validation
- `filename` - Filename validation
- `mimeType` - MIME type validation
- `port` - Port number validation
- `timeout` - Timeout value validation
- `modelName` - AI model name validation
- `prompt` - AI prompt validation
- `temperature` - AI temperature parameter validation
- `maxTokens` - AI max tokens parameter validation
- `theme` - UI theme validation
- `language` - Language code validation
- `color` - Color value validation

#### `FormSchemas`

Predefined form validation schemas:

- `login` - Login form validation
- `registration` - Registration form validation
- `profile` - Profile form validation
- `settings` - Settings form validation
- `api` - API configuration validation
- `file` - File upload validation
- `network` - Network configuration validation

### Validation Functions

#### Basic Validators

```typescript
validateEmail(email: string, fieldName?: string): ValidationResult
validatePassword(password: string, fieldName?: string): ValidationResult
validateUsername(username: string, fieldName?: string): ValidationResult
validateUrl(url: string, fieldName?: string): ValidationResult
```

#### API Validators

```typescript
validateApiKey(apiKey: string, fieldName?: string): ValidationResult
validateToken(token: string, fieldName?: string): ValidationResult
```

#### File Validators

```typescript
validateFileName(fileName: string, fieldName?: string): ValidationResult
validateMimeType(mimeType: string, fieldName?: string): ValidationResult
validateFileSize(fileSize: number, fieldName?: string, maxSize?: number): ValidationResult
```

**Note**: `validateFileSize` accepts file size in bytes, with a default maximum of 100MB.

#### AI/ML Validators

```typescript
validateModelName(modelName: string, fieldName?: string): ValidationResult
validatePrompt(prompt: string, fieldName?: string): ValidationResult
validateTemperature(temperature: number, fieldName?: string): ValidationResult
validateMaxTokens(maxTokens: number, fieldName?: string): ValidationResult
```

#### UI/UX Validators

```typescript
validateTheme(theme: string, fieldName?: string): ValidationResult
validateLanguage(language: string, fieldName?: string): ValidationResult
validateColor(color: string, fieldName?: string): ValidationResult
```

#### Utility Validators

```typescript
validateNotEmpty(value: unknown, fieldName?: string): ValidationResult
validatePositive(value: number, fieldName?: string): ValidationResult
validateRange(value: number, min: number, max: number, fieldName?: string): ValidationResult
```

#### Advanced Validators

```typescript
validatePasswordStrength(
  password: string,
  rules?: ValidationRules
): PasswordStrength

validateUrlSecurity(url: string): { isValid: boolean; sanitized?: string }
```

## Advanced Usage

### Custom Validators

```typescript
import { createCustomSchema, ValidationUtils } from "reynard-validation";

const customValidator = createCustomSchema(
  value => {
    if (typeof value !== "string") {
      return { isValid: false, error: "Must be a string" };
    }

    if (value.length < 10) {
      return { isValid: false, error: "Must be at least 10 characters" };
    }

    return { isValid: true };
  },
  { errorMessage: "Custom validation failed" }
);

const result = ValidationUtils.validateValue("short", customValidator);
```

### Schema Builders

```typescript
import { createStringSchema, createNumberSchema, createEnumSchema } from "reynard-validation";

const stringSchema = createStringSchema({
  required: true,
  minLength: 5,
  maxLength: 50,
  pattern: /^[a-zA-Z0-9_]+$/,
  errorMessage: "Must be 5-50 alphanumeric characters",
});

const numberSchema = createNumberSchema({
  required: true,
  min: 0,
  max: 100,
  errorMessage: "Must be between 0 and 100",
});

const enumSchema = createEnumSchema(["light", "dark", "auto"], { errorMessage: "Must be light, dark, or auto" });
```

### Error Handling

```typescript
import { ValidationError, ValidationUtils } from "reynard-validation";

try {
  const result = ValidationUtils.validateValue("invalid", CommonSchemas.email, {
    fieldName: "email",
    context: { field: "email", value: "invalid", constraint: "email" },
    strict: true,
  });
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(error.field); // "email"
    console.log(error.value); // "invalid"
    console.log(error.constraint); // "email"
    console.log(error.context); // Full context object
  }
}
```

## Migration Guide

### From `reynard-core` validation

```typescript
// Old
import { isValidUsername, isValidEmail } from "reynard-core";

// New
import { validateUsername, validateEmail } from "reynard-validation";

// Old usage
const isValid = isValidUsername("john_doe");

// New usage
const result = validateUsername("john_doe");
const isValid = result.isValid;
```

### From `reynard-connection` validation

```typescript
// Old
import { ValidationUtils as ConnectionValidationUtils } from "reynard-connection";

// New
import { ValidationUtils } from "reynard-validation";

// API is the same, just import from the new package
```

### From `reynard-auth` validation

```typescript
// Old
import { validatePassword, validateEmail } from "reynard-auth";

// New
import { validatePassword, validateEmail } from "reynard-validation";

// API is compatible, just update imports
```

## Performance Considerations

- **Lazy Evaluation**: Validation only runs when needed
- **Early Returns**: Validation stops on first error by default
- **Optimized Regex**: All patterns are pre-compiled for performance
- **Minimal Allocations**: Reuses objects where possible
- **Tree Shaking**: Only imports what you use

## Security Features

- **URL Security**: Validates URLs for security threats
- **Password Strength**: Comprehensive password strength analysis
- **File Validation**: Secure filename and MIME type validation
- **Input Sanitization**: Built-in input sanitization for common attack vectors
- **XSS Prevention**: Validates against common XSS patterns
- **Contagious Interview Attack Detection**: Automatically detects base64-encoded JSON storage URLs used for malware delivery
  - Detects malicious patterns in config files
  - Identifies known IOCs from threat intelligence
  - Validates against known malicious JSON storage services

### Security Validators

The validation package includes specialized security validators to detect the **Contagious Interview** campaign attack vector:

```typescript
import { SecurityValidators, ValidationUtils } from 'reynard-validation';

// Automatic detection (enabled by default)
const result = ValidationUtils.validateValue(
  'aHR0cHM6Ly9qc29ua2VlcGVyLmNvbS9iL0dOT1g0',
  { type: 'string' },
  { fieldName: 'API_KEY' }
);
// Automatically detects base64-encoded JSON storage URL

// Config file validation
const configContent = 'API_KEY=aHR0cHM6Ly9qc29ua2VlcGVyLmNvbS9iL0dOT1g0\n';
const securityCheck = ValidationUtils.validateConfigFileSecurity(configContent, {
  strict: true  // Fail on any threat
});
```

**See:** [Security Validators Documentation](./docs/security-validators.md)

## Testing

```typescript
import { describe, it, expect } from "vitest";
import { validateEmail, validatePassword } from "reynard-validation";

describe("Validation", () => {
  it("should validate email addresses", () => {
    expect(validateEmail("user@example.com").isValid).toBe(true);
    expect(validateEmail("invalid").isValid).toBe(false);
  });

  it("should validate passwords", () => {
    expect(validatePassword("SecurePass123!").isValid).toBe(true);
    expect(validatePassword("weak").isValid).toBe(false);
  });
});
```

## Contributing

When adding new validators:

1. Add the validator function to `src/utils.ts`
2. Add the schema to `src/schemas.ts` if it's a common pattern
3. Export from `src/index.ts`
4. Add tests in `src/__tests__/`
5. Update this README

## Additional Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) directory:

### Core Documentation

- **[Core Validation Engine](./docs/core-validation.md)**: The central `ValidationUtils` class and core validation methods
  - `validateValue()` - Single value validation
  - `validateFields()` - Multi-field validation
  - `validateOrThrow()` - Exception-based validation
  - `validateConfigFileSecurity()` - Security validation

### Validation Tools

- **[Utility Validators](./docs/utility-validators.md)**: Standalone validation functions for common use cases
  - Basic, API, File, Configuration, AI/ML, UI/UX, and Advanced validators
  - Complete API reference with examples for all 20+ validators

- **[Validator Classes](./docs/validator-classes.md)**: Internal validator classes for specialized validation
  - `StringValidators`, `NumberValidators`, `ArrayValidators`
  - Direct usage examples and integration patterns

### Schema System

- **[Schema System](./docs/schema-system.md)**: Pre-built schemas and schema builders
  - `CommonSchemas` - 20+ predefined field validation schemas
  - `FormSchemas` - Complete form validation schemas
  - Schema builders for creating custom validation schemas

### Specialized Features

- **[JSON Remediation](./docs/json-remediation.md)**: JSON syntax fixing and package.json validation
  - `JsonRemediator` and `JsonRemediatorFinal` classes
  - Utility functions: `fixJsonSyntax`, `fixPackageJson`
  - CLI usage and integration examples
  - Error types and handling

- **[Security Validators](./docs/security-validators.md)**: Security validation for detecting malicious patterns
  - Contagious Interview attack detection
  - Base64-encoded JSON storage URL detection
  - Config file security validation
  - Known IOC detection

### Documentation Index

- **[Documentation Index](./docs/README.md)**: Complete documentation index and navigation guide

## Version

Current version: **1.0.0**

## Support

For issues, questions, or contributions, please visit the [Reynard repository](https://github.com/reynard/reynard).

## License

MIT License - see LICENSE file for details.
