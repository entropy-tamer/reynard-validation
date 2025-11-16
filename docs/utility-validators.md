# Utility Validators

Comprehensive collection of validation utility functions for common use cases. These functions provide convenient, standalone validation for specific data types and formats commonly used in web applications and APIs.

## Overview

All utility functions return `ValidationResult` objects with detailed error information and are optimized for high-performance validation scenarios. They provide a simple, convenient API for validating individual values without needing to define schemas manually.

## Installation

```bash
pnpm add reynard-validation
```

## Import

```typescript
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validateUrl,
  // ... other validators
} from "reynard-validation";
```

## Basic Validators

### `validateEmail(email, fieldName?)`

Validates an email address format and structure. Performs comprehensive email validation including format checking, domain validation, and length constraints.

**Parameters:**

- `email` (string): The email address to validate
- `fieldName` (string, optional, default: "email"): Name of the field for error messages

**Returns:** `ValidationResult`

**Example:**

```typescript
import { validateEmail } from "reynard-validation";

const result = validateEmail("user@example.com");
if (result.isValid) {
  console.log("Email is valid");
} else {
  console.log("Email error:", result.error);
}

// With custom field name
const result2 = validateEmail("invalid-email", "contactEmail");
// result2.error: "contactEmail must be a valid email address"
```

**Performance:** O(1) time complexity, O(1) memory usage

### `validatePassword(password, fieldName?)`

Validates a password for strength and security requirements. Performs comprehensive password validation including length checks, character requirements (uppercase, lowercase, numbers, special characters), and common password security patterns.

**Parameters:**

- `password` (string): The password to validate
- `fieldName` (string, optional, default: "password"): Name of the field for error messages

**Returns:** `ValidationResult`

**Example:**

```typescript
import { validatePassword } from "reynard-validation";

const result = validatePassword("SecurePass123!");
if (result.isValid) {
  console.log("Password is valid");
} else {
  console.log("Password errors:", result.errors);
}

// Weak password
const weakResult = validatePassword("weak");
// weakResult.errors: ["Password must be 8-128 characters with uppercase, lowercase, number, and special character"]
```

**Requirements:**

- Minimum 8 characters
- Maximum 128 characters
- Must contain uppercase letter
- Must contain lowercase letter
- Must contain number
- Must contain special character

**Performance:** O(1) time complexity, O(1) memory usage

### `validateUsername(username, fieldName?)`

Validates a username format and constraints. Validates usernames according to common standards, ensuring they contain only allowed characters (letters, numbers, hyphens, underscores) and meet length requirements.

**Parameters:**

- `username` (string): The username to validate
- `fieldName` (string, optional, default: "username"): Name of the field for error messages

**Returns:** `ValidationResult`

**Example:**

```typescript
import { validateUsername } from "reynard-validation";

const result = validateUsername("user123");
if (result.isValid) {
  console.log("Username is valid");
} else {
  console.log("Username error:", result.error);
}

// Invalid username
const invalidResult = validateUsername("user@name");
// invalidResult.error: "Username must be 3-30 characters with only letters, numbers, hyphens, and underscores"
```

**Requirements:**

- Minimum 3 characters
- Maximum 30 characters
- Only letters, numbers, hyphens, and underscores

**Performance:** O(1) time complexity, O(1) memory usage

### `validateUrl(url, fieldName?)`

Validates a URL format and structure. Performs comprehensive URL validation including protocol checking, domain validation, and format verification. Supports both HTTP and HTTPS protocols.

**Parameters:**

- `url` (string): The URL to validate
- `fieldName` (string, optional, default: "url"): Name of the field for error messages

**Returns:** `ValidationResult`

**Example:**

```typescript
import { validateUrl } from "reynard-validation";

const result = validateUrl("https://example.com");
if (result.isValid) {
  console.log("URL is valid");
} else {
  console.log("URL error:", result.error);
}

// Invalid URL
const invalidResult = validateUrl("not-a-url");
// invalidResult.error: "Please enter a valid URL"
```

**Requirements:**

- Must be a valid URL format
- Must use HTTP or HTTPS protocol

**Performance:** O(1) time complexity, O(1) memory usage

### `validateValue(value, schema, fieldName?)`

