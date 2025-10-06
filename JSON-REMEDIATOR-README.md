# 🦊 JSON Syntax Remediator

A comprehensive JSON syntax error detection and remediation system for the Reynard validation package.

## Overview

The JSON Remediator is a sophisticated tool designed to automatically detect and fix common JSON syntax errors, particularly those found in `package.json` files throughout the Reynard monorepo. It provides both programmatic APIs and command-line tools for JSON validation and remediation.

## Features

### 🔧 Automatic Error Detection

- **Missing Commas**: Detects and fixes missing commas after property values
- **Trailing Commas**: Removes trailing commas before closing braces/brackets
- **Missing Quotes**: Adds quotes around unquoted property names
- **Malformed Structures**: Fixes missing closing braces and brackets
- **Invalid Escapes**: Corrects invalid escape sequences

### 📦 Package.json Specific Validation

- **Required Fields**: Validates presence of `name` and `version` fields
- **Version Format**: Ensures semantic versioning compliance
- **Structure Validation**: Validates package.json specific structure

### 🛠️ Multiple Interfaces

- **TypeScript API**: Programmatic access with full type safety
- **CLI Tools**: Command-line utilities for batch processing
- **Utility Functions**: Simple one-liner functions for quick fixes

## Installation

The JSON Remediator is part of the `reynard-validation` package:

```bash
pnpm add reynard-validation
```

## Usage

### TypeScript API

```typescript
import { JsonRemediator, fixJsonSyntax, fixPackageJson } from "reynard-validation";

// Create a remediator instance
const remediator = new JsonRemediator();

// Fix general JSON syntax errors
const result = remediator.remediate(malformedJson);
if (result.success) {
  console.log("Fixed JSON:", result.fixedJson);
  console.log("Errors fixed:", result.errors.length);
}

// Fix package.json specifically
const packageResult = remediator.remediatePackageJson(packageJsonContent);

// Quick utility functions
const fixedJson = fixJsonSyntax(malformedJson);
const fixedPackageJson = fixPackageJson(packageJsonContent);
```

### CLI Usage

```bash
# Check a single file
pnpm --filter reynard-validation json:check package.json

# Fix a single file
pnpm --filter reynard-validation json:fix package.json

# Fix all package.json files in the project
pnpm --filter reynard-validation json:fix-all
```

### Direct Script Usage

```bash
# Navigate to the validation package
cd packages/core/validation

# Test the remediator on a file
node simple-test.js

# Fix all package.json files
node fix-all-package-jsons.js
```

## Common Error Patterns

### 1. Missing Commas After Property Values

**Before:**

```json
{
  "name": "my-package"
  "version": "1.0.0"
  "description": "My package"
}
```

**After:**

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "description": "My package"
}
```

### 2. Trailing Commas

**Before:**

```json
{
  "name": "my-package",
  "version": "1.0.0"
}
```

**After:**

```json
{
  "name": "my-package",
  "version": "1.0.0"
}
```

### 3. Missing Quotes Around Property Names

**Before:**

```json
{
  "name": "my-package",
  "version": "1.0.0"
}
```

**After:**

```json
{
  "name": "my-package",
  "version": "1.0.0"
}
```

### 4. Missing Closing Braces/Brackets

**Before:**

```json
{
  "name": "my-package",
  "dependencies": {
    "react": "18.0.0"
```

**After:**

```json
{
  "name": "my-package",
  "dependencies": {
    "react": "18.0.0"
  }
}
```

## API Reference

### JsonRemediator Class

#### `remediate(jsonString: string): JsonRemediationResult`

Fixes common JSON syntax errors in a string.

**Parameters:**

- `jsonString`: The malformed JSON string to fix

**Returns:**

- `success`: Whether the remediation was successful
- `fixedJson`: The fixed JSON string (if successful)
- `errors`: Array of errors that were fixed
- `unfixableErrors`: Array of errors that couldn't be fixed

#### `remediatePackageJson(packageJsonContent: string): JsonRemediationResult`

Fixes JSON syntax errors specifically in package.json files, with additional validation.

**Parameters:**

- `packageJsonContent`: The package.json content to fix

**Returns:** Same as `remediate()`, but with package.json specific validations.

### Utility Functions

#### `fixJsonSyntax(jsonString: string): string`

Quick utility function to fix JSON syntax errors.

#### `fixPackageJson(packageJsonContent: string): string`

Quick utility function to fix package.json files specifically.

## Error Types

The remediator can detect and fix the following error types:

- `missing-comma`: Missing comma after property value
- `trailing-comma`: Trailing comma before closing brace/bracket
- `missing-quote`: Missing quotes around property name
- `invalid-escape`: Invalid escape sequence
- `malformed-object`: Missing closing brace
- `malformed-array`: Missing closing bracket
- `missing-field`: Missing required package.json field
- `invalid-version`: Invalid version format

## Integration with Reynard

The JSON Remediator is integrated into the Reynard validation package and can be used in several ways:

### 1. Build Process Integration

Add to your build scripts:

```json
{
  "scripts": {
    "prebuild": "pnpm --filter reynard-validation json:fix-all",
    "build": "vite build"
  }
}
```

### 2. Pre-commit Hooks

Use with git hooks to ensure all package.json files are valid:

```bash
#!/bin/sh
pnpm --filter reynard-validation json:check
```

### 3. CI/CD Integration

Add to your CI pipeline:

```yaml
- name: Validate JSON
  run: pnpm --filter reynard-validation json:check
```

## Performance

The JSON Remediator is optimized for performance:

- **Fast Processing**: Processes large JSON files quickly
- **Memory Efficient**: Minimal memory footprint
- **Batch Processing**: Efficiently handles multiple files
- **Incremental Fixes**: Only processes files that need fixing

## Limitations

While the JSON Remediator handles most common JSON syntax errors, it has some limitations:

1. **Complex Nested Structures**: Very deeply nested or complex structures may not be fully handled
2. **Custom Syntax**: Non-standard JSON extensions are not supported
3. **Semantic Errors**: Only fixes syntax errors, not semantic issues
4. **Large Files**: Very large JSON files (>10MB) may take longer to process

## Contributing

To contribute to the JSON Remediator:

1. Fork the Reynard repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## Testing

Run the test suite:

```bash
cd packages/core/validation
pnpm test
```

## License

Part of the Reynard framework, licensed under MIT.

---

_Created by Cunning-Prime-7, your strategic fox specialist_ 🦊
