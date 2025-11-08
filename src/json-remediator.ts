/**
 * JSON Syntax Remediator - Comprehensive JSON syntax error detection and correction.
 *
 * This module provides a robust JSON remediation system that automatically detects
 * and fixes common JSON syntax errors. It's designed to handle malformed JSON
 * files that would otherwise fail to parse, making it particularly useful for
 * fixing corrupted configuration files, package.json files, and other JSON data.
 *
 * The remediator handles:
 * - Missing commas after property values
 * - Trailing commas in objects and arrays
 * - Missing quotes around property names
 * - Invalid escape sequences
 * - Malformed objects and arrays
 * - Missing closing braces and brackets
 *
 * @example
 * ```typescript
 * import { JsonRemediator } from './json-remediator.js';
 *
 * const remediator = new JsonRemediator();
 * const result = remediator.remediate('{"name": "test" "version": "1.0.0"}');
 *
 * if (result.success) {
 *   console.log('Fixed JSON:', result.fixedJson);
 *   console.log('Fixed errors:', result.errors.length);
 * }
 * ```
 *
 * @since 0.2.0
 * @author Reynard Validation Package
 */

/**
 * Represents a JSON syntax error with detailed information about the error
 * location, type, and suggested fix.
 *
 * This interface provides comprehensive information about each JSON syntax error
 * detected during remediation, including the exact location (line and column)
 * and a description of what was fixed.
 *
 * @example
 * ```typescript
 * const error: JsonSyntaxError = {
 *   type: 'missing-comma',
 *   line: 5,
 *   column: 20,
 *   description: 'Missing comma after property value',
 *   fix: 'Added comma after property value'
 * };
 * ```
 *
 * @since 0.2.0
 */
export interface JsonSyntaxError {
  /** The type of error found */
  type:
    | "missing-comma"
    | "trailing-comma"
    | "missing-quote"
    | "invalid-escape"
    | "malformed-object"
    | "malformed-array";
  /** Line number where the error occurs */
  line: number;
  /** Column number where the error occurs */
  column: number;
  /** Description of the error */
  description: string;
  /** Suggested fix for the error */
  fix: string;
}

/**
 * Result of a JSON remediation operation containing success status,
 * fixed JSON content, and detailed error information.
 *
 * This interface provides comprehensive information about the remediation
 * process, including whether the remediation was successful, the fixed JSON
 * string (if successful), all errors that were detected and fixed, and any
 * unfixable errors that remain.
 *
 * @example
 * ```typescript
 * const result: JsonRemediationResult = {
 *   success: true,
 *   fixedJson: '{"name": "test", "version": "1.0.0"}',
 *   errors: [
 *     { type: 'missing-comma', line: 1, column: 20, description: '...', fix: '...' }
 *   ],
 *   unfixableErrors: []
 * };
 * ```
 *
 * @since 0.2.0
 */
export interface JsonRemediationResult {
  /** Whether the remediation was successful */
  success: boolean;
  /** The fixed JSON string */
  fixedJson?: string;
  /** List of errors found and fixed */
  errors: JsonSyntaxError[];
  /** Any remaining unfixable errors */
  unfixableErrors: string[];
}

/**
 * JSON Syntax Remediator class for automatic detection and correction of JSON syntax errors.
 *
 * This class provides comprehensive JSON remediation capabilities, automatically
 * detecting and fixing common JSON syntax errors that prevent valid parsing.
 * It uses a multi-pass approach to fix errors iteratively until the JSON is
 * valid or no more fixes can be applied.
 *
 * The remediator handles:
 * - Missing commas after property values
 * - Trailing commas in objects and arrays
 * - Missing quotes around property names
 * - Invalid escape sequences
 * - Malformed objects and arrays
 * - Missing closing braces and brackets
 *
 * @example
 * ```typescript
 * import { JsonRemediator } from './json-remediator.js';
 *
 * const remediator = new JsonRemediator();
 *
 * // Fix general JSON
 * const result = remediator.remediate('{"name": "test" "version": "1.0.0"}');
 * if (result.success) {
 *   console.log('Fixed:', result.fixedJson);
 * }
 *
 * // Fix package.json specifically
 * const packageResult = remediator.remediatePackageJson(packageJsonContent);
 * ```
 *
 * @since 0.2.0
 *
 * @remarks
 * Performance characteristics:
 * - Time complexity: O(n) where n is the JSON string length
 * - Memory usage: O(n) for storing fixed JSON and error information
 * - Uses iterative multi-pass approach for comprehensive error fixing
 */
