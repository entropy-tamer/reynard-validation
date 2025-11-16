# Schema System

Comprehensive collection of pre-built validation schemas and schema builders for creating custom validation schemas. The schema system provides a foundation for consistent validation across the entire Reynard ecosystem.

## Overview

The schema system is organized into three main categories:

- **CommonSchemas**: Individual field validation schemas for common data types
- **FormSchemas**: Complete form validation schemas for typical application forms
- **Schema Builders**: Utility functions for creating custom validation schemas

## Installation

```bash
pnpm add reynard-validation
```

## CommonSchemas

Collection of pre-built validation schemas for common data types and formats. Each schema is optimized for performance and provides clear, user-friendly error messages.

### Import

```typescript
import { CommonSchemas } from "reynard-validation";
```

### Available Schemas

#### `email`

Email address validation schema.

```typescript
CommonSchemas.email
// {
//   type: "email",
//   required: true,
//   errorMessage: "Please enter a valid email address"
// }
```

**Example:**

```typescript
import { ValidationUtils, CommonSchemas } from "reynard-validation";

const result = ValidationUtils.validateValue("user@example.com", CommonSchemas.email);
```

#### `password`

Password validation schema with strength requirements.

```typescript
CommonSchemas.password
// {
//   type: "password",
//   required: true,
//   minLength: 8,
//   maxLength: 128,
//   errorMessage: "Password must be 8-128 characters with uppercase, lowercase, number, and special character"
// }
```

**Requirements:**

- Minimum 8 characters
- Maximum 128 characters
- Must contain uppercase, lowercase, number, and special character

#### `username`

Username validation schema.

```typescript
CommonSchemas.username
// {
//   type: "username",
//   required: true,
//   minLength: 3,
//   maxLength: 30,
//   errorMessage: "Username must be 3-30 characters with only letters, numbers, hyphens, and underscores"
// }
```

**Requirements:**

- Minimum 3 characters
- Maximum 30 characters
- Only letters, numbers, hyphens, and underscores

#### `url`

URL validation schema.

```typescript
CommonSchemas.url
// {
//   type: "url",
//   required: true,
//   errorMessage: "Please enter a valid URL"
// }
```

**Requirements:**

- Must be a valid URL format
- Must use HTTP or HTTPS protocol

#### `apiKey`

API key validation schema.

```typescript
CommonSchemas.apiKey
// {
//   type: "api-key",
//   required: true,
//   minLength: 10,
//   maxLength: 256,
//   errorMessage: "API key must be 10-256 characters with only letters, numbers, underscores, and hyphens"
// }
```

**Requirements:**

- Minimum 10 characters
- Maximum 256 characters
- Only alphanumeric characters, underscores, and hyphens

#### `token`

Authentication token validation schema.

```typescript
CommonSchemas.token
// {
//   type: "token",
//   required: true,
//   minLength: 20,
//   maxLength: 512,
//   errorMessage: "Token must be 20-512 characters"
// }
```

**Requirements:**

- Minimum 20 characters
- Maximum 512 characters

#### `filename`

Filename validation schema.

```typescript
CommonSchemas.filename
// {
//   type: "filename",
//   required: true,
//   minLength: 1,
//   maxLength: 255,
//   errorMessage: "Filename cannot contain invalid characters"
// }
```

**Requirements:**

- Minimum 1 character
- Maximum 255 characters
- No invalid filesystem characters

#### `mimeType`

MIME type validation schema.

```typescript
CommonSchemas.mimeType
// {
//   type: "mime-type",
//   required: true,
//   errorMessage: "Must be a valid MIME type"
// }
```

**Requirements:**

- Must follow RFC 2045 MIME type format
- Format: `type/subtype`

#### `port`

Network port validation schema.

```typescript
CommonSchemas.port
// {
//   type: "port",
//   required: true,
//   min: 1,
//   max: 65535,
//   errorMessage: "Port must be between 1 and 65535"
// }
```

**Requirements:**

- Must be between 1 and 65535

#### `timeout`

Timeout validation schema.

```typescript
CommonSchemas.timeout
// {
//   type: "timeout",
//   required: true,
//   min: 1000,
//   max: 300000,
//   errorMessage: "Timeout must be between 1 second and 5 minutes"
// }
```

**Requirements:**

- Must be between 1000ms (1 second) and 300000ms (5 minutes)

#### `modelName`

AI/ML model name validation schema.