Validates any value against a validation schema. This is a generic validation function that accepts any value type and validates it against a provided validation schema.

**Parameters:**

- `value` (unknown): The value to validate (can be any type)
- `schema` (ValidationSchema): The validation schema defining the rules and constraints
- `fieldName` (string, optional, default: "field"): Name of the field for error messages

**Returns:** `ValidationResult`

**Example:**

```typescript
import { validateValue } from "reynard-validation";

// Validate a string
const result1 = validateValue("user@example.com", {
  type: "email",
  required: true
}, "email");

// Validate a number
const result2 = validateValue(42, {
  type: "number",
  min: 0,
  max: 100
}, "age");

// Validate an array
const result3 = validateValue([1, 2, 3], {
  type: "array",
  minLength: 1,
  maxLength: 10
}, "items");
```

**Performance:** O(1) for basic validations, O(n) for complex schemas

## API Validators

### `validateApiKey(apiKey, fieldName?)`

Validates an API key format and security requirements. Validates that an API key meets common security standards, including minimum length requirements and allowed character sets.

**Parameters:**

- `apiKey` (string): The API key string to validate
- `fieldName` (string, optional, default: "apiKey"): Name of the field for error messages

**Returns:** `ValidationResult`

**Example:**

```typescript
import { validateApiKey } from "reynard-validation";

const result = validateApiKey("sk-1234567890abcdef");
if (result.isValid) {
  console.log("API key is valid");
} else {
  console.log("API key errors:", result.errors);
}

// Invalid API key
const invalidResult = validateApiKey("key with spaces");
// invalidResult.error: "API key must be 10-256 characters with only letters, numbers, underscores, and hyphens"
```

**Requirements:**

- Minimum 10 characters
- Maximum 256 characters
- Only alphanumeric characters, underscores, and hyphens

**Performance:** O(1) time complexity, O(1) memory usage

### `validateToken(token, fieldName?)`

Validates an authentication token format and minimum length requirements. Validates that an authentication token meets security requirements, including minimum length to ensure sufficient entropy.

**Parameters:**

- `token` (string): The authentication token string to validate
- `fieldName` (string, optional, default: "token"): Name of the field for error messages

**Returns:** `ValidationResult`

**Example:**

```typescript
import { validateToken } from "reynard-validation";

const result = validateToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...");
if (result.isValid) {
  console.log("Token is valid");
} else {
  console.log("Token errors:", result.errors);
}

// Invalid token (too short)
const invalidResult = validateToken("short");
// invalidResult.error: "Token must be 20-512 characters"
```

**Requirements:**

- Minimum 20 characters
- Maximum 512 characters

**Performance:** O(1) time complexity, O(1) memory usage

## File Validators

### `validateFileName(fileName, fieldName?)`

Validates a filename format ensuring it doesn't contain invalid filesystem characters. Validates that a filename is safe to use across different operating systems by checking for invalid characters.

**Parameters:**

- `fileName` (string): The filename string to validate
- `fieldName` (string, optional, default: "fileName"): Name of the field for error messages

**Returns:** `ValidationResult`

**Example:**

```typescript
import { validateFileName } from "reynard-validation";

const result = validateFileName("my-document.pdf");
if (result.isValid) {
  console.log("Filename is valid");
} else {
  console.log("Filename errors:", result.errors);
}

// Invalid filename
const invalidResult = validateFileName("file<>name.txt");
// invalidResult.error: "Filename cannot contain invalid characters"
```

**Requirements:**

- Minimum 1 character
- Maximum 255 characters
- No invalid filesystem characters

**Performance:** O(1) time complexity, O(1) memory usage

### `validateMimeType(mimeType, fieldName?)`

Validates a MIME type format according to RFC 2045 standards. Validates that a MIME type string follows the proper format: `type/subtype` where both type and subtype contain only allowed characters.

**Parameters:**

- `mimeType` (string): The MIME type string to validate (e.g., "application/json")
- `fieldName` (string, optional, default: "mimeType"): Name of the field for error messages

**Returns:** `ValidationResult`

**Example:**

