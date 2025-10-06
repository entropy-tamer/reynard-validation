#!/usr/bin/env node

/**
 * @fileoverview JSON Fixer CLI - Command line tool for fixing JSON syntax errors
 * @author Reynard Validation Package
 * @since 0.2.0
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, extname } from "path";
import { JsonRemediator } from "../json-remediator.js";

/**
 * CLI options interface
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
 * JSON Fixer CLI class
 */
class JsonFixerCli {
  private remediator: JsonRemediator;

  constructor() {
    this.remediator = new JsonRemediator();
  }

  /**
   * Main CLI entry point
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
   * Parse command line arguments
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
   * Fix a single file
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
   * Fix all package.json files in the current directory and subdirectories
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
   * Print verbose output
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
   * Show help message
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