```typescript
CommonSchemas.modelName
// {
//   type: "model-name",
//   required: true,
//   minLength: 1,
//   maxLength: 100,
//   errorMessage: "Model name must be 1-100 characters with only letters, numbers, dots, underscores, and hyphens"
// }
```

**Requirements:**

- Minimum 1 character
- Maximum 100 characters
- Only letters, numbers, dots, underscores, and hyphens

#### `prompt`

AI prompt validation schema.

```typescript
CommonSchemas.prompt
// {
//   type: "prompt",
//   required: true,
//   minLength: 1,
//   maxLength: 10000,
//   errorMessage: "Prompt must be 1-10000 characters"
// }
```

**Requirements:**

- Minimum 1 character
- Maximum 10000 characters

#### `temperature`

AI temperature parameter validation schema.

```typescript
CommonSchemas.temperature
// {
//   type: "temperature",
//   required: true,
//   min: 0,
//   max: 2,
//   errorMessage: "Temperature must be between 0 and 2"
// }
```

**Requirements:**

- Must be between 0 and 2

#### `maxTokens`

AI max tokens parameter validation schema.

```typescript
CommonSchemas.maxTokens
// {
//   type: "max-tokens",
//   required: true,
//   min: 1,
//   max: 100000,
//   errorMessage: "Max tokens must be between 1 and 100000"
// }
```

**Requirements:**

- Must be between 1 and 100000

#### `theme`

Theme validation schema.

```typescript
CommonSchemas.theme
// {
//   type: "theme",
//   required: true,
//   enum: ["light", "dark", "auto"],
//   errorMessage: "Theme must be light, dark, or auto"
// }
```

**Allowed Values:** `"light"`, `"dark"`, `"auto"`

#### `language`

Language/locale code validation schema.

```typescript
CommonSchemas.language
// {
//   type: "language",
//   required: true,
//   minLength: 2,
//   maxLength: 5,
//   errorMessage: "Language must be a valid locale code (e.g., 'en' or 'en-US')"
// }
```

**Requirements:**

- Minimum 2 characters
- Maximum 5 characters
- Follows ISO 639-1 and ISO 3166-1 alpha-2 standards

#### `color`

Color validation schema.

```typescript
CommonSchemas.color
// {
//   type: "color",
//   required: true,
//   errorMessage: "Color must be a valid hex, RGB, or HSL color"
// }
```

**Supported Formats:**

- Hex: `#RRGGBB`
- RGB: `rgb(r, g, b)`
- HSL: `hsl(h, s%, l%)`

#### `phone`

Phone number validation schema.

```typescript
CommonSchemas.phone
// {
//   type: "phone",
//   required: true,
//   errorMessage: "Must be a valid phone number"
// }
```

#### `ip`

IP address validation schema.

```typescript
CommonSchemas.ip
// {
//   type: "ip",
//   required: true,
//   errorMessage: "Must be a valid IP address"
// }
```

#### `hexColor`

Hex color validation schema.

```typescript
CommonSchemas.hexColor
// {
//   type: "hex-color",
//   required: true,
//   errorMessage: "Must be a valid hex color"
// }
```

#### `positiveNumber`

Positive number validation schema.

```typescript
CommonSchemas.positiveNumber
// {
//   type: "number",
//   required: true,
//   min: 0,
//   errorMessage: "Must be a positive number"
// }
```

#### `nonEmptyString`

Non-empty string validation schema.

```typescript
CommonSchemas.nonEmptyString
// {
//   type: "string",
//   required: true,
//   minLength: 1,
//   errorMessage: "This field cannot be empty"
// }
```

## FormSchemas

Collection of pre-built form validation schemas for common application forms. Each form schema combines multiple CommonSchemas into cohesive form validation configurations.

### Import

```typescript
import { FormSchemas } from "reynard-validation";
```

### Available Form Schemas

#### `login`

Login form validation schema.

```typescript
FormSchemas.login
// {
//   email: CommonSchemas.email,
//   password: CommonSchemas.password
// }
```

**Example:**

```typescript
import { ValidationUtils, FormSchemas } from "reynard-validation";

const loginData = {
  email: "user@example.com",
  password: "SecurePass123!",
};

const result = ValidationUtils.validateFields(loginData, FormSchemas.login);
```

#### `registration`

Registration form validation schema.

```typescript
FormSchemas.registration
// {
//   email: CommonSchemas.email,
//   username: CommonSchemas.username,
//   password: CommonSchemas.password
// }
```