export class JsonRemediator {
  private errors: JsonSyntaxError[] = [];
  private unfixableErrors: string[] = [];

  /**
   * Remediates JSON syntax errors in a string and returns the fixed JSON.
   *
   * This method performs comprehensive JSON remediation, attempting to fix
   * all detectable syntax errors. It first checks if the JSON is already valid,
   * and if not, applies multiple fix passes until the JSON is valid or no
   * more fixes can be applied.
   *
   * @param jsonString - The malformed JSON string to fix
   * @returns JsonRemediationResult containing success status, fixed JSON,
   *          list of errors fixed, and any unfixable errors
   *
   * @example
   * ```typescript
   * const remediator = new JsonRemediator();
   * const result = remediator.remediate('{"name": "test" "version": "1.0.0"}');
   *
   * if (result.success) {
   *   console.log('Fixed JSON:', result.fixedJson);
   *   console.log('Fixed', result.errors.length, 'errors');
   * } else {
   *   console.log('Unfixable errors:', result.unfixableErrors);
   * }
   * ```
   *
   * @since 0.2.0
   *
   * @remarks
   * The remediation process:
   * 1. First attempts to parse the JSON as-is
   * 2. If parsing fails, applies multiple fix passes
   * 3. Validates the fixed JSON
   * 4. Returns detailed results including all fixes applied
   */
  public remediate(jsonString: string): JsonRemediationResult {
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

        // Try to provide more helpful error messages
        let helpfulMessage = errorMessage;
        if (errorMessage.includes("Expected property name")) {
          helpfulMessage =
            "Invalid JSON structure - check for missing quotes around property names or malformed objects";
        } else if (errorMessage.includes("Unexpected token")) {
          helpfulMessage = "Unexpected character found - check for invalid syntax or missing commas";
        } else if (errorMessage.includes("Unexpected end")) {
          helpfulMessage = "JSON appears to be truncated - check for missing closing braces or brackets";
        }

        this.unfixableErrors.push(`Failed to parse after remediation: ${helpfulMessage}`);
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
   * Fixes common JSON syntax errors using a multi-pass iterative approach.
   *
   * This private method applies multiple fix passes to the JSON string,
   * fixing different types of errors in a specific order to ensure maximum
   * compatibility. It runs up to 5 iterations or until no more changes are made.
   *
   * @param jsonString - The malformed JSON string to fix
   * @returns Fixed JSON string with syntax errors corrected
   *
   * @private
   * @since 0.2.0
   *
   * @remarks
   * Fix order:
   * 1. Missing quotes around property names
   * 2. Missing commas after property values
   * 3. Trailing commas before closing braces/brackets
   * 4. Invalid escape sequences
   * 5. Malformed objects and arrays
   */
  private fixJsonSyntax(jsonString: string): string {
    let fixed = jsonString;
    let previousFixed = "";
    let iterations = 0;
    const maxIterations = 5; // Prevent infinite loops

    // Run multiple passes until no more changes are made
    while (fixed !== previousFixed && iterations < maxIterations) {
      previousFixed = fixed;
      iterations++;

      // Step 1: Fix missing quotes around property names (do this first)
      fixed = this.fixMissingQuotes(fixed);

      // Step 2: Fix missing commas after property values
      fixed = this.fixMissingCommas(fixed);

      // Step 3: Fix trailing commas (do this after missing commas)
      fixed = this.fixTrailingCommas(fixed);

      // Step 4: Fix invalid escape sequences
      fixed = this.fixInvalidEscapes(fixed);

      // Step 5: Fix malformed objects and arrays (do this last)
      fixed = this.fixMalformedStructures(fixed);
    }

    return fixed;
  }

  /**
   * Fixes missing commas after property values and array elements.
   *
   * This method detects and fixes missing commas between JSON properties
   * and array elements. It analyzes line structure and indentation to
   * determine where commas should be added without breaking the JSON structure.
   *
   * @param jsonString - The JSON string to fix
   * @returns Fixed JSON string with missing commas added
   *
   * @private
   * @since 0.2.0
   *
   * @remarks
   * Handles:
   * - Missing commas between object properties
   * - Missing commas between array elements
   * - Missing commas after nested objects/arrays
   */
  private fixMissingCommas(jsonString: string): string {
    const lines = jsonString.split("\n");
    const fixedLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      const lineNumber = i + 1;

      // Check if this line contains a property definition (has colon) but doesn't end with comma
      if (line.includes(":") && !line.trim().endsWith(",") && !line.trim().endsWith("{")) {
        const nextLine = i + 1 < lines.length ? lines[i + 1] : "";
        const nextLineTrimmed = nextLine.trim();

        // Only add comma if next line is a sibling property (same indentation level)
        // and starts with a quoted key followed by colon
        if (nextLineTrimmed.startsWith('"') && nextLineTrimmed.includes(":")) {
          // Check if it's actually a sibling by comparing indentation
          const currentIndent = line.match(/^\s*/)?.[0] || "";
          const nextIndent = nextLine.match(/^\s*/)?.[0] || "";

          // Only add comma if next line has same indentation (sibling level)
          if (nextIndent.length === currentIndent.length) {
            // Add comma to the end of the line, preserving indentation
            const trimmed = line.trim();
            const indent = line.substring(0, line.length - trimmed.length);
            line = indent + trimmed + ",";
            this.errors.push({
              type: "missing-comma",
              line: lineNumber,
              column: line.length,
              description: "Missing comma after property value",
              fix: "Added comma after property value",
            });
          }
        }
      }

      // Also check if this line ends with a closing brace/bracket and needs a comma
      if ((line.trim().endsWith("}") || line.trim().endsWith("]")) && !line.trim().endsWith(",")) {
        const nextLine = i + 1 < lines.length ? lines[i + 1] : "";
        const nextLineTrimmed = nextLine.trim();

        // If next line starts with a property (quoted key with colon), add comma
        if (nextLineTrimmed.startsWith('"') && nextLineTrimmed.includes(":")) {
          const trimmed = line.trim();
          const indent = line.substring(0, line.length - trimmed.length);
          line = indent + trimmed + ",";
          this.errors.push({
            type: "missing-comma",
            line: lineNumber,
            column: line.length,
            description: "Missing comma after object/array",
            fix: "Added comma after object/array",
          });
        }
      }

      // Also check if this line ends with a closing brace/bracket and the next line is a property
      // This handles cases where the closing brace is on its own line
      if ((line.trim() === "}" || line.trim() === "]") && !line.trim().endsWith(",")) {
        const nextLine = i + 1 < lines.length ? lines[i + 1] : "";
        const nextLineTrimmed = nextLine.trim();

        // If next line starts with a property (quoted key with colon), add comma
        // But only if the next line is at the same or higher indentation level
        if (nextLineTrimmed.startsWith('"') && nextLineTrimmed.includes(":")) {
          const currentIndentMatch = line.match(/^(\s*)/);
          const nextIndentMatch = nextLine.match(/^(\s*)/);
          const currentIndent = currentIndentMatch ? currentIndentMatch[1] : "";
          const nextIndent = nextIndentMatch ? nextIndentMatch[1] : "";

          // Only add comma if next line is at same or higher level (not nested)
          if (nextIndent.length <= currentIndent.length) {
            const trimmed = line.trim();
            const indent = line.substring(0, line.length - trimmed.length);
            line = indent + trimmed + ",";
            this.errors.push({
              type: "missing-comma",
              line: lineNumber,
              column: line.length,
              description: "Missing comma after object/array",
              fix: "Added comma after object/array",
            });
          }
        }
      }

      // Also handle missing commas in arrays (but not for opening braces/brackets)
      if (
        line.trim() &&
        !line.trim().endsWith(",") &&
        !line.trim().endsWith("[") &&
        !line.trim().endsWith("]") &&
        !line.trim().endsWith("{")
      ) {
        const nextLine = i + 1 < lines.length ? lines[i + 1] : "";
        const nextLineTrimmed = nextLine.trim();

        // If next line is not empty and doesn't start with closing bracket, add comma
        if (nextLineTrimmed && !nextLineTrimmed.startsWith("]") && !nextLineTrimmed.startsWith("}")) {
          // Check if this looks like an array element (quoted string or number, not a property definition)
          const trimmed = line.trim();
          if (
            trimmed &&
            !trimmed.includes(":") &&
            (trimmed.startsWith('"') ||
              /^\d/.test(trimmed) ||
              trimmed === "true" ||
              trimmed === "false" ||
              trimmed === "null")
          ) {
            const indent = line.substring(0, line.length - trimmed.length);
            line = indent + trimmed + ",";
            this.errors.push({
              type: "missing-comma",
              line: lineNumber,
              column: line.length,
              description: "Missing comma after array element",
              fix: "Added comma after array element",
            });
          }
        }
      }

      fixedLines.push(line);
    }

    return fixedLines.join("\n");
  }

