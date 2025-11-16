# Validation Package Documentation

Comprehensive documentation for the Reynard validation package. This documentation covers all validation tools, schemas, and utilities available in the package.

## Overview

The `reynard-validation` package provides a unified validation system for the entire Reynard ecosystem. It consolidates all validation logic into a single, consistent, and powerful validation system with full TypeScript support, comprehensive error handling, and advanced features like JSON remediation and security validation.

## Quick Start

```typescript
import { validateEmail, validatePassword, ValidationUtils, CommonSchemas } from "reynard-validation";

// Simple validation
const emailResult = validateEmail("user@example.com");
console.log(emailResult.isValid); // true

// Schema-based validation
const result = ValidationUtils.validateValue("user@example.com", CommonSchemas.email);

// Form validation
const formData = { email: "user@example.com", password: "SecurePass123!" };
const formResult = ValidationUtils.validateFields(formData, {
  email: CommonSchemas.email,
  password: CommonSchemas.password,
});
```

## Documentation Index

### Core Documentation

- **[Core Validation Engine](./core-validation.md)** - The central `ValidationUtils` class and core validation methods
  - `validateValue()` - Single value validation
  - `validateFields()` - Multi-field validation
  - `validateOrThrow()` - Exception-based validation
  - `validateConfigFileSecurity()` - Security validation

### Validation Tools

- **[Utility Validators](./utility-validators.md)** - Standalone validation functions for common use cases
  - Basic validators: `validateEmail`, `validatePassword`, `validateUsername`, `validateUrl`
  - API validators: `validateApiKey`, `validateToken`
  - File validators: `validateFileName`, `validateMimeType`, `validateFileSize`
  - Configuration validators: `validatePort`, `validateTimeout`, `validateRetryCount`
  - AI/ML validators: `validateModelName`, `validatePrompt`, `validateTemperature`, `validateMaxTokens`
  - UI/UX validators: `validateTheme`, `validateLanguage`, `validateColor`
  - Utility validators: `validateNotEmpty`, `validatePositive`, `validateRange`
  - Advanced validators: `validatePasswordStrength`, `validateUrlSecurity`

- **[Validator Classes](./validator-classes.md)** - Internal validator classes for specialized validation
  - `StringValidators` - Email, URL, phone, filename, MIME type, color validation
  - `NumberValidators` - Min, max, integer, positive, negative validation
  - `ArrayValidators` - Length, uniqueness, item validation

### Schema System

- **[Schema System](./schema-system.md)** - Pre-built schemas and schema builders
  - `CommonSchemas` - Individual field validation schemas (email, password, username, url, etc.)
  - `FormSchemas` - Complete form validation schemas (login, registration, profile, etc.)
  - Schema builders: `createStringSchema`, `createNumberSchema`, `createEnumSchema`, `createCustomSchema`

### Specialized Features

- **[JSON Remediation](./json-remediation.md)** - JSON syntax fixing and package.json validation
  - `JsonRemediator` and `JsonRemediatorFinal` classes
  - Utility functions: `fixJsonSyntax`, `fixPackageJson`
  - CLI usage and integration examples
  - Error types and handling

- **[Security Validators](./security-validators.md)** - Security validation for detecting malicious patterns
  - Contagious Interview attack detection
  - Base64-encoded JSON storage URL detection
  - Config file security validation
  - Known IOC detection

## Getting Started

### Installation

```bash
pnpm add reynard-validation
```

### Basic Usage

```typescript
import { validateEmail, validatePassword } from "reynard-validation";

// Simple validation
const emailResult = validateEmail("user@example.com");
if (emailResult.isValid) {
  console.log("Email is valid");
} else {
  console.log("Email error:", emailResult.error);
}

// Password validation
const passwordResult = validatePassword("SecurePass123!");
if (!passwordResult.isValid) {
  console.log("Password errors:", passwordResult.errors);
}
```

### Schema-Based Validation

```typescript
import { ValidationUtils, CommonSchemas } from "reynard-validation";

// Using predefined schemas
const result = ValidationUtils.validateValue("user@example.com", CommonSchemas.email, {
  fieldName: "email",
});

// Custom schema
const customSchema = {
  type: "string" as const,
  required: true,
  minLength: 5,
  maxLength: 50,
  pattern: /^[a-zA-Z0-9_]+$/,
  errorMessage: "Username must be 5-50 alphanumeric characters",
};

const customResult = ValidationUtils.validateValue("john_doe", customSchema, {
  fieldName: "username",
});
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

## Documentation Structure

```
docs/
├── README.md (this file)
├── core-validation.md - Core validation engine documentation
├── utility-validators.md - Standalone validation functions
├── validator-classes.md - Internal validator classes
├── schema-system.md - Pre-built schemas and schema builders
├── json-remediation.md - JSON syntax fixing tools
└── security-validators.md - Security validation features
```

## Common Use Cases

### Form Validation

See [Core Validation Engine](./core-validation.md) for form validation examples using `validateFields()`.

### API Request Validation

See [Utility Validators](./utility-validators.md) for API configuration validation examples.

### Custom Validation

See [Schema System](./schema-system.md) for creating custom validation schemas.

### JSON File Fixing

See [JSON Remediation](./json-remediation.md) for fixing malformed JSON files.

### Security Validation

See [Security Validators](./security-validators.md) for detecting security threats in config files.

## Performance Considerations

All validation tools are optimized for performance:

- **Time Complexity**: O(1) for basic validators, O(n) for complex schemas
- **Memory Usage**: O(1) constant space for most operations
- **Tree Shaking**: Only imports what you use
- **Optimized Regex**: All patterns are pre-compiled

## TypeScript Support

The validation package provides full TypeScript support with comprehensive type definitions:

- Type-safe validation schemas
- Type inference for validation results
- IntelliSense support in IDEs
- Compile-time type checking

## See Also

- [Main README](../README.md) - Package overview and installation
- [Core Validation Engine](./core-validation.md) - Core validation utilities
- [Utility Validators](./utility-validators.md) - Standalone validation functions
- [Validator Classes](./validator-classes.md) - Internal validator implementations
- [Schema System](./schema-system.md) - Pre-built schemas and schema builders
- [JSON Remediation](./json-remediation.md) - JSON syntax fixing tools
- [Security Validators](./security-validators.md) - Security validation features

## Contributing

When contributing to the validation package:

1. Follow the existing documentation style
2. Include TypeScript code examples
3. Add "See Also" sections linking related documentation
4. Update this index when adding new documentation files

## License

MIT License - see LICENSE file for details.