**Example:**

```typescript
const regData = {
  email: "user@example.com",
  username: "user123",
  password: "SecurePass123!",
};

const result = ValidationUtils.validateFields(regData, FormSchemas.registration);
```

#### `profile`

Profile form validation schema.

```typescript
FormSchemas.profile
// {
//   username: CommonSchemas.username,
//   email: CommonSchemas.email
// }
```

#### `settings`

Settings form validation schema.

```typescript
FormSchemas.settings
// {
//   theme: CommonSchemas.theme,
//   language: CommonSchemas.language
// }
```

#### `api`

API configuration form validation schema.

```typescript
FormSchemas.api
// {
//   apiKey: CommonSchemas.apiKey,
//   modelName: CommonSchemas.modelName,
//   temperature: CommonSchemas.temperature,
//   maxTokens: CommonSchemas.maxTokens
// }
```

#### `file`

File upload form validation schema.

```typescript
FormSchemas.file
// {
//   filename: CommonSchemas.filename,
//   mimeType: CommonSchemas.mimeType
// }
```

#### `network`

Network configuration form validation schema.

```typescript
FormSchemas.network
// {
//   url: CommonSchemas.url,
//   port: CommonSchemas.port,
//   timeout: CommonSchemas.timeout
// }
```

## Schema Builders

Utility functions for creating custom validation schemas. These builders provide a convenient way to create schemas with specific constraints when the pre-built schemas don't meet your requirements.

### `createStringSchema(options)`

Creates a custom string validation schema with specified constraints.

**Parameters:**

- `options.required` (boolean, optional, default: true): Whether the field is required
- `options.minLength` (number, optional): Minimum string length
- `options.maxLength` (number, optional): Maximum string length
- `options.pattern` (RegExp, optional): Regular expression pattern for validation
- `options.errorMessage` (string, optional): Custom error message for validation failures

**Returns:** `ValidationSchema` configured for string validation

**Example:**

```typescript
import { createStringSchema, ValidationUtils } from "reynard-validation";

// Create a schema for usernames
const usernameSchema = createStringSchema({
  minLength: 3,
  maxLength: 20,
  pattern: /^[a-zA-Z0-9_]+$/,
  errorMessage: "Username must be 3-20 characters with only letters, numbers, and underscores",
});

const result = ValidationUtils.validateValue("user123", usernameSchema);

// Create a schema for optional descriptions
const descriptionSchema = createStringSchema({
  required: false,
  maxLength: 500,
  errorMessage: "Description cannot exceed 500 characters",
});
```

### `createNumberSchema(options)`

Creates a custom number validation schema with specified constraints.

**Parameters:**

- `options.required` (boolean, optional, default: true): Whether the field is required
- `options.min` (number, optional): Minimum allowed value
- `options.max` (number, optional): Maximum allowed value
- `options.errorMessage` (string, optional): Custom error message for validation failures

**Returns:** `ValidationSchema` configured for number validation

**Example:**

```typescript
import { createNumberSchema, ValidationUtils } from "reynard-validation";

// Create a schema for age validation
const ageSchema = createNumberSchema({
  min: 0,
  max: 150,
  errorMessage: "Age must be between 0 and 150",
});

const result = ValidationUtils.validateValue(25, ageSchema);

// Create a schema for positive numbers only
const positiveSchema = createNumberSchema({
  min: 0,
  errorMessage: "Value must be positive",
});

// Create a schema for optional numeric fields
const optionalSchema = createNumberSchema({
  required: false,
  min: 1,
  max: 100,
});
```

### `createEnumSchema(values, options?)`

Creates a custom enum validation schema with specified allowed values.

**Parameters:**

- `values` (T[]): Array of allowed values for the enum
- `options.required` (boolean, optional, default: true): Whether the field is required
- `options.errorMessage` (string, optional): Custom error message for validation failures

**Returns:** `ValidationSchema` configured for enum validation

**Example:**

```typescript
import { createEnumSchema, ValidationUtils } from "reynard-validation";

// Create a schema for status selection
const statusSchema = createEnumSchema(["active", "inactive", "pending"], {
  errorMessage: "Status must be active, inactive, or pending",
});

const result = ValidationUtils.validateValue("active", statusSchema);

// Create a schema for priority levels
const prioritySchema = createEnumSchema(["low", "medium", "high", "critical"]);

// Create a schema for optional enum fields
const optionalSchema = createEnumSchema(["option1", "option2", "option3"], {
  required: false,
});
```

