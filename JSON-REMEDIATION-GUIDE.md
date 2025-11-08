# JSON Remediation Guide

🦊 **Strategic JSON Syntax Fixing for the Reynard Ecosystem**

This guide provides comprehensive documentation for the JSON remediation tools in the `reynard-validation` package, designed to maintain clean, valid JSON across the entire Reynard monorepo.

## Overview

The JSON remediation system provides automated fixing of common JSON syntax errors, with special focus on `package.json` files in large monorepos. It's integrated into the Reynard development workflow and precommit hooks.

## Features

- ✅ **Missing Comma Detection**: Automatically adds missing commas between properties
- ✅ **Trailing Comma Removal**: Removes trailing commas before closing brackets/braces
- ✅ **Missing Quote Fixing**: Adds quotes around unquoted property names
- ✅ **Structure Repair**: Fixes missing closing brackets and braces
- ✅ **Package.json Validation**: Special validation for package.json files
- ✅ **CLI Integration**: Command-line tools for batch processing
- ✅ **Precommit Integration**: Automatic checking in git hooks

## Quick Start

### Basic Usage

```typescript
import { JsonRemediatorFinal } from "reynard-validation";

const remediator = new JsonRemediatorFinal();

// Fix malformed JSON
const malformedJson = '{"name": "test" "version": "1.0.0"}';
const result = remediator.remediate(malformedJson);

console.log(result.isValid); // true
console.log(result.fixedJson); // '{"name": "test", "version": "1.0.0"}'
```

### CLI Commands

```bash
# Check all JSON files for syntax errors
pnpm json:check

# Fix a specific JSON file
pnpm json:fix path/to/file.json

# Fix all package.json files in the monorepo
pnpm json:fix-all
```

## Supported Error Types

### 1. Missing Commas

**Problem**: Missing commas between object properties or array elements.

```json
// Before (Invalid)
{
  "name": "test"
  "version": "1.0.0"
  "dependencies": {
    "solid-js": "1.9.9"
    "typescript": "5.9.3"
  }
}

// After (Fixed)
{
  "name": "test",
  "version": "1.0.0",
  "dependencies": {
    "solid-js": "1.9.9",
    "typescript": "5.9.3"
  }
}
```

### 2. Trailing Commas

**Problem**: Trailing commas before closing brackets or braces.

```json
// Before (Invalid)
{
  "name": "test",
  "version": "1.0.0",
  "dependencies": {
    "solid-js": "1.9.9",
  },
}

// After (Fixed)
{
  "name": "test",
  "version": "1.0.0",
  "dependencies": {
    "solid-js": "1.9.9"
  }
}
```

### 3. Missing Quotes

**Problem**: Unquoted property names.

```json
// Before (Invalid)
{
  name: "test",
  version: "1.0.0",
  dependencies: {
    "solid-js": "1.9.9"
  }
}

// After (Fixed)
{
  "name": "test",
  "version": "1.0.0",
  "dependencies": {
    "solid-js": "1.9.9"
  }
}
```

### 4. Malformed Structures

**Problem**: Missing closing brackets or braces.

```json
// Before (Invalid)
{
  "name": "test",
  "dependencies": {
    "solid-js": "1.9.9"
  }

// After (Fixed)
{
  "name": "test",
  "dependencies": {
    "solid-js": "1.9.9"
  }
}
```

## Advanced Usage

### Package.json Specific Validation

```typescript
import { JsonRemediatorFinal } from "reynard-validation";

const remediator = new JsonRemediatorFinal();

// Special package.json validation
const result = remediator.remediatePackageJson(malformedPackageJson);

// Check for unfixable errors
if (result.unfixableErrors.length > 0) {
  console.log("Unfixable errors:", result.unfixableErrors);
  // Common unfixable errors:
  // - Missing required "name" field
  // - Missing required "version" field
  // - Invalid version format
  // - Invalid package name format
}
```

### Error Analysis

```typescript
// Get detailed error information
result.errors.forEach(error => {
  console.log(`Error Type: ${error.type}`);
  console.log(`Description: ${error.description}`);
  console.log(`Location: Line ${error.line}, Column ${error.column}`);
  console.log(`Fix Applied: ${error.fix}`);
});
```

### Batch Processing

```typescript
import { JsonRemediatorFinal } from "reynard-validation";
import { readFileSync, writeFileSync } from "fs";
import { glob } from "glob";

const remediator = new JsonRemediatorFinal();

// Process all package.json files
const packageJsonFiles = await glob("**/package.json", { ignore: "node_modules/**" });

for (const file of packageJsonFiles) {
  const content = readFileSync(file, "utf-8");
  const result = remediator.remediatePackageJson(content);

  if (!result.isValid) {
    console.log(`Fixing ${file}...`);
    writeFileSync(file, result.fixedJson);
  }
}
```

## CLI Reference

### Commands

#### `pnpm json:check`

Checks all JSON files for syntax errors without fixing them.

```bash
# Check all JSON files
pnpm json:check

# Check specific file
pnpm json:check path/to/file.json
```

**Output Example:**

```
🔍 Checking JSON files...
✅ packages/core/validation/package.json - Valid
❌ examples/basic-app/package.json - Invalid: Missing comma at line 5, column 15
✅ packages/ui/components/package.json - Valid
```

#### `pnpm json:fix`

