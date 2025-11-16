# Validator Classes

Internal validator classes that provide specialized validation methods. These classes are used internally by the core validation engine and can also be used directly for specialized validation scenarios.

## Overview

The validator classes provide static methods for validating specific data types and formats. They follow a consistent pattern where each method:

1. Checks if the value is the correct type (returns early if not)
2. Applies format-specific validation logic
3. Adds error messages to the provided errors array

## Installation

```bash
pnpm add reynard-validation
```

## StringValidators

Collection of static methods for validating specific string formats and patterns.

### Import

```typescript
import { StringValidators } from "reynard-validation";
```

### Methods

#### `validateEmail(value, fieldName, errors, schema)`

Validates an email address format using a comprehensive regex pattern. Checks if the provided string matches a valid email format including proper structure with @ symbol and domain extension.

**Parameters:**

- `value` (unknown): The value to validate (must be a string)
- `fieldName` (string): Name of the field for error messages
- `errors` (string[]): Array to collect validation errors
- `schema` (ValidationSchema): Validation schema (unused in this validator)

**Example:**

```typescript
import { StringValidators } from "reynard-validation";

const errors: string[] = [];
const schema = { type: "string" };

StringValidators.validateEmail("user@example.com", "email", errors, schema);
// errors will be empty if valid

StringValidators.validateEmail("invalid-email", "email", errors, schema);
// errors will contain: ["email must be a valid email address"]
```

**Pattern:** `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

#### `validateUrl(value, fieldName, errors, schema)`

Validates a URL format and protocol using the native URL constructor. Validates that the string is a properly formatted URL and restricts protocols to HTTP and HTTPS only for security reasons.

**Parameters:**

- `value` (unknown): The value to validate (must be a string)
- `fieldName` (string): Name of the field for error messages
- `errors` (string[]): Array to collect validation errors
- `schema` (ValidationSchema): Validation schema (unused in this validator)

**Example:**

```typescript
import { StringValidators } from "reynard-validation";

const errors: string[] = [];
const schema = { type: "string" };

StringValidators.validateUrl("https://example.com", "url", errors, schema);
// errors will be empty if valid

StringValidators.validateUrl("ftp://example.com", "url", errors, schema);
// errors will contain: ["url must be a valid HTTP or HTTPS URL"]
```

**Requirements:**

- Must be a valid URL format
- Protocol must be HTTP or HTTPS only

#### `validatePhone(value, fieldName, errors, schema)`

Validates a phone number format using a flexible regex pattern. Checks if the provided string matches a valid phone number format. The pattern allows for international formats with optional country codes (+), spaces, hyphens, and parentheses for formatting.

**Parameters:**

- `value` (unknown): The value to validate (must be a string)
- `fieldName` (string): Name of the field for error messages
- `errors` (string[]): Array to collect validation errors
- `schema` (ValidationSchema): Validation schema (unused in this validator)

**Example:**

```typescript
import { StringValidators } from "reynard-validation";

const errors: string[] = [];
const schema = { type: "string" };

StringValidators.validatePhone("+1-555-123-4567", "phone", errors, schema);
// errors will be empty if valid

StringValidators.validatePhone("123", "phone", errors, schema);
// errors will contain: ["phone must be a valid phone number"]
```

**Pattern:** `/^\+?[\d\s\-()]{10,}$/`

**Requirements:**

- Minimum 10 digits
- Optional country code prefix (+)
- Allows spaces, hyphens, and parentheses for formatting

#### `validateFilename(value, fieldName, errors, schema)`

Validates a filename format ensuring it doesn't contain invalid characters. Checks that the filename doesn't contain characters that are invalid for file systems, including control characters and special symbols.

**Parameters:**

- `value` (unknown): The value to validate (must be a string)
- `fieldName` (string): Name of the field for error messages
- `errors` (string[]): Array to collect validation errors
- `schema` (ValidationSchema): Validation schema (unused in this validator)

**Example:**

```typescript
import { StringValidators } from "reynard-validation";

const errors: string[] = [];
const schema = { type: "string" };