### `createCustomSchema(validator, options?)`

Creates a custom validation schema with a user-defined validator function.

**Parameters:**

- `validator` (function): Custom validation function that returns validation result
  - `(value: unknown) => { isValid: boolean; error?: string }`
- `options.required` (boolean, optional, default: true): Whether the field is required
- `options.errorMessage` (string, optional): Custom error message for validation failures

**Returns:** `ValidationSchema` configured with custom validation logic

**Example:**

```typescript
import { createCustomSchema, ValidationUtils } from "reynard-validation";

// Create a schema for custom business logic validation
const customSchema = createCustomSchema(
  (value) => {
    if (typeof value !== "string") {
      return { isValid: false, error: "Must be a string" };
    }
    if (value.length < 5) {
      return { isValid: false, error: "Must be at least 5 characters" };
    }
    if (!value.includes("@")) {
      return { isValid: false, error: "Must contain @ symbol" };
    }
    return { isValid: true };
  },
  { errorMessage: "Custom validation failed" }
);

const result = ValidationUtils.validateValue("test@example.com", customSchema);
```

## Schema Composition

You can compose schemas by extending or combining existing schemas:

### Extending CommonSchemas

```typescript
import { CommonSchemas, ValidationUtils } from "reynard-validation";

// Extend a common schema with additional constraints
const extendedEmailSchema = {
  ...CommonSchemas.email,
  minLength: 10, // Add additional constraint
};

const result = ValidationUtils.validateValue("user@example.com", extendedEmailSchema);
```

### Creating Custom Form Schemas

```typescript
import { CommonSchemas, ValidationUtils } from "reynard-validation";

// Create a custom form schema
const customFormSchema = {
  email: CommonSchemas.email,
  username: CommonSchemas.username,
  age: {
    type: "number" as const,
    required: true,
    min: 18,
    max: 120,
    errorMessage: "Age must be between 18 and 120",
  },
};

const formData = {
  email: "user@example.com",
  username: "user123",
  age: 25,
};

const result = ValidationUtils.validateFields(formData, customFormSchema);
```

### Combining Schema Builders

```typescript
import { createStringSchema, createNumberSchema, ValidationUtils } from "reynard-validation";

const userSchema = {
  name: createStringSchema({
    minLength: 2,
    maxLength: 50,
    errorMessage: "Name must be 2-50 characters",
  }),
  age: createNumberSchema({
    min: 0,
    max: 150,
    errorMessage: "Age must be between 0 and 150",
  }),
};

const userData = {
  name: "John Doe",
  age: 30,
};

const result = ValidationUtils.validateFields(userData, userSchema);
```

## Usage Patterns

### Using Pre-built Schemas

```typescript
import { ValidationUtils, CommonSchemas } from "reynard-validation";

// Validate individual fields
const emailResult = ValidationUtils.validateValue("user@example.com", CommonSchemas.email);
const passwordResult = ValidationUtils.validateValue("SecurePass123!", CommonSchemas.password);
```

### Using Form Schemas

```typescript
import { ValidationUtils, FormSchemas } from "reynard-validation";

// Validate complete forms
const loginData = {
  email: "user@example.com",
  password: "SecurePass123!",
};

const result = ValidationUtils.validateFields(loginData, FormSchemas.login);
```

### Creating Custom Schemas

```typescript
import { createStringSchema, createNumberSchema, createEnumSchema } from "reynard-validation";

// Create custom schemas for specific use cases
const productSchema = {
  name: createStringSchema({
    minLength: 3,
    maxLength: 100,
    errorMessage: "Product name must be 3-100 characters",
  }),
  price: createNumberSchema({
    min: 0,
    errorMessage: "Price must be positive",
  }),
  category: createEnumSchema(["electronics", "clothing", "food"], {
    errorMessage: "Category must be electronics, clothing, or food",
  }),
};
```

## Performance Considerations

All schemas are optimized for performance:

- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Optimized Validation**: Pre-compiled patterns and efficient validation logic
- **Memory Efficient**: Minimal memory footprint
- **Tree Shaking**: Only imports what you use

## See Also

- [Core Validation Engine](./core-validation.md) - Core validation utilities that use schemas
- [Utility Validators](./utility-validators.md) - Standalone validation functions
- [Validator Classes](./validator-classes.md) - Internal validator implementations