Fixes a specific JSON file.

```bash
# Fix specific file
pnpm json:fix path/to/file.json

# Fix with backup
pnpm json:fix path/to/file.json --backup
```

**Output Example:**

```
🔧 Fixing JSON file: examples/basic-app/package.json
✅ Fixed 2 errors:
  - Added missing comma at line 5, column 15
  - Removed trailing comma at line 12, column 3
💾 File saved successfully
```

#### `pnpm json:fix-all`

Fixes all package.json files in the monorepo.

```bash
# Fix all package.json files
pnpm json:fix-all

# Fix with dry-run (show what would be fixed)
pnpm json:fix-all --dry-run
```

**Output Example:**

```
🔧 Fixing all package.json files...
📁 Found 45 package.json files
✅ Fixed 12 files:
  - examples/basic-app/package.json (2 errors)
  - examples/auth-app/package.json (1 error)
  - packages/core/validation/package.json (3 errors)
  ...
❌ 2 files had unfixable errors:
  - examples/broken-app/package.json (missing required "name" field)
  - packages/invalid/package.json (invalid version format)
```

### CLI Options

| Option      | Description                    | Default |
| ----------- | ------------------------------ | ------- |
| `--check`   | Check mode (don't fix)         | `false` |
| `--all`     | Process all package.json files | `false` |
| `--fix`     | Fix mode (apply fixes)         | `false` |
| `--backup`  | Create backup before fixing    | `false` |
| `--dry-run` | Show what would be fixed       | `false` |
| `--verbose` | Verbose output                 | `false` |

## Integration with Development Workflow

### Precommit Hooks

The JSON remediation tool is integrated into the FOXY precommit system:

```json
{
  "name": "JSON Remediation",
  "command": "pnpm --filter reynard-validation json:check",
  "failOnError": false,
  "timeout": 30000
}
```

### CI/CD Pipeline

Add to your CI pipeline:

```yaml
# .github/workflows/ci.yml
- name: Check JSON Syntax
  run: pnpm json:check
```

### VS Code Integration

Add to your VS Code tasks:

```json
{
  "label": "Check JSON Syntax",
  "type": "shell",
  "command": "pnpm",
  "args": ["json:check"],
  "group": "build"
}
```

## Performance Considerations

- **Regex Optimization**: All patterns are pre-compiled for performance
- **Early Returns**: Stops processing on first unfixable error
- **Minimal Allocations**: Reuses objects where possible
- **Batch Processing**: Efficient handling of multiple files

## Error Handling

### Recoverable Errors

These errors can be automatically fixed:

- Missing commas between properties
- Trailing commas before closing brackets/braces
- Missing quotes around property names
- Missing closing brackets/braces

### Unfixable Errors

These errors require manual intervention:

- Missing required fields (name, version in package.json)
- Invalid version formats
- Invalid package name formats
- Malformed JSON that can't be parsed

### Error Reporting

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

type JsonRemediationResult = {
  success: boolean;
  fixedJson?: string;
  errors: JsonSyntaxError[];
  unfixableErrors: string[];
};
```

## Best Practices

### 1. Regular Maintenance

Run JSON checks regularly:

```bash
# Add to your daily workflow
pnpm json:check
```

### 2. Precommit Integration

Always check JSON before committing:

```bash
# The FOXY system does this automatically
git commit -m "feat: add new feature"
# JSON remediation runs automatically
```

### 3. CI/CD Integration

Include JSON validation in your CI pipeline:

```yaml
- name: Validate JSON
  run: pnpm json:check
```

### 4. Team Workflow

Educate your team about JSON syntax:

- Use proper comma placement
- Quote all property names
- Avoid trailing commas
- Validate before committing

## Troubleshooting

### Common Issues

#### 1. "Cannot parse JSON"

**Problem**: The JSON is too malformed to parse.

**Solution**: Check for:

- Missing quotes around property names
- Unmatched brackets/braces
- Invalid characters

#### 2. "Unfixable errors"

**Problem**: The remediator can't fix certain errors.

**Solution**: Manually fix:

- Missing required fields
- Invalid version formats
- Invalid package names

#### 3. "Still invalid after fix"

**Problem**: The remediator claims to fix but JSON is still invalid.

**Solution**:

- Check for complex nested structures
- Verify regex patterns are working
- Report as a bug with the specific JSON

### Debug Mode

Enable debug mode for detailed output:

```bash
# Enable debug logging
DEBUG=json-remediator pnpm json:fix path/to/file.json
```

## Contributing

When contributing to the JSON remediation system:

1. **Add Tests**: Always add tests for new error types
2. **Update Documentation**: Update this guide for new features
3. **Performance**: Ensure new patterns are optimized
4. **Backwards Compatibility**: Don't break existing functionality

### Adding New Error Types

```typescript
// 1. Add error type to JsonSyntaxError
type JsonSyntaxError = {
  type: "missing-comma" | "trailing-comma" | "missing-quote" | "malformed-structure" | "invalid-package-json" | "new-error-type";
  // ... rest of type
};

// 2. Add fix method to JsonRemediatorFinal
private fixNewErrorType(json: string): string {
  // Implementation
}

// 3. Add to remediate method
const fixed = this.fixNewErrorType(fixed);
```

## License

MIT License - see LICENSE file for details.

---