```typescript
import { validateMimeType } from "reynard-validation";

const result = validateMimeType("application/json");
if (result.isValid) {
  console.log("MIME type is valid");
} else {
  console.log("MIME type errors:", result.errors);
}

// Common valid MIME types
validateMimeType("text/html");        // Valid
validateMimeType("image/png");        // Valid
validateMimeType("application/pdf");   // Valid
```

**Requirements:**

- Must follow RFC 2045 MIME type format
- Format: `type/subtype`

**Performance:** O(1) time complexity, O(1) memory usage

### `validateFileSize(fileSize, fieldName?, maxSize?)`

Validates file size against maximum size constraints. Validates that a file size (in bytes) is within acceptable limits, preventing oversized files.

**Parameters:**

- `fileSize` (number): The file size in bytes to validate
- `fieldName` (string, optional, default: "fileSize"): Name of the field for error messages
- `maxSize` (number, optional, default: 100MB): Maximum allowed file size in bytes

**Returns:** `ValidationResult`

**Example:**

```typescript
import { validateFileSize } from "reynard-validation";

// Validate with default 100MB limit
const result1 = validateFileSize(50 * 1024 * 1024); // 50MB
if (result1.isValid) {
  console.log("File size is acceptable");
}

// Validate with custom limit
const result2 = validateFileSize(200 * 1024 * 1024, "upload", 50 * 1024 * 1024);
// Will fail if file is larger than 50MB
```

**Requirements:**

- Must be a number
- Must be between 0 and maxSize (default: 100MB)

**Performance:** O(1) time complexity, O(1) memory usage

## Configuration Validators

### `validatePort(port, fieldName?)`

Validates a network port number within the valid TCP/UDP port range. Validates that a port number is within the standard range of 1-65535.

**Parameters:**

- `port` (number): The port number to validate (must be between 1 and 65535)
- `fieldName` (string, optional, default: "port"): Name of the field for error messages

**Returns:** `ValidationResult`

**Example:**

```typescript
import { validatePort } from "reynard-validation";

const result = validatePort(8080);
if (result.isValid) {
  console.log("Port is valid");
} else {
  console.log("Port errors:", result.errors);
}

// Common valid ports
validatePort(80);    // HTTP - Valid
validatePort(443);   // HTTPS - Valid
validatePort(3000);  // Development server - Valid
validatePort(0);     // Invalid (reserved)
validatePort(70000); // Invalid (out of range)
```

**Requirements:**

- Must be between 1 and 65535
- Port 0 is reserved and not allowed

**Performance:** O(1) time complexity, O(1) memory usage

### `validateTimeout(timeout, fieldName?)`

Validates a timeout value in milliseconds within reasonable bounds. Validates that a timeout value is within acceptable limits (1 second to 5 minutes by default).

**Parameters:**

- `timeout` (number): The timeout value in milliseconds to validate
- `fieldName` (string, optional, default: "timeout"): Name of the field for error messages

**Returns:** `ValidationResult`

**Example:**

```typescript
import { validateTimeout } from "reynard-validation";

const result = validateTimeout(5000); // 5 seconds
if (result.isValid) {
  console.log("Timeout is valid");
} else {
  console.log("Timeout errors:", result.errors);
}

// Common timeout values
validateTimeout(1000);   // 1 second - Valid
validateTimeout(30000);  // 30 seconds - Valid
validateTimeout(500);    // Invalid (too short)
validateTimeout(600000); // Invalid (too long)
```

**Requirements:**

- Must be between 1000ms (1 second) and 300000ms (5 minutes)

**Performance:** O(1) time complexity, O(1) memory usage

### `validateRetryCount(retryCount, fieldName?)`

Validates a retry count value within acceptable limits. Validates that a retry count is within reasonable bounds (0-10) to prevent excessive retry attempts.

**Parameters:**

- `retryCount` (number): The retry count to validate (must be between 0 and 10)
- `fieldName` (string, optional, default: "retryCount"): Name of the field for error messages

**Returns:** `ValidationResult`

**Example:**

```typescript
import { validateRetryCount } from "reynard-validation";

const result = validateRetryCount(3);
if (result.isValid) {
  console.log("Retry count is valid");
} else {
  console.log("Retry count errors:", result.errors);
}

// Common retry counts
validateRetryCount(0);  // No retries - Valid
validateRetryCount(3);  // Standard retry - Valid
validateRetryCount(5);  // Moderate retry - Valid
validateRetryCount(15); // Invalid (exceeds maximum)
```