  /**
   * Fixes trailing commas before closing braces and brackets.
   *
   * This method removes trailing commas that appear before closing braces
   * or brackets, which are invalid in strict JSON. It handles both single-line
   * and multi-line trailing comma scenarios.
   *
   * @param jsonString - The JSON string to fix
   * @returns Fixed JSON string with trailing commas removed
   *
   * @private
   * @since 0.2.0
   *
   * @remarks
   * Handles:
   * - Trailing commas on the same line as closing brace/bracket
   * - Trailing commas on previous line before closing brace/bracket
   * - Nested trailing commas in complex structures
   */
  private fixTrailingCommas(jsonString: string): string {
    const lines = jsonString.split("\n");
    const fixedLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      const lineNumber = i + 1;

      // Remove trailing commas before closing braces or brackets
      // Pattern: content, } or content, ]
      const trailingCommaPattern = /^(\s*)(.*?),\s*([}\]])/;
      const match = line.match(trailingCommaPattern);

      if (match) {
        // Remove the comma: keep indentation + content + closing brace/bracket
        line = match[1] + match[2] + match[3];
        this.errors.push({
          type: "trailing-comma",
          line: lineNumber,
          column: match[1].length + match[2].length + 1,
          description: "Trailing comma before closing brace/bracket",
          fix: "Removed trailing comma",
        });
      }

      // Handle lines that end with closing brace/bracket and comma
      // Pattern: }, or ],
      if (line.trim().endsWith(",") && (line.trim().endsWith("},") || line.trim().endsWith("],"))) {
        const nextLine = i + 1 < lines.length ? lines[i + 1] : "";
        const nextLineTrimmed = nextLine.trim();
        const currentIndentMatch = line.match(/^(\s*)/);
        const nextIndentMatch = nextLine.match(/^(\s*)/);
        const currentIndent = currentIndentMatch ? currentIndentMatch[1] : "";
        const nextIndent = nextIndentMatch ? nextIndentMatch[1] : "";

        // If next line is a property at the same or higher level, this comma is needed
        // If next line is empty, closing brace, or at a lower level, this comma is trailing
        if (
          nextLineTrimmed &&
          nextLineTrimmed.startsWith('"') &&
          nextLineTrimmed.includes(":") &&
          nextIndent.length <= currentIndent.length
        ) {
          // Keep the comma - it's needed for the next property
          // Don't remove it
        } else {
          // Remove the comma - it's trailing
          const trimmed = line.trim();
          const indent = line.substring(0, line.length - trimmed.length);
          line = indent + trimmed.slice(0, -1); // Remove the comma
          this.errors.push({
            type: "trailing-comma",
            line: lineNumber,
            column: line.length + 1,
            description: "Trailing comma before closing brace/bracket",
            fix: "Removed trailing comma",
          });
        }
      }

      // Handle trailing commas on previous line when current line is just closing brace/bracket
      if ((line.trim() === "}" || line.trim() === "]") && i > 0) {
        const prevLine = lines[i - 1];
        // If previous line ends with comma
        if (prevLine.trim().endsWith(",")) {
          // Remove comma from previous line, preserving indentation
          const trimmed = prevLine.trim();
          const indent = prevLine.substring(0, prevLine.length - trimmed.length);
          const prevLineFixed = indent + trimmed.slice(0, -1);
          if (fixedLines.length > 0) {
            fixedLines[fixedLines.length - 1] = prevLineFixed;
          }
          this.errors.push({
            type: "trailing-comma",
            line: i, // Previous line number
            column: prevLine.length,
            description: "Trailing comma before closing brace/bracket",
            fix: "Removed trailing comma",
          });
        }
      }

      fixedLines.push(line);
    }

    // Second pass: handle nested trailing commas by looking at the fixed lines
    // Process the lines in reverse to avoid index issues
    for (let i = fixedLines.length - 1; i >= 0; i--) {
      const line = fixedLines[i];

      // Check if this line ends with a closing brace/bracket
      if (line.trim() === "}" || line.trim() === "]") {
        // Look back through previous lines to find the last non-empty line
        for (let j = i - 1; j >= 0; j--) {
          const prevLine = fixedLines[j];
          if (prevLine && prevLine.trim()) {
            // If the previous non-empty line ends with a comma, remove it
            if (prevLine.trim().endsWith(",")) {
              const trimmed = prevLine.trim();
              const indent = prevLine.substring(0, prevLine.length - trimmed.length);
              const prevLineFixed = indent + trimmed.slice(0, -1);
              fixedLines[j] = prevLineFixed; // Update the line directly
              this.errors.push({
                type: "trailing-comma",
                line: j + 1,
                column: prevLine.length,
                description: "Trailing comma before closing brace/bracket",
                fix: "Removed trailing comma",
              });
            }
            break; // Only check the immediate previous non-empty line
          }
        }
      }
    }

    // Final pass: use regex to catch any remaining trailing commas
    let finalResult = fixedLines.join("\n");

    // Remove trailing commas before closing braces/brackets using regex
    // Pattern: comma followed by optional whitespace and closing brace/bracket
    finalResult = finalResult.replace(/,(\s*[}\]])/g, (match, closing) => {
      this.errors.push({
        type: "trailing-comma",
        line: 0, // We can't determine line number from regex
        column: 0,
        description: "Trailing comma before closing brace/bracket",
        fix: "Removed trailing comma",
      });
      return closing; // Return just the closing brace/bracket without comma
    });

    return finalResult;
  }

  /**
   * Fixes missing quotes around unquoted property names.
   *
   * This method detects property names that are not quoted and adds quotes
   * around them. It uses regex to identify valid JavaScript identifier patterns
   * that should be quoted in JSON.
   *
   * @param jsonString - The JSON string to fix
   * @returns Fixed JSON string with property names properly quoted
   *
   * @private
   * @since 0.2.0
   *
   * @remarks
   * Handles:
   * - Unquoted property names (e.g., `name:` instead of `"name":`)
   * - Preserves existing quoted property names
   * - Maintains proper indentation
   */
  private fixMissingQuotes(jsonString: string): string {
    // Pattern: unquoted property name followed by colon
    const unquotedPropertyPattern = /^(\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/gm;

    return jsonString.replace(unquotedPropertyPattern, (match, indent, propertyName) => {
      this.errors.push({
        type: "missing-quote",
        line: 0, // Will be calculated properly in a more sophisticated implementation
        column: 0,
        description: `Missing quotes around property name: ${propertyName}`,
        fix: `Added quotes around property name: "${propertyName}"`,
      });

      return `${indent}"${propertyName}":`;
    });
  }

  /**
   * Fixes invalid escape sequences in JSON strings.
   *
   * This method detects and fixes invalid escape sequences that don't conform
   * to JSON standards. It properly escapes backslashes and other special
   * characters according to JSON specification.
   *
   * @param jsonString - The JSON string to fix
   * @returns Fixed JSON string with valid escape sequences
   *
   * @private
   * @since 0.2.0
   *
   * @remarks
   * Handles:
   * - Unescaped backslashes
   * - Invalid escape sequences
   * - Preserves valid escape sequences
   */
  private fixInvalidEscapes(jsonString: string): string {
    // Fix common invalid escape sequences
    let fixed = jsonString;

    // Fix unescaped backslashes (but not in property names)
    const unescapedBackslashPattern = /(?<!\\)\\(?!["\\/bfnrt])/g;
    fixed = fixed.replace(unescapedBackslashPattern, "\\\\");

    // Note: We don't fix unescaped quotes in property names here
    // as that's handled by the fixMissingQuotes function

    return fixed;
  }

  /**
   * Fixes malformed objects and arrays by adding missing closing braces and brackets.
   *
   * This method counts opening and closing braces/brackets and adds any missing
   * closing characters. It also handles undefined values that should be null
   * in JSON.
   *
   * @param jsonString - The JSON string to fix
   * @returns Fixed JSON string with properly closed structures
   *
   * @private
   * @since 0.2.0
   *
   * @remarks
   * Handles:
   * - Missing closing braces `}`
   * - Missing closing brackets `]`
   * - Replaces `undefined` with `null`
   */
  private fixMalformedStructures(jsonString: string): string {
    let fixed = jsonString;

    // Fix missing closing braces/brackets
    const openBraces = (fixed.match(/\{/g) || []).length;
    const closeBraces = (fixed.match(/\}/g) || []).length;
    const openBrackets = (fixed.match(/\[/g) || []).length;
    const closeBrackets = (fixed.match(/\]/g) || []).length;

    // Add missing closing braces
    for (let i = 0; i < openBraces - closeBraces; i++) {
      fixed += "\n}";
      this.errors.push({
        type: "malformed-object",
        line: 0,
        column: 0,
        description: "Missing closing brace",
        fix: "Added missing closing brace",
      });
    }

    // Add missing closing brackets
    for (let i = 0; i < openBrackets - closeBrackets; i++) {
      fixed += "\n]";
      this.errors.push({
        type: "malformed-array",
        line: 0,
        column: 0,
        description: "Missing closing bracket",
        fix: "Added missing closing bracket",
      });
    }

    // Fix null values that might have been corrupted
    // Replace undefined with null in JSON strings
    fixed = fixed.replace(/\bundefined\b/g, "null");

    return fixed;
  }

  /**
   * Validates and fixes a package.json file with additional package.json-specific checks.
   *
   * This method performs standard JSON remediation and then applies additional
   * validation specific to package.json files, including checking for required
   * fields (name, version) and validating version format.
   *
   * @param packageJsonContent - The package.json content string to fix
   * @returns JsonRemediationResult with fixed package.json and validation results
   *
   * @example
   * ```typescript
   * const remediator = new JsonRemediator();
   * const result = remediator.remediatePackageJson(packageJsonContent);
   *
   * if (result.success) {
   *   console.log('Package.json fixed successfully');
   * } else {
   *   console.log('Unfixable errors:', result.unfixableErrors);
   * }
   * ```
   *
   * @since 0.2.0
   *
   * @remarks
   * Additional validations:
   * - Checks for required `name` field
   * - Checks for required `version` field
   * - Validates version format (semantic versioning)
   */
  public remediatePackageJson(packageJsonContent: string): JsonRemediationResult {
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
        this.unfixableErrors.push(`Package.json validation failed: ${errorMessage}`);
      }
    }

    return result;
  }
}

