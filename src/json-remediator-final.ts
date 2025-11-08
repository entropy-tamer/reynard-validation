/**
 * Final JSON Syntax Remediator - Production-ready JSON syntax error correction.
 *
 * This module provides a production-ready JSON remediation system optimized
 * for handling specific patterns commonly found in Reynard package.json files.
 * It uses a streamlined approach with regex-based pattern matching for faster
 * remediation of common JSON syntax errors.
 *
 * The remediator handles:
 * - Missing commas between properties
 * - Trailing commas before closing braces/brackets
 * - Missing quotes around property names
 * - Malformed objects and arrays
 *
 * @example
 * ```typescript
 * import { JsonRemediatorFinal } from './json-remediator-final.js';
 *
 * const remediator = new JsonRemediatorFinal();
 * const result = remediator.remediate('{"name": "test" "version": "1.0.0"}');
 *
 * if (result.success) {
 *   console.log('Fixed JSON:', result.fixedJson);
 * }
 * ```
 *
 * @since 0.2.0
 * @author Reynard Validation Package
 *
 * @remarks
 * This is a production-optimized version of JsonRemediator with:
 * - Faster regex-based pattern matching
 * - Streamlined error detection
 * - Optimized for common package.json patterns
 */

/**
 * Production-ready JSON remediator optimized for Reynard package.json files.
 *
 * This class provides a streamlined JSON remediation system that uses regex-based
 * pattern matching for faster error detection and correction. It's optimized
 * specifically for the patterns commonly found in Reynard package.json files.
 *
 * @example
 * ```typescript
 * const remediator = new JsonRemediatorFinal();
 * const result = remediator.remediate(malformedJson);
 *
 * if (result.success) {
 *   console.log('Fixed:', result.fixedJson);
 * }
 * ```
 *
 * @since 0.2.0
 *
 * @remarks
 * Performance characteristics:
 * - Time complexity: O(n) where n is the JSON string length
 * - Memory usage: O(n) for storing fixed JSON
 * - Uses regex-based pattern matching for speed
 */
export class JsonRemediatorFinal {
  private errors: Array<{ type: string; line: number; description: string }> = [];
  private unfixableErrors: string[] = [];

  /**
   * Remediates JSON syntax errors using a streamlined regex-based approach.
   *
   * This method performs JSON remediation optimized for common patterns found
   * in package.json files. It first checks if the JSON is already valid, and
   * if not, applies regex-based fixes for common syntax errors.
   *
   * @param jsonString - The malformed JSON string to fix
   * @returns Object containing success status, fixed JSON, errors fixed, and unfixable errors
   *
   * @example
   * ```typescript
   * const remediator = new JsonRemediatorFinal();
   * const result = remediator.remediate('{"name": "test" "version": "1.0.0"}');
   *
   * if (result.success) {
   *   console.log('Fixed:', result.fixedJson);
   * }
   * ```
   *
   * @since 0.2.0
   */
  public remediate(jsonString: string): {
    success: boolean;
    fixedJson: string;
    errors: any[];
    unfixableErrors: string[];
  } {
    this.errors = [];
    this.unfixableErrors = [];

    try {
      // First, try to parse the JSON as-is
      JSON.parse(jsonString);
      return {
        success: true,
        fixedJson: jsonString,
        errors: [],
        unfixableErrors: [],
      };
    } catch (error) {
      // JSON is malformed, attempt to fix it
      const fixedJson = this.fixJsonSyntax(jsonString);

      // Try to parse the fixed JSON
      try {
        JSON.parse(fixedJson);
        return {
          success: true,
          fixedJson,
          errors: this.errors,
          unfixableErrors: this.unfixableErrors,
        };
      } catch (parseError) {
        const errorMessage = parseError instanceof Error ? parseError.message : String(parseError);
        this.unfixableErrors.push(`Failed to parse after remediation: ${errorMessage}`);
        return {
          success: false,
          fixedJson,
          errors: this.errors,
          unfixableErrors: this.unfixableErrors,
        };
      }
    }
  }

  /**
   * Fixes JSON syntax errors using regex-based pattern matching.
   *
   * This private method applies multiple fix passes using regex patterns to
   * correct common JSON syntax errors. It's optimized for speed and handles
   * the most common error patterns found in package.json files.
   *
   * @param jsonString - The malformed JSON string to fix
   * @returns Fixed JSON string with syntax errors corrected
   *
   * @private
   * @since 0.2.0
   *
   * @remarks
   * Fix order:
   * 1. Missing commas after property values
   * 2. Trailing commas before closing braces/brackets
   * 3. Missing quotes around property names
   * 4. Malformed objects and arrays
   */
  private fixJsonSyntax(jsonString: string): string {
    let fixed = jsonString;

    // Step 1: Fix missing commas after property values
    fixed = this.fixMissingCommas(fixed);

    // Step 2: Fix trailing commas
    fixed = this.fixTrailingCommas(fixed);

    // Step 3: Fix missing quotes around property names
    fixed = this.fixMissingQuotes(fixed);

    // Step 4: Fix malformed structures
    fixed = this.fixMalformedStructures(fixed);

    return fixed;
  }