StringValidators.validateFilename("my-document.pdf", "fileName", errors, schema);
// errors will be empty if valid

StringValidators.validateFilename("file<>name.txt", "fileName", errors, schema);
// errors will contain: ["fileName cannot contain invalid characters"]
```

**Pattern:** `/^[^<>:"/\\|?*\x00-\x1f]+$/`

**Blocked Characters:**

- `< > : " / \ | ? *`
- Control characters (0x00-0x1f)

#### `validateMimeType(value, fieldName, errors, schema)`

Validates a MIME type format according to RFC 2045 standards. Checks if the provided string matches the standard MIME type format: `type/subtype` where both type and subtype contain only allowed characters.

**Parameters:**

- `value` (unknown): The value to validate (must be a string)
- `fieldName` (string): Name of the field for error messages
- `errors` (string[]): Array to collect validation errors
- `schema` (ValidationSchema): Validation schema (unused in this validator)

**Example:**

```typescript
import { StringValidators } from "reynard-validation";

const errors: string[] = [];
const schema = { type: "string" };

StringValidators.validateMimeType("application/json", "mimeType", errors, schema);
// errors will be empty if valid

StringValidators.validateMimeType("invalid/mime", "mimeType", errors, schema);
// errors will contain: ["mimeType must be a valid MIME type"]
```

**Pattern:** `/^[a-zA-Z0-9][a-zA-Z0-9!#$&\-^_]*\/[a-zA-Z0-9][a-zA-Z0-9!#$&\-^_]*$/`

**Format:** `type/subtype` where both parts start with alphanumeric and may contain specific special characters

#### `validateColor(value, fieldName, errors, schema)`

Validates a color value in hex, RGB, or HSL format. Checks if the provided string matches a valid color format.

**Parameters:**

- `value` (unknown): The value to validate (must be a string)
- `fieldName` (string): Name of the field for error messages
- `errors` (string[]): Array to collect validation errors
- `schema` (ValidationSchema): Validation schema (unused in this validator)

**Example:**

```typescript
import { StringValidators } from "reynard-validation";

const errors: string[] = [];
const schema = { type: "string" };

StringValidators.validateColor("#FF5733", "color", errors, schema);
// errors will be empty if valid

StringValidators.validateColor("rgb(255, 87, 51)", "color", errors, schema);
// errors will be empty if valid

StringValidators.validateColor("red", "color", errors, schema);
// errors will contain: ["color must be a valid color"]
```

**Supported Formats:**

- Hex: `#RRGGBB` (6 hexadecimal digits)
- RGB: `rgb(r, g, b)` (three comma-separated numbers)
- HSL: `hsl(h, s%, l%)` (hue, saturation, and lightness percentages)

**Pattern:** `/^#[0-9A-Fa-f]{6}$|^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$|^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/`

## NumberValidators

Collection of static methods for validating number-specific constraints.

### Import

```typescript
import { NumberValidators } from "reynard-validation";
```

### Methods

#### `validateMin(value, fieldName, errors, schema)`

Validates that a number meets the minimum value requirement. Checks if a number is greater than or equal to the specified minimum value.

**Parameters:**

- `value` (unknown): The value to validate (must be a number)
- `fieldName` (string): Name of the field for error messages
- `errors` (string[]): Array to collect validation errors
- `schema` (ValidationSchema): Validation schema containing `min` constraint

**Example:**

```typescript
import { NumberValidators } from "reynard-validation";

const errors: string[] = [];
const schema = { type: "number", min: 18 };

NumberValidators.validateMin(15, "age", errors, schema);
// errors will contain: ["age must be at least 18"]
```

**Schema Property:** `min: number`

#### `validateMax(value, fieldName, errors, schema)`

Validates that a number does not exceed the maximum value requirement. Checks if a number is less than or equal to the specified maximum value.

**Parameters:**

- `value` (unknown): The value to validate (must be a number)
- `fieldName` (string): Name of the field for error messages
- `errors` (string[]): Array to collect validation errors
- `schema` (ValidationSchema): Validation schema containing `max` constraint

**Example:**

```typescript
import { NumberValidators } from "reynard-validation";

const errors: string[] = [];
const schema = { type: "number", max: 100 };

NumberValidators.validateMax(150, "score", errors, schema);
// errors will contain: ["score must be at most 100"]
```

**Schema Property:** `max: number`

#### `validateInteger(value, fieldName, errors, schema)`

Validates that a number is an integer (whole number). Checks if a number is an integer using `Number.isInteger()`.

**Parameters:**

- `value` (unknown): The value to validate (must be a number)
- `fieldName` (string): Name of the field for error messages
- `errors` (string[]): Array to collect validation errors
- `schema` (ValidationSchema): Validation schema with `integer: true` constraint

**Example:**

```typescript
import { NumberValidators } from "reynard-validation";

const errors: string[] = [];
const schema = { type: "number", integer: true };

NumberValidators.validateInteger(3.14, "count", errors, schema);
// errors will contain: ["count must be an integer"]
```

**Schema Property:** `integer: true`

#### `validatePositive(value, fieldName, errors, schema)`

Validates that a number is positive (greater than zero). Checks if a number is greater than zero. Zero and negative numbers will fail validation.

**Parameters:**

- `value` (unknown): The value to validate (must be a number)
- `fieldName` (string): Name of the field for error messages
- `errors` (string[]): Array to collect validation errors
- `schema` (ValidationSchema): Validation schema with `positive: true` constraint

**Example:**

```typescript
import { NumberValidators } from "reynard-validation";

const errors: string[] = [];
const schema = { type: "number", positive: true };

NumberValidators.validatePositive(-5, "quantity", errors, schema);
// errors will contain: ["quantity must be positive"]
```

**Schema Property:** `positive: true`

#### `validateNegative(value, fieldName, errors, schema)`

Validates that a number is negative (less than zero). Checks if a number is less than zero. Zero and positive numbers will fail validation.

**Parameters:**

- `value` (unknown): The value to validate (must be a number)
- `fieldName` (string): Name of the field for error messages
- `errors` (string[]): Array to collect validation errors
- `schema` (ValidationSchema): Validation schema with `negative: true` constraint

**Example:**

```typescript
import { NumberValidators } from "reynard-validation";

const errors: string[] = [];
const schema = { type: "number", negative: true };

NumberValidators.validateNegative(5, "temperature", errors, schema);
// errors will contain: ["temperature must be negative"]
```

**Schema Property:** `negative: true`

## ArrayValidators

Collection of static methods for validating array-specific constraints.

### Import

```typescript
import { ArrayValidators } from "reynard-validation";
```

### Methods

#### `validateMinLength(value, fieldName, errors, schema)`

Validates that an array meets the minimum length requirement. Checks if an array has at least the specified minimum number of items.

**Parameters:**

- `value` (unknown): The value to validate (must be an array)
- `fieldName` (string): Name of the field for error messages
- `errors` (string[]): Array to collect validation errors
- `schema` (ValidationSchema): Validation schema containing `minLength` constraint

**Example:**

```typescript
import { ArrayValidators } from "reynard-validation";

const errors: string[] = [];
const schema = { type: "array", minLength: 3 };

ArrayValidators.validateMinLength([1, 2], "items", errors, schema);
// errors will contain: ["items must have at least 3 items"]
```

**Schema Property:** `minLength: number`

#### `validateMaxLength(value, fieldName, errors, schema)`

Validates that an array does not exceed the maximum length requirement. Checks if an array has at most the specified maximum number of items.

**Parameters:**

- `value` (unknown): The value to validate (must be an array)
- `fieldName` (string): Name of the field for error messages
- `errors` (string[]): Array to collect validation errors
- `schema` (ValidationSchema): Validation schema containing `maxLength` constraint

**Example:**

```typescript
import { ArrayValidators } from "reynard-validation";

const errors: string[] = [];
const schema = { type: "array", maxLength: 2 };

ArrayValidators.validateMaxLength([1, 2, 3], "items", errors, schema);
// errors will contain: ["items must have at most 2 items"]
```

**Schema Property:** `maxLength: number`

#### `validateUnique(value, fieldName, errors, schema)`

Validates that all items in an array are unique (no duplicates). Checks if an array contains only unique values by comparing the array length with the size of a Set created from the array.

**Parameters:**

- `value` (unknown): The value to validate (must be an array)
- `fieldName` (string): Name of the field for error messages
- `errors` (string[]): Array to collect validation errors
- `schema` (ValidationSchema): Validation schema with `unique: true` constraint

**Example:**

```typescript
import { ArrayValidators } from "reynard-validation";

const errors: string[] = [];
const schema = { type: "array", unique: true };

ArrayValidators.validateUnique([1, 2, 2, 3], "items", errors, schema);
// errors will contain: ["items must contain unique values"]
```

**Schema Property:** `unique: true`

**Performance:** Uses Set for O(n) uniqueness check

#### `validateItems(value, fieldName, errors, schema)`

Validates that all items in an array match a specified pattern. Validates each item in the array against a regular expression pattern.

**Parameters:**

- `value` (unknown): The value to validate (must be an array)
- `fieldName` (string): Name of the field for error messages
- `errors` (string[]): Array to collect validation errors
- `schema` (ValidationSchema): Validation schema containing `items` pattern constraint

**Example:**

```typescript
import { ArrayValidators } from "reynard-validation";

const errors: string[] = [];
const schema = { type: "array", items: /^[a-z]+$/ };

ArrayValidators.validateItems(["abc", "def", "123"], "items", errors, schema);
// errors will contain: ["items[2] is invalid"]
```

**Schema Property:** `items: RegExp`

**Note:** Each invalid item gets its own error message with the index: `${fieldName}[${index}] is invalid`

## SecurityValidators

Collection of static methods for security validation. See [Security Validators](./security-validators.md) for comprehensive documentation.

### Import

```typescript
import { SecurityValidators } from "reynard-validation";
```

## Usage Patterns

### Direct Usage

```typescript
import { StringValidators, NumberValidators, ArrayValidators } from "reynard-validation";

const errors: string[] = [];
const schema = { type: "string" };

// Validate email
StringValidators.validateEmail("user@example.com", "email", errors, schema);

// Validate number range
const numberSchema = { type: "number", min: 0, max: 100 };
NumberValidators.validateMin(42, "age", errors, numberSchema);
NumberValidators.validateMax(42, "age", errors, numberSchema);

// Validate array length
const arraySchema = { type: "array", minLength: 2, maxLength: 10 };
ArrayValidators.validateMinLength([1, 2, 3], "items", errors, arraySchema);

if (errors.length > 0) {
  console.log("Validation errors:", errors);
}
```

### Integration with Core Validation

These validators are automatically used by `ValidationUtils` when validating values with appropriate schemas:

```typescript
import { ValidationUtils } from "reynard-validation";

// StringValidators.validateEmail is automatically called
const result = ValidationUtils.validateValue("user@example.com", {
  type: "email",
  required: true,
});

// NumberValidators.validateMin/Max are automatically called
const numberResult = ValidationUtils.validateValue(42, {
  type: "number",
  min: 0,
  max: 100,
});

// ArrayValidators.validateMinLength/MaxLength are automatically called
const arrayResult = ValidationUtils.validateValue([1, 2, 3], {
  type: "array",
  minLength: 2,
  maxLength: 10,
});
```

## Performance Considerations

All validator classes are optimized for performance:

- **Time Complexity**: O(1) for most validators, O(n) for array item validation
- **Memory Usage**: O(1) constant space for most operations, O(n) for uniqueness checks
- **Early Returns**: Validators return early if value type doesn't match
- **No Side Effects**: Validators only add to the errors array, no other side effects

## See Also

- [Core Validation Engine](./core-validation.md) - Core validation utilities that use these validators
- [Utility Validators](./utility-validators.md) - Standalone validation functions
- [Schema System](./schema-system.md) - Pre-built schemas that use these validators
- [Security Validators](./security-validators.md) - Security validation features
