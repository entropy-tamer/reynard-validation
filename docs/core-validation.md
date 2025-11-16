# Core Validation Engine

The `ValidationUtils` class is the central validation engine for the Reynard validation system. It provides comprehensive validation capabilities including schema-based validation, type checking, and multi-field validation.

## Overview

The `ValidationUtils` class serves as the main validation engine, providing static methods for validating individual values, multiple fields, and throwing validation errors when needed. It integrates with specialized validators for strings, numbers, arrays, and security validation.

## Installation

```bash
pnpm add reynard-validation
```

## Import

```typescript
import { ValidationUtils } from "reynard-validation";
```

## Methods

### `validateValue(value, schema, options?)`

Validates a single value against a validation schema. This is the core validation method that performs comprehensive validation including type checking, format validation, length constraints, and custom validation rules.

**Parameters:**

- `value` (unknown): The value to validate
- `schema` (ValidationSchema): The validation schema defining the rules
- `options` (FieldValidationOptions, optional): Additional validation options
  - `fieldName` (string, default: "field"): Name of the field for error messages
  - `context` (ValidationErrorContext, optional): Additional context for error reporting
  - `strict` (boolean, default: false): Whether to use strict validation mode

**Returns:** `ValidationResult` containing:

- `isValid` (boolean): Whether validation passed
- `errors` (string[]): Array of error messages
- `error` (string | undefined): First error message (for convenience)
- `field` (string | undefined): Field name
- `value` (unknown | undefined): The validated value

**Example:**

```typescript
import { ValidationUtils } from "reynard-validation";

// Basic validation
const result = ValidationUtils.validateValue("user@example.com", {
  type: "email",
  required: true,
});

if (result.isValid) {
  console.log("Validation passed");
} else {
  console.log("Validation failed:", result.errors);
}

// With custom field name
const result2 = ValidationUtils.validateValue("invalid-email", {
  type: "email",
  required: true,
}, {
  fieldName: "contactEmail"
});
// result2.errors: ["contactEmail must be a valid email address"]

// With context
const result3 = ValidationUtils.validateValue("test", {
  type: "string",
  minLength: 5,
}, {
  fieldName: "username",
  context: {
    field: "username",
    value: "test",
    constraint: "minLength",
    timestamp: new Date().toISOString(),
    source: "form-validation"
  }
});
```

**Performance Characteristics:**

- Time complexity: O(1) for basic validations, O(n) for complex schemas
- Memory usage: O(1) constant space
- Supports custom validators and complex validation rules

### `validateFields(data, schemas, options?)`

Validates multiple fields against their respective schemas. This method performs batch validation of multiple fields, returning comprehensive results for each field and overall validation status.

**Parameters:**

- `data` (Record<string, unknown>): Object containing the field values to validate
- `schemas` (Record<string, ValidationSchema>): Object mapping field names to their validation schemas
- `options` (object, optional): Validation options
  - `strict` (boolean, default: false): If true, unknown fields will cause validation errors

**Returns:** `MultiValidationResult` containing:

- `isValid` (boolean): Whether all fields passed validation
- `results` (Record<string, ValidationResult>): Individual validation results for each field
- `errors` (string[]): Aggregated array of all error messages

**Example:**

```typescript
import { ValidationUtils } from "reynard-validation";

const formData = {
  email: "user@example.com",
  password: "SecurePass123!",
  age: 25,
};

const schemas = {
  email: {
    type: "email",
    required: true,
  },
  password: {
    type: "password",
    required: true,
    minLength: 8,
  },
  age: {
    type: "number",
    required: true,
    min: 18,
    max: 120,
  },
};

const result = ValidationUtils.validateFields(formData, schemas);

if (result.isValid) {
  console.log("All fields are valid");
} else {
  console.log("Validation errors:", result.errors);
  // Access individual field results
  console.log("Email result:", result.results.email);
  console.log("Password result:", result.results.password);
}
```