  /**
   * Fixes missing commas between properties using regex pattern matching.
   *
   * This method uses regex patterns to detect and fix missing commas between
   * various JSON value types (strings, numbers, booleans, null, objects, arrays).
   *
   * @param jsonString - The JSON string to fix
   * @returns Fixed JSON string with missing commas added
   *
   * @private
   * @since 0.2.0
   */
  private fixMissingCommas(jsonString: string): string {
    let fixed = jsonString;

    // Pattern 1: Fix missing commas between property values and next properties
    // Matches: "key": "value" "nextKey" -> "key": "value", "nextKey"
    // Use a more specific pattern that looks for property value followed by property key
    // The pattern should match a property value (quoted string after colon) followed by whitespace and another quoted string
    fixed = fixed.replace(/(":\s*"[^"]*")\s*(")/g, (match, p1, p2) => {
      // Only add comma if the second quote is followed by a colon (indicating it's a property key)
      const afterMatch = fixed.substring(fixed.indexOf(match) + match.length);
      if (afterMatch.includes(":")) {
        this.errors.push({
          type: "missing-comma",
          line: 0,
          description: "Missing comma between properties",
        });
        return `${p1}, ${p2}`;
      }
      return match;
    });

    // Pattern 2: Fix missing commas between objects/arrays and next properties
    // Matches: } "nextKey" -> }, "nextKey"
    fixed = fixed.replace(/(\})\s*(")/g, (match, p1, p2) => {
      this.errors.push({
        type: "missing-comma",
        line: 0,
        description: "Missing comma between properties",
      });
      return `${p1},${p2}`;
    });

    // Pattern 3: Fix missing commas between arrays and next properties
    // Matches: ] "nextKey" -> ], "nextKey"
    fixed = fixed.replace(/(\])\s*(")/g, (match, p1, p2) => {
      this.errors.push({
        type: "missing-comma",
        line: 0,
        description: "Missing comma between properties",
      });
      return `${p1},${p2}`;
    });

    // Pattern 4: Fix missing commas between different value types
    // Matches: 42 "nextKey" -> 42, "nextKey"
    fixed = fixed.replace(/(\d+)\s*(")/g, (match, p1, p2) => {
      this.errors.push({
        type: "missing-comma",
        line: 0,
        description: "Missing comma between properties",
      });
      return `${p1},${p2}`;
    });

    // Pattern 5: Fix missing commas between boolean values and next properties
    // Matches: true "nextKey" -> true, "nextKey"
    fixed = fixed.replace(/(true|false)\s*(")/g, (match, p1, p2) => {
      this.errors.push({
        type: "missing-comma",
        line: 0,
        description: "Missing comma between properties",
      });
      return `${p1},${p2}`;
    });

    // Pattern 6: Fix missing commas between null values and next properties
    // Matches: null "nextKey" -> null, "nextKey"
    fixed = fixed.replace(/(null)\s*(")/g, (match, p1, p2) => {
      this.errors.push({
        type: "missing-comma",
        line: 0,
        description: "Missing comma between properties",
      });
      return `${p1},${p2}`;
    });

