/**
 * @fileoverview Final JSON Syntax Remediator - Production-ready JSON fixer
 * @author Reynard Validation Package
 * @since 0.2.0
 */

/**
 * Production-ready JSON remediator that handles the specific patterns
 * found in Reynard package.json files
 */
export class JsonRemediatorFinal {
  private errors: Array<{ type: string; line: number; description: string }> = [];
  private unfixableErrors: string[] = [];

  /**
   * Remediate JSON syntax errors with a comprehensive approach
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
   * Comprehensive JSON syntax fixing
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
   * Fix missing commas after property values
   */
  private fixMissingCommas(jsonString: string): string {
    let fixed = jsonString;

    // Pattern 1: Fix missing commas between property values and next properties
    // Matches: "key": "value" "nextKey" -> "key": "value", "nextKey"
    // Look for two quoted strings next to each other where the first is a value
    fixed = fixed.replace(/(")\s*(")/g, (match, p1, p2) => {
      // Check if this is a property value followed by a property key
      // by looking for a colon before the first quote
      const beforeMatch = fixed.substring(0, fixed.indexOf(match));
      if (beforeMatch.includes(":")) {
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
   * Fix trailing commas before closing braces/brackets
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
   * Fix missing quotes around property names
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
   * Fix malformed objects and arrays
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
   * Fix package.json files specifically
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
 * Utility function to quickly fix JSON syntax errors
 */
export function fixJsonSyntax(jsonString: string): string {
  const remediator = new JsonRemediatorFinal();
  const result = remediator.remediate(jsonString);
  return result.fixedJson || jsonString;
}

/**
 * Utility function to fix package.json files specifically
 */
export function fixPackageJson(packageJsonContent: string): string {
  const remediator = new JsonRemediatorFinal();
  const result = remediator.remediatePackageJson(packageJsonContent);
  return result.fixedJson || packageJsonContent;
}