**Strict Mode:**

When `strict: true` is enabled, unknown fields (not in the schemas object) will cause validation errors:

```typescript
const result = ValidationUtils.validateFields(
  { email: "user@example.com", unknownField: "value" },
  { email: { type: "email", required: true } },
  { strict: true }
);
// result.errors will include: ["Unknown field: unknownField"]
```

**Performance Characteristics:**

- Time complexity: O(n) where n is the number of fields
- Memory usage: O(n) for storing results
- Supports strict mode for unknown fields

### `validateOrThrow(value, schema, options?)`

Validates a value and throws a `ValidationError` if validation fails. This method provides a convenient way to validate values and immediately throw an error if validation fails, useful for scenarios where validation failure should immediately halt execution.

**Parameters:**

- `value` (unknown): The value to validate
- `schema` (ValidationSchema): The validation schema defining the rules
- `options` (FieldValidationOptions, optional): Additional validation options

**Throws:** `ValidationError` when validation fails

**Example:**

```typescript
import { ValidationUtils, ValidationError } from "reynard-validation";

try {
  ValidationUtils.validateOrThrow("user@example.com", {
    type: "email",
    required: true,
  });
  console.log("Validation passed");
} catch (error) {
  if (error instanceof ValidationError) {
    console.log("Validation failed:", error.message);
    console.log("Field:", error.field);
    console.log("Value:", error.value);
    console.log("Context:", error.context);
  }
}

// With custom field name
try {
  ValidationUtils.validateOrThrow("invalid-email", {
    type: "email",
    required: true,
  }, {
    fieldName: "contactEmail"
  });
} catch (error) {
  if (error instanceof ValidationError) {
    // error.message: "contactEmail must be a valid email address"
    // error.field: "contactEmail"
    // error.context contains full validation context
  }
}
```

**Performance Characteristics:**

- Time complexity: O(1) for basic validations, O(n) for complex schemas
- Memory usage: O(1) constant space
- Throws immediately on first validation failure

### `validateConfigFileSecurity(content, options?)`

Validates config file content for security threats. This method scans config file content for malicious patterns, including base64-encoded JSON storage URLs from the Contagious Interview campaign.

**Parameters:**

- `content` (string): Config file content to validate
- `options` (object, optional): Validation options
  - `strict` (boolean, default: false): If true, fail validation on any threat

**Returns:** `ValidationResult` containing:

- `isValid` (boolean): Whether no security threats were detected
- `errors` (string[]): Array of security threat descriptions
- `error` (string | undefined): First security threat description

**Example:**

```typescript
import { ValidationUtils } from "reynard-validation";

const configContent = `
API_KEY=aHR0cHM6Ly9qc29ua2VlcGVyLmNvbS9iL0dOT1g0
DATABASE_URL=postgresql://localhost/db
`;

// Basic security check
const result = ValidationUtils.validateConfigFileSecurity(configContent);

if (!result.isValid) {
  console.log("Security threats detected:", result.errors);
}

// Strict mode - fail on any threat
const strictResult = ValidationUtils.validateConfigFileSecurity(configContent, {
  strict: true
});

if (!strictResult.isValid) {
  throw new Error(`Security threats detected: ${strictResult.errors.join(", ")}`);
}
```

**Security Features:**

- Detects base64-encoded JSON storage URLs
- Identifies known malicious indicators from threat intelligence
- Validates against known malicious JSON storage services
- Scans for suspicious patterns in config files

**See Also:** [Security Validators](./security-validators.md) for detailed security validation documentation.

## Validation Schema

The `ValidationSchema` type defines the structure for validation rules:

```typescript
type ValidationSchema = {
  type: "string" | "number" | "boolean" | "object" | "array" | 
        "email" | "url" | "phone" | "ip" | "hex-color" | 
        "username" | "password" | "api-key" | "token" | 
        "filename" | "mime-type" | "port" | "timeout" | 
        "model-name" | "prompt" | "temperature" | "max-tokens" | 
        "theme" | "language" | "color";
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  enum?: unknown[];
  errorMessage?: string;
  customValidator?: (value: unknown, context?: ValidationErrorContext) => ValidationResult;
  securityCheck?: boolean; // Default: true for string types
};
```

## Validation Result Types

### `ValidationResult`

```typescript
type ValidationResult = {
  isValid: boolean;
  error?: string;
  field?: string;
  value?: unknown;
  errors?: string[];
};
```

### `MultiValidationResult`

```typescript
type MultiValidationResult = {
  isValid: boolean;
  results: Record<string, ValidationResult>;
  errors: string[];
};
```

### `ValidationError`

```typescript
class ValidationError extends Error {
  field: string;
  value: unknown;
  constraint: string;
  context: ValidationErrorContext;
}
```

## Usage Patterns

### Form Validation

```typescript
import { ValidationUtils } from "reynard-validation";

function validateLoginForm(email: string, password: string) {
  const result = ValidationUtils.validateFields(
    { email, password },
    {
      email: {
        type: "email",
        required: true,
      },
      password: {
        type: "password",
        required: true,
        minLength: 8,
      },
    }
  );

  return result;
}
```

### API Request Validation

```typescript
import { ValidationUtils } from "reynard-validation";

function validateApiRequest(data: unknown) {
  try {
    ValidationUtils.validateOrThrow(data, {
      type: "object",
      required: true,
    });

    if (typeof data === "object" && data !== null) {
      return ValidationUtils.validateFields(
        data as Record<string, unknown>,
        {
          userId: { type: "string", required: true },
          action: { type: "string", required: true, enum: ["create", "update", "delete"] },
        }
      );
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      return { isValid: false, errors: [error.message] };
    }
    throw error;
  }
}
```

### Conditional Validation

```typescript
import { ValidationUtils } from "reynard-validation";

function validateUserInput(value: unknown, isRequired: boolean) {
  const schema = {
    type: "string" as const,
    required: isRequired,
    minLength: 3,
    maxLength: 50,
  };

  return ValidationUtils.validateValue(value, schema, {
    fieldName: "userInput",
  });
}
```

### Custom Validator

```typescript
import { ValidationUtils } from "reynard-validation";

const customSchema = {
  type: "string" as const,
  required: true,
  customValidator: (value: unknown) => {
    if (typeof value !== "string") {
      return { isValid: false, error: "Must be a string" };
    }
    if (value.length < 10) {
      return { isValid: false, error: "Must be at least 10 characters" };
    }
    return { isValid: true };
  },
};

const result = ValidationUtils.validateValue("short", customSchema);
```

## Security Validation

Security validation is automatically enabled for all string validations. To disable it:

```typescript
const result = ValidationUtils.validateValue(value, {
  type: "string",
  securityCheck: false, // Disable security validation
}, {
  fieldName: "API_KEY"
});
```

## Performance Considerations

- **Lazy Evaluation**: Validation only runs when needed
- **Early Returns**: Validation stops on first error by default
- **Optimized Regex**: All patterns are pre-compiled for performance
- **Minimal Allocations**: Reuses objects where possible
- **Tree Shaking**: Only imports what you use

## Integration with Other Validators

The `ValidationUtils` class integrates with specialized validators:

- **StringValidators**: Email, URL, phone, filename, MIME type, color validation
- **NumberValidators**: Min, max, integer, positive, negative validation
- **ArrayValidators**: Length, uniqueness, item validation
- **SecurityValidators**: Security threat detection

## See Also

- [Utility Validators](./utility-validators.md) - Standalone validation functions
- [Validator Classes](./validator-classes.md) - Internal validator implementations
- [Schema System](./schema-system.md) - Pre-built schemas and schema builders
- [Security Validators](./security-validators.md) - Security validation features