**Requirements:**

- Must be between 0 and 10
- 0 means no retries will be attempted

**Performance:** O(1) time complexity, O(1) memory usage

## AI/ML Validators

### `validateModelName(modelName, fieldName?)`

Validates an AI/ML model name format and constraints. Validates that a model name follows common naming conventions for machine learning models.

**Parameters:**

- `modelName` (string): The model name string to validate (e.g., "gpt-4", "claude-3-opus")
- `fieldName` (string, optional, default: "modelName"): Name of the field for error messages

**Returns:** `ValidationResult`

**Example:**

```typescript
import { validateModelName } from "reynard-validation";

const result = validateModelName("gpt-4");
if (result.isValid) {
  console.log("Model name is valid");
} else {
  console.log("Model name errors:", result.errors);
}

// Common model names
validateModelName("gpt-4");           // Valid
validateModelName("claude-3-opus");   // Valid
validateModelName("llama-2-70b");     // Valid
validateModelName("model@name");      // Invalid (contains @)
```

**Requirements:**

- Only letters, numbers, dots, underscores, and hyphens
- Meets length requirements

**Performance:** O(1) time complexity, O(1) memory usage

### `validatePrompt(prompt, fieldName?)`

Validates a prompt string for AI/ML model inputs. Validates that a prompt string meets length requirements and is suitable for use with AI models.

**Parameters:**

- `prompt` (string): The prompt string to validate
- `fieldName` (string, optional, default: "prompt"): Name of the field for error messages

**Returns:** `ValidationResult`

**Example:**

```typescript
import { validatePrompt } from "reynard-validation";

const result = validatePrompt("What is the capital of France?");
if (result.isValid) {
  console.log("Prompt is valid");
} else {
  console.log("Prompt errors:", result.errors);
}

// Valid prompts
validatePrompt("Hello, world!");        // Valid
validatePrompt("Explain quantum computing"); // Valid

// Invalid prompts
validatePrompt("");                     // Invalid (empty)
validatePrompt("x".repeat(20000));      // Invalid (too long)
```

**Requirements:**

- Must be non-empty
- Must be within reasonable length limits

**Performance:** O(1) time complexity, O(1) memory usage

### `validateTemperature(temperature, fieldName?)`

Validates a temperature parameter for AI/ML model configuration. Validates that a temperature value is within the standard range (0-2) used by most AI models.

**Parameters:**

- `temperature` (number): The temperature value to validate (must be between 0 and 2)
- `fieldName` (string, optional, default: "temperature"): Name of the field for error messages

**Returns:** `ValidationResult`

**Example:**

```typescript
import { validateTemperature } from "reynard-validation";

const result = validateTemperature(0.7);
if (result.isValid) {
  console.log("Temperature is valid");
} else {
  console.log("Temperature errors:", result.errors);
}

// Common temperature values
validateTemperature(0);    // Deterministic - Valid
validateTemperature(0.7);  // Balanced - Valid
validateTemperature(1.0);  // Standard - Valid
validateTemperature(2.0);  // Maximum creativity - Valid
validateTemperature(3.0);  // Invalid (exceeds maximum)
```

**Requirements:**

- Must be between 0 and 2
- 0 is deterministic, higher values are more creative

**Performance:** O(1) time complexity, O(1) memory usage

### `validateMaxTokens(maxTokens, fieldName?)`

Validates a max tokens parameter for AI/ML model configuration. Validates that a max tokens value is within reasonable bounds (1-100,000) to prevent excessive token generation.

**Parameters:**

- `maxTokens` (number): The max tokens value to validate (must be between 1 and 100,000)
- `fieldName` (string, optional, default: "maxTokens"): Name of the field for error messages

**Returns:** `ValidationResult`

**Example:**

```typescript
import { validateMaxTokens } from "reynard-validation";

const result = validateMaxTokens(1000);
if (result.isValid) {
  console.log("Max tokens is valid");
} else {
  console.log("Max tokens errors:", result.errors);
}

// Common max tokens values
validateMaxTokens(100);    // Short response - Valid
validateMaxTokens(1000);   // Standard response - Valid
validateMaxTokens(4000);   // Long response - Valid
validateMaxTokens(0);      // Invalid (must be at least 1)
validateMaxTokens(200000); // Invalid (exceeds maximum)
```

