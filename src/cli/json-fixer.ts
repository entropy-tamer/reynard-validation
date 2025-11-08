#!/usr/bin/env node

/**
 * JSON Fixer CLI - Command-line tool for fixing JSON syntax errors.
 *
 * This module provides a comprehensive command-line interface for fixing JSON
 * syntax errors in files. It supports single file fixing, batch processing of
 * package.json files, and various output modes including check-only and verbose modes.
 *
 * Features:
 * - Fix single JSON files or all package.json files in a directory
 * - Check-only mode for validation without modification
 * - Verbose output with detailed error information
 * - In-place fixing or output to different file
 *
 * @example
 * ```bash
 * # Check a file
 * json-fixer --check package.json
 *
 * # Fix a file in place
 * json-fixer --fix package.json
 *
 * # Fix all package.json files
 * json-fixer --all --fix
 * ```
 *
 * @since 0.2.0
 * @author Reynard Validation Package
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, extname } from "path";
import { JsonRemediator } from "../json-remediator.js";

/**
 * Command-line interface options for the JSON fixer.
 *
 * This interface defines all available CLI options for configuring the JSON
 * fixer behavior, including input/output files, operation modes, and verbosity.
 *
 * @since 0.2.0
 */
interface CliOptions {
  /** Input file path */
  input: string;
  /** Output file path (optional, defaults to input file) */
  output?: string;
  /** Whether to fix in place */
  fix: boolean;
  /** Whether to show verbose output */
  verbose: boolean;
  /** Whether to check only (don't fix) */
  check: boolean;
  /** Whether to fix all package.json files in directory */
  all: boolean;
}

/**
 * JSON Fixer CLI class for command-line JSON remediation operations.
 *
 * This class provides the main CLI functionality for fixing JSON syntax errors,
 * including argument parsing, file processing, and result reporting.
 *
 * @since 0.2.0
 */
class JsonFixerCli {
  private remediator: JsonRemediator;

  constructor() {
    this.remediator = new JsonRemediator();
  }

  /**
   * Main CLI entry point that processes command-line arguments and executes fixes.
   *
   * This method parses command-line arguments, determines the operation mode
   * (single file or batch), and executes the appropriate fix operation.
   *
   * @param args - Command-line arguments array (typically process.argv.slice(2))
   * @returns Promise that resolves when the operation completes
   *
   * @since 0.2.0
   */
  public async run(args: string[]): Promise<void> {
    const options = this.parseArgs(args);

    if (options.all) {
      await this.fixAllPackageJsonFiles(options);
    } else {
      await this.fixSingleFile(options);
    }
  }

  /**
   * Parses command-line arguments and returns a CliOptions object.
   *
   * This method processes command-line arguments and extracts options including
   * input/output files, operation modes, and verbosity settings.
   *
   * @param args - Command-line arguments array
   * @returns CliOptions object with parsed configuration
   *
   * @private
   * @since 0.2.0
   */
  private parseArgs(args: string[]): CliOptions {
    const options: CliOptions = {
      input: "",
      fix: false,
      verbose: false,
      check: false,
      all: false,
    };

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      switch (arg) {
        case "--input":
        case "-i":
          options.input = args[++i];
          break;
        case "--output":
        case "-o":
          options.output = args[++i];
          break;
        case "--fix":
        case "-f":
          options.fix = true;
          break;
        case "--verbose":
        case "-v":
          options.verbose = true;
          break;
        case "--check":
        case "-c":
          options.check = true;
          break;
        case "--all":
        case "-a":
          options.all = true;
          break;
        case "--help":
        case "-h":
          this.showHelp();
          process.exit(0);
          break;
        default:
          if (!arg.startsWith("-") && !options.input) {
            options.input = arg;
          }
          break;
      }
    }

    if (!options.input && !options.all) {
      console.error("❌ Error: Input file is required");
      this.showHelp();
      process.exit(1);
    }