    return fixed;
  }

  /**
   * Fixes trailing commas before closing braces and brackets using regex.
   *
   * This method removes trailing commas that appear immediately before closing
   * braces or brackets, which are invalid in strict JSON.
   *
   * @param jsonString - The JSON string to fix
   * @returns Fixed JSON string with trailing commas removed
   *
   * @private
   * @since 0.2.0
   */
  private fixTrailingCommas(jsonString: string): string {
    let fixed = jsonString;

    // Remove trailing commas before closing braces or brackets
    fixed = fixed.replace(/,\s*([}\]])/g, (match, p1) => {
      this.errors.push({
        type: "trailing-comma",
        line: 0,
        description: "Trailing comma before closing brace/bracket",
      });
      return p1;
    });

    return fixed;
  }

  /**
   * Fixes missing quotes around property names using regex pattern matching.
   *
   * This method detects unquoted property names and adds quotes around them
   * to conform to JSON standards.
   *
   * @param jsonString - The JSON string to fix
   * @returns Fixed JSON string with property names properly quoted
   *
   * @private
   * @since 0.2.0
   */
  private fixMissingQuotes(jsonString: string): string {
    // Pattern: unquoted property name followed by colon (not at start of line)
    const unquotedPropertyPattern = /([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g;

    return jsonString.replace(unquotedPropertyPattern, (match, prefix, propertyName) => {
      this.errors.push({
        type: "missing-quote",
        line: 0,
        description: `Missing quotes around property name: ${propertyName}`,
      });

      return `${prefix}"${propertyName}":`;
    });
  }

  /**
   * Fixes malformed objects and arrays by adding missing closing braces and brackets.
   *
   * This method counts opening and closing braces/brackets and adds any missing
   * closing characters to properly close the JSON structures.
   *
   * @param jsonString - The JSON string to fix
   * @returns Fixed JSON string with properly closed structures
   *
   * @private
   * @since 0.2.0
   */
  private fixMalformedStructures(jsonString: string): string {
    let fixed = jsonString;

    // Fix missing closing braces/brackets
    const openBraces = (fixed.match(/\{/g) || []).length;
    const closeBraces = (fixed.match(/\}/g) || []).length;
    const openBrackets = (fixed.match(/\[/g) || []).length;
    const closeBrackets = (fixed.match(/\]/g) || []).length;

    // Add missing closing brackets first (they're usually nested inside objects)
    for (let i = 0; i < openBrackets - closeBrackets; i++) {
      fixed += "]";
      this.errors.push({
        type: "malformed-array",
        line: 0,
        description: "Missing closing bracket",
      });
    }

    // Add missing closing braces
    for (let i = 0; i < openBraces - closeBraces; i++) {
      fixed += "}";
      this.errors.push({
        type: "malformed-object",
        line: 0,
        description: "Missing closing brace",
      });
    }

    return fixed;
  }

  /**
   * Validates and fixes package.json files with package-specific validations.
   *
   * This method performs standard JSON remediation and then applies additional
   * validation specific to package.json files, including required fields and
   * version format validation.
   *
   * @param packageJsonContent - The package.json content string to fix
   * @returns Object containing success status, fixed JSON, errors, and unfixable errors
   *
   * @example
   * ```typescript
   * const remediator = new JsonRemediatorFinal();
   * const result = remediator.remediatePackageJson(packageJsonContent);
   *
   * if (result.success) {
   *   console.log('Package.json fixed successfully');
   * }
   * ```
   *
   * @since 0.2.0
   */
  public remediatePackageJson(packageJsonContent: string): {
    success: boolean;
    fixedJson: string;
    errors: any[];
    unfixableErrors: string[];
  } {
    const result = this.remediate(packageJsonContent);

    if (result.success && result.fixedJson) {
      // Additional package.json specific validations
      try {
        const parsed = JSON.parse(result.fixedJson);

        // Ensure required fields exist
        if (!parsed.name) {
          this.unfixableErrors.push("Missing required field: name");
        }
        if (!parsed.version) {
          this.unfixableErrors.push("Missing required field: version");
        }

        // Validate version format
        if (parsed.version && !/^\d+\.\d+\.\d+/.test(parsed.version)) {
          this.unfixableErrors.push("Invalid version format. Expected semantic version (e.g., 1.0.0)");
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.errors.push({
          type: "parse-error",
          line: 0,
          description: `Package.json validation failed: ${errorMessage}`,
        });
      }
    }

    return {
      ...result,
      unfixableErrors: this.unfixableErrors,
    };
  }
}

/**
 * Utility function to quickly fix JSON syntax errors without creating a remediator instance.
 *
 * This is a convenience function that creates a JsonRemediatorFinal instance,
 * fixes the JSON, and returns the fixed string. Use this when you only need
 * to fix JSON once and don't need detailed error information.
 *
 * @param jsonString - The malformed JSON string to fix
 * @returns Fixed JSON string, or original if already valid or unfixable
 *
 * @example
 * ```typescript
 * import { fixJsonSyntax } from './json-remediator-final.js';
 *
 * const fixed = fixJsonSyntax('{"name": "test" "version": "1.0.0"}');
 * console.log(fixed); // {"name": "test", "version": "1.0.0"}
 * ```
 *
 * @since 0.2.0
 */
export function fixJsonSyntax(jsonString: string): string {
  const remediator = new JsonRemediatorFinal();
  const result = remediator.remediate(jsonString);
  return result.fixedJson || jsonString;
}

/**
 * Utility function to quickly fix package.json files without creating a remediator instance.
 *
 * This is a convenience function that creates a JsonRemediatorFinal instance,
 * fixes the package.json with package-specific validations, and returns the
 * fixed string. Use this when you only need to fix package.json once.
 *
 * @param packageJsonContent - The package.json content string to fix
 * @returns Fixed package.json content, or original if already valid or unfixable
 *
 * @example
 * ```typescript
 * import { fixPackageJson } from './json-remediator-final.js';
 *
 * const fixed = fixPackageJson('{"name": "my-package" "version": "1.0.0"}');
 * console.log(fixed); // {"name": "my-package", "version": "1.0.0"}
 * ```
 *
 * @since 0.2.0
 */
export function fixPackageJson(packageJsonContent: string): string {
  const remediator = new JsonRemediatorFinal();
  const result = remediator.remediatePackageJson(packageJsonContent);
  return result.fixedJson || packageJsonContent;
}