**Requirements:**

- Must be between 1 and 100,000
- Controls maximum length of generated response

**Performance:** O(1) time complexity, O(1) memory usage

## UI/UX Validators

### `validateTheme(theme, fieldName?)`

Validates a theme name against allowed theme values. Validates that a theme name is one of the standard theme options (light, dark, or auto).

**Parameters:**

- `theme` (string): The theme name to validate (must be "light", "dark", or "auto")
- `fieldName` (string, optional, default: "theme"): Name of the field for error messages

**Returns:** `ValidationResult`

**Example:**

```typescript
import { validateTheme } from "reynard-validation";

const result = validateTheme("dark");
if (result.isValid) {
  console.log("Theme is valid");
} else {
  console.log("Theme errors:", result.errors);
}

// Valid themes
validateTheme("light");  // Valid
validateTheme("dark");   // Valid
validateTheme("auto");   // Valid

// Invalid themes
validateTheme("blue");   // Invalid (not in enum)
validateTheme("custom"); // Invalid (not in enum)
```

**Requirements:**

- Must be one of: "light", "dark", or "auto"

**Performance:** O(1) time complexity, O(1) memory usage

### `validateLanguage(language, fieldName?)`

Validates a language/locale code format. Validates that a language code follows standard locale format (e.g., "en", "en-US", "fr-CA").

**Parameters:**

- `language` (string): The language code to validate (e.g., "en", "en-US", "fr")
- `fieldName` (string, optional, default: "language"): Name of the field for error messages

**Returns:** `ValidationResult`

**Example:**

```typescript
import { validateLanguage } from "reynard-validation";

const result = validateLanguage("en-US");
if (result.isValid) {
  console.log("Language code is valid");
} else {
  console.log("Language code errors:", result.errors);
}

// Valid language codes
validateLanguage("en");      // Valid (2 characters)
validateLanguage("en-US");    // Valid (locale format)
validateLanguage("fr-CA");    // Valid (locale format)

// Invalid language codes
validateLanguage("e");        // Invalid (too short)
validateLanguage("english");  // Invalid (too long, not a code)
```

**Requirements:**

- Must be 2-5 characters
- Follows ISO 639-1 and ISO 3166-1 alpha-2 standards

**Performance:** O(1) time complexity, O(1) memory usage

### `validateColor(color, fieldName?)`

Validates a color value in various formats (hex, RGB, HSL). Validates that a color string is in a valid format that can be used in CSS or other color contexts.

**Parameters:**

- `color` (string): The color string to validate
- `fieldName` (string, optional, default: "color"): Name of the field for error messages

**Returns:** `ValidationResult`

**Example:**

```typescript
import { validateColor } from "reynard-validation";

const result = validateColor("#FF5733");
if (result.isValid) {
  console.log("Color is valid");
} else {
  console.log("Color errors:", result.errors);
}

// Valid color formats
validateColor("#FF5733");                    // Hex - Valid
validateColor("rgb(255, 87, 51)");           // RGB - Valid
validateColor("hsl(9, 100%, 60%)");          // HSL - Valid

// Invalid colors
validateColor("red");                         // Invalid (not a valid format)
validateColor("#GG5733");                    // Invalid (invalid hex)
```

**Requirements:**