    return options;
  }

  /**
   * Fixes a single JSON file according to the provided options.
   *
   * This method processes a single file, applies JSON remediation if needed,
   * and either checks or fixes the file based on the options provided.
   *
   * @param options - CLI options including input file and operation mode
   * @returns Promise that resolves when the file is processed
   *
   * @private
   * @since 0.2.0
   */
  private async fixSingleFile(options: CliOptions): Promise<void> {
    const inputPath = resolve(options.input);

    if (!existsSync(inputPath)) {
      console.error(`❌ Error: File not found: ${inputPath}`);
      process.exit(1);
    }

    try {
      const content = readFileSync(inputPath, "utf8");
      const isPackageJson = inputPath.endsWith("package.json");

      const result = isPackageJson ? this.remediator.remediatePackageJson(content) : this.remediator.remediate(content);

      if (options.verbose) {
        this.printVerboseOutput(result, inputPath);
      }

      if (result.success) {
        if (options.check) {
          console.log(`✅ ${inputPath} - JSON is valid`);
        } else if (options.fix && result.fixedJson && result.fixedJson !== content) {
          const outputPath = options.output ? resolve(options.output) : inputPath;
          writeFileSync(outputPath, result.fixedJson, "utf8");
          console.log(`🔧 Fixed ${inputPath} -> ${outputPath}`);

          if (result.errors.length > 0) {
            console.log(`   Fixed ${result.errors.length} error(s):`);
            result.errors.forEach(error => {
              console.log(`   - ${error.description} (line ${error.line})`);
            });
          }
        } else if (result.errors.length > 0) {
          console.log(`⚠️  ${inputPath} - Found ${result.errors.length} fixable error(s)`);
          if (options.verbose) {
            result.errors.forEach(error => {
              console.log(`   - ${error.description} (line ${error.line})`);
            });
          }
        } else {
          console.log(`✅ ${inputPath} - JSON is valid`);
        }
      } else {
        console.error(`❌ ${inputPath} - Failed to fix JSON`);
        if (result.unfixableErrors.length > 0) {
          result.unfixableErrors.forEach(error => {
            console.error(`   - ${error}`);
          });
        }
        process.exit(1);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`❌ Error processing ${inputPath}: ${errorMessage}`);
      process.exit(1);
    }
  }

  /**
   * Fixes all package.json files in the current directory and subdirectories.
   *
   * This method finds all package.json files (excluding node_modules and third_party),
   * processes each one, and provides a summary of fixes applied.
   *
   * @param options - CLI options including fix mode and verbosity
   * @returns Promise that resolves when all files are processed
   *
   * @private
   * @since 0.2.0
   */
  private async fixAllPackageJsonFiles(options: CliOptions): Promise<void> {
    const { execSync } = await import("child_process");

    try {
      // Find all package.json files
      const findCommand = 'find . -name "package.json" -not -path "*/node_modules/*" -not -path "*/third_party/*"';
      const output = execSync(findCommand, { encoding: "utf8" });
      const files = output
        .trim()
        .split("\n")
        .filter(f => f);

      if (files.length === 0) {
        console.log("No package.json files found");
        return;
      }

      console.log(`Found ${files.length} package.json files`);

      let fixedCount = 0;
      let errorCount = 0;

      for (const file of files) {
        try {
          const content = readFileSync(file, "utf8");
          const result = this.remediator.remediatePackageJson(content);

          if (result.success) {
            if (result.fixedJson && result.fixedJson !== content) {
              if (options.fix) {
                writeFileSync(file, result.fixedJson, "utf8");
                console.log(`🔧 Fixed ${file} (${result.errors.length} error(s))`);
                fixedCount++;
              } else {
                console.log(`⚠️  ${file} - ${result.errors.length} fixable error(s)`);
              }
            } else {
              if (options.verbose) {
                console.log(`✅ ${file} - Valid`);
              }
            }
          } else {
            console.error(`❌ ${file} - Failed to fix`);
            errorCount++;
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error(`❌ Error processing ${file}: ${errorMessage}`);
          errorCount++;
        }
      }

      if (options.fix) {
        console.log(`\n📊 Summary: Fixed ${fixedCount} files, ${errorCount} errors`);
      } else {
        console.log(`\n📊 Summary: ${fixedCount} files need fixing, ${errorCount} unfixable errors`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`❌ Error finding package.json files: ${errorMessage}`);
      process.exit(1);
    }
  }

  /**
   * Prints verbose output with detailed error information.
   *
   * This method displays comprehensive information about the remediation process,
   * including all errors found and fixed, and any unfixable errors.
   *
   * @param result - Remediation result object with error details
   * @param filePath - Path to the file being processed
   *
   * @private
   * @since 0.2.0
   */
  private printVerboseOutput(result: any, filePath: string): void {
    console.log(`\n📄 Processing: ${filePath}`);
    console.log(`✅ Success: ${result.success}`);

    if (result.errors.length > 0) {
      console.log(`🔧 Fixed ${result.errors.length} error(s):`);
      result.errors.forEach((error: any) => {
        console.log(`   - ${error.type}: ${error.description} (line ${error.line})`);
        console.log(`     Fix: ${error.fix}`);
      });
    }

    if (result.unfixableErrors.length > 0) {
      console.log(`❌ Unfixable errors:`);
      result.unfixableErrors.forEach((error: string) => {
        console.log(`   - ${error}`);
      });
    }

    console.log("");
  }

  /**
   * Displays the help message with usage instructions and available options.
   *
   * This method prints comprehensive help information including command syntax,
   * available options, examples, and common fixes performed.
   *
   * @private
   * @since 0.2.0
   */
  private showHelp(): void {
    console.log(`
🦊 JSON Fixer CLI - Fix common JSON syntax errors

Usage:
  json-fixer [options] <file>
  json-fixer --all [options]

Options:
  -i, --input <file>     Input JSON file
  -o, --output <file>    Output file (defaults to input file)
  -f, --fix              Fix the file in place
  -v, --verbose          Show verbose output
  -c, --check            Check only, don't fix
  -a, --all              Fix all package.json files in directory
  -h, --help             Show this help message

Examples:
  json-fixer --check package.json
  json-fixer --fix package.json
  json-fixer --all --fix
  json-fixer --verbose --fix malformed.json

Common fixes:
  - Missing commas after property values
  - Trailing commas in objects/arrays
  - Missing quotes around property names
  - Invalid escape sequences
  - Malformed objects and arrays
`);
  }
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const cli = new JsonFixerCli();
  cli.run(process.argv.slice(2)).catch(error => {
    console.error("❌ CLI Error:", error.message);
    process.exit(1);
  });
}

export { JsonFixerCli };
