/**
 * @fileoverview JSON Syntax Remediator - Fixes common JSON syntax errors
 * @author Reynard Validation Package
 * @since 0.2.0
 */

/**
 * Common JSON syntax errors and their fixes
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
 * Result of JSON remediation attempt
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
 * JSON Syntax Remediator class
 *
 * Fixes common JSON syntax errors including:
 * - Missing commas after property values
 * - Trailing commas in objects and arrays
 * - Missing quotes around property names
 * - Invalid escape sequences
 * - Malformed objects and arrays
 */
export class JsonRemediator {
  private errors: JsonSyntaxError[] = [];
  private unfixableErrors: string[] = [];

  /**
   * Remediate JSON syntax errors in a string
   *
   * @param jsonString - The malformed JSON string to fix
   * @returns Remediation result with fixed JSON and error details
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
   * Fix common JSON syntax errors
   *
   * @param jsonString - The malformed JSON string
   * @returns Fixed JSON string
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
   * Fix missing commas after property values
   *
   * @param jsonString - The JSON string to fix
   * @returns Fixed JSON string
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

        // Check if next line starts with a property (quoted key with colon) or opening brace/bracket
        // BUT NOT if it starts with closing brace/bracket (that would be trailing comma)
        if (
          (nextLineTrimmed.startsWith('"') && nextLineTrimmed.includes(":")) ||
          nextLineTrimmed.startsWith("{") ||
          nextLineTrimmed.startsWith("[")
        ) {
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
   * Fix trailing commas in objects and arrays
   *
   * @param jsonString - The JSON string to fix
   * @returns Fixed JSON string
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
   * Fix missing quotes around property names
   *
   * @param jsonString - The JSON string to fix
   * @returns Fixed JSON string
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
   * Fix invalid escape sequences
   *
   * @param jsonString - The JSON string to fix
   * @returns Fixed JSON string
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
   * Fix malformed objects and arrays
   *
   * @param jsonString - The JSON string to fix
   * @returns Fixed JSON string
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
   * Validate and fix a package.json file specifically
   *
   * @param packageJsonContent - The package.json content to fix
   * @returns Remediation result with fixed package.json
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
 * Utility function to quickly fix JSON syntax errors
 *
 * @param jsonString - The malformed JSON string
 * @returns Fixed JSON string or original if no fixes needed
 */
export function fixJsonSyntax(jsonString: string): string {
  const remediator = new JsonRemediator();
  const result = remediator.remediate(jsonString);
  return result.fixedJson || jsonString;
}

/**
 * Utility function to fix package.json files specifically
 *
 * @param packageJsonContent - The package.json content
 * @returns Fixed package.json content
 */
export function fixPackageJson(packageJsonContent: string): string {
  const remediator = new JsonRemediator();
  const result = remediator.remediatePackageJson(packageJsonContent);
  return result.fixedJson || packageJsonContent;
}