- Must be in hex (#RRGGBB), RGB (rgb(r, g, b)), or HSL (hsl(h, s%, l%)) format

**Performance:** O(1) time complexity, O(1) memory usage

## Utility Validators

### `validateNotEmpty(value, fieldName?)`

Validates that a value is not empty (null, undefined, or empty string). Provides a simple check to ensure a value has been provided and is not empty.

**Parameters:**

- `value` (unknown): The value to validate (can be any type)
- `fieldName` (string, optional, default: "field"): Name of the field for error messages

**Returns:** `ValidationResult`

**Example:**

```typescript
import { validateNotEmpty } from "reynard-validation";

const result = validateNotEmpty("Hello");
if (result.isValid) {
  console.log("Value is not empty");
} else {
  console.log("Value is empty");
}

// Valid values
validateNotEmpty("text");     // Valid
validateNotEmpty(0);          // Valid (0 is not empty)
validateNotEmpty(false);      // Valid (false is not empty)
validateNotEmpty([]);         // Valid (empty array is not considered empty)

// Invalid values
validateNotEmpty("");         // Invalid (empty string)
validateNotEmpty(null);       // Invalid
validateNotEmpty(undefined);  // Invalid
```

**Performance:** O(1) time complexity, O(1) memory usage

### `validatePositive(value, fieldName?)`

Validates that a value is a positive number (greater than zero). Ensures that a numeric value is positive, which is useful for quantities, counts, prices, and other values that must be greater than zero.

**Parameters:**

- `value` (number): The number to validate (must be greater than 0)
- `fieldName` (string, optional, default: "field"): Name of the field for error messages

**Returns:** `ValidationResult`

**Example:**

```typescript
import { validatePositive } from "reynard-validation";

const result = validatePositive(42);
if (result.isValid) {
  console.log("Value is positive");
} else {
  console.log("Value is not positive");
}

// Valid values
validatePositive(1);      // Valid
validatePositive(100);   // Valid
validatePositive(0.5);  // Valid

// Invalid values
validatePositive(0);     // Invalid (zero is not positive)
validatePositive(-5);    // Invalid (negative)
validatePositive(-0.1);  // Invalid (negative)
```

**Performance:** O(1) time complexity, O(1) memory usage

### `validateRange(value, min, max, fieldName?)`

Validates that a numeric value is within a specified range (inclusive). Ensures that a number falls within a defined range, which is useful for validating values like ages, percentages, scores, and other bounded numeric inputs.

**Parameters:**

- `value` (number): The number to validate
- `min` (number): Minimum allowed value (inclusive)
- `max` (number): Maximum allowed value (inclusive)
- `fieldName` (string, optional, default: "field"): Name of the field for error messages

**Returns:** `ValidationResult`

**Example:**

```typescript
import { validateRange } from "reynard-validation";

const result = validateRange(25, 18, 120);
if (result.isValid) {
  console.log("Value is within range");
} else {
  console.log("Value is out of range");
}

// Valid values
validateRange(25, 18, 120);  // Valid (within range)
validateRange(18, 18, 120); // Valid (at minimum)
validateRange(120, 18, 120); // Valid (at maximum)

// Invalid values
validateRange(15, 18, 120); // Invalid (below minimum)
validateRange(150, 18, 120); // Invalid (above maximum)
```

**Performance:** O(1) time complexity, O(1) memory usage

## Advanced Validators

### `validatePasswordStrength(password, rules?)`

Validates password strength with comprehensive feedback and scoring. Performs detailed password strength analysis, checking multiple criteria including length, character variety, and providing a strength score and feedback.

**Parameters:**

- `password` (string): The password string to validate
- `rules` (ValidationRules, optional): Validation rules configuration
  - `minLength` (number, default: 8): Minimum password length
  - `requireUppercase` (boolean, default: true): Require uppercase letters
  - `requireLowercase` (boolean, default: true): Require lowercase letters
  - `requireNumber` (boolean, default: true): Require numeric characters
  - `requireSpecialChar` (boolean, default: true): Require special characters

**Returns:** `PasswordStrength` object with:
- `isValid` (boolean): Whether password meets all requirements
- `score` (number): Strength score (0-5)
- `feedback` ("weak" | "medium" | "strong" | "very-strong"): Strength level
- `suggestions` (string[]): Array of improvement suggestions

**Example:**

```typescript
import { validatePasswordStrength } from "reynard-validation";

const result = validatePasswordStrength("SecurePass123!");
if (result.isValid) {
  console.log("Password strength:", result.feedback);
  console.log("Score:", result.score);
} else {
  console.log("Password suggestions:", result.suggestions);
}

// Strong password
const strong = validatePasswordStrength("MyStr0ng!P@ss");
// Returns: { isValid: true, score: 5, feedback: "very-strong", suggestions: [] }

// Weak password
const weak = validatePasswordStrength("password");
// Returns: { isValid: false, score: 1, feedback: "weak", suggestions: [...] }
```

**Performance:** O(n) where n is password length, O(1) memory usage

### `validateUrlSecurity(url)`

Validates a URL for security concerns and returns a sanitized version. Performs security-focused URL validation, checking for allowed protocols, private/localhost addresses, and suspicious patterns.

**Parameters:**

- `url` (string): The URL string to validate

**Returns:** Object with:
- `isValid` (boolean): Whether URL is safe
- `sanitized` (string | undefined): Sanitized URL if valid

**Example:**

```typescript
import { validateUrlSecurity } from "reynard-validation";

const result = validateUrlSecurity("https://example.com");
if (result.isValid) {
  console.log("Safe URL:", result.sanitized);
} else {
  console.log("URL is not safe");
}

// Safe URLs
validateUrlSecurity("https://example.com");  // Valid
validateUrlSecurity("http://api.example.com"); // Valid

// Unsafe URLs (blocked)
validateUrlSecurity("javascript:alert(1)");  // Invalid (dangerous protocol)
validateUrlSecurity("http://localhost");    // Invalid (localhost blocked)
validateUrlSecurity("http://192.168.1.1");  // Invalid (private IP blocked)
```

**Security Checks:**

- Only allows HTTP and HTTPS protocols
- Blocks localhost and private IP addresses
- Blocks suspicious patterns (javascript:, data:, etc.)
- Returns sanitized URL with trailing slash if missing

**Performance:** O(1) time complexity, O(1) memory usage

## Common Usage Patterns

### Form Validation

```typescript
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "reynard-validation";

function validateRegistrationForm(email: string, password: string, username: string) {
  const emailResult = validateEmail(email);
  const passwordResult = validatePassword(password);
  const usernameResult = validateUsername(username);

  return {
    isValid: emailResult.isValid && passwordResult.isValid && usernameResult.isValid,
    errors: [
      ...(emailResult.errors || []),
      ...(passwordResult.errors || []),
      ...(usernameResult.errors || []),
    ],
  };
}
```

### API Configuration Validation

```typescript
import {
  validateUrl,
  validatePort,
  validateTimeout,
  validateApiKey,
} from "reynard-validation";

function validateApiConfig(config: {
  apiUrl: string;
  port: number;
  timeout: number;
  apiKey: string;
}) {
  const urlResult = validateUrl(config.apiUrl);
  const portResult = validatePort(config.port);
  const timeoutResult = validateTimeout(config.timeout);
  const apiKeyResult = validateApiKey(config.apiKey);

  return {
    isValid: urlResult.isValid && portResult.isValid && timeoutResult.isValid && apiKeyResult.isValid,
    errors: [
      ...(urlResult.errors || []),
      ...(portResult.errors || []),
      ...(timeoutResult.errors || []),
      ...(apiKeyResult.errors || []),
    ],
  };
}
```

### AI Model Configuration Validation

```typescript
import {
  validateModelName,
  validatePrompt,
  validateTemperature,
  validateMaxTokens,
} from "reynard-validation";

function validateModelConfig(config: {
  modelName: string;
  prompt: string;
  temperature: number;
  maxTokens: number;
}) {
  const modelResult = validateModelName(config.modelName);
  const promptResult = validatePrompt(config.prompt);
  const tempResult = validateTemperature(config.temperature);
  const tokensResult = validateMaxTokens(config.maxTokens);

  return {
    isValid: modelResult.isValid && promptResult.isValid && tempResult.isValid && tokensResult.isValid,
    errors: [
      ...(modelResult.errors || []),
      ...(promptResult.errors || []),
      ...(tempResult.errors || []),
      ...(tokensResult.errors || []),
    ],
  };
}
```

## Performance Considerations

All utility validators are optimized for performance:

- **Time Complexity**: O(1) for most validators, O(n) for complex patterns
- **Memory Usage**: O(1) constant space for all operations
- **Validation Speed**: Optimized for high-frequency validation scenarios
- **Tree Shaking**: Only imports what you use

## See Also

- [Core Validation Engine](./core-validation.md) - Core validation utilities
- [Validator Classes](./validator-classes.md) - Internal validator implementations
- [Schema System](./schema-system.md) - Pre-built schemas and schema builders
- [Security Validators](./security-validators.md) - Security validation features