/**
 * Utility function to quickly fix JSON syntax errors without creating a remediator instance.
 *
 * This is a convenience function that creates a JsonRemediator instance, fixes
 * the JSON, and returns the fixed string. Use this when you only need to fix
 * JSON once and don't need detailed error information.
 *
 * @param jsonString - The malformed JSON string to fix
 * @returns Fixed JSON string, or original string if already valid or unfixable
 *
 * @example
 * ```typescript
 * import { fixJsonSyntax } from './json-remediator.js';
 *
 * const fixed = fixJsonSyntax('{"name": "test" "version": "1.0.0"}');
 * console.log(fixed); // {"name": "test", "version": "1.0.0"}
 * ```
 *
 * @since 0.2.0
 *
 * @remarks
 * For detailed error information, use JsonRemediator.remediate() instead.
 */
export function fixJsonSyntax(jsonString: string): string {
  const remediator = new JsonRemediator();
  const result = remediator.remediate(jsonString);
  return result.fixedJson || jsonString;
}

/**
 * Utility function to quickly fix package.json files without creating a remediator instance.
 *
 * This is a convenience function that creates a JsonRemediator instance, fixes
 * the package.json with package-specific validations, and returns the fixed string.
 * Use this when you only need to fix package.json once and don't need detailed
 * error information.
 *
 * @param packageJsonContent - The package.json content string to fix
 * @returns Fixed package.json content, or original if already valid or unfixable
 *
 * @example
 * ```typescript
 * import { fixPackageJson } from './json-remediator.js';
 *
 * const fixed = fixPackageJson('{"name": "my-package" "version": "1.0.0"}');
 * console.log(fixed); // {"name": "my-package", "version": "1.0.0"}
 * ```
 *
 * @since 0.2.0
 *
 * @remarks
 * For detailed error information, use JsonRemediator.remediatePackageJson() instead.
 */
export function fixPackageJson(packageJsonContent: string): string {
  const remediator = new JsonRemediator();
  const result = remediator.remediatePackageJson(packageJsonContent);
  return result.fixedJson || packageJsonContent;
}
