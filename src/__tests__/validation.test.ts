/**
 * @file Validation Tests
 *
 * Comprehensive tests for validation functionality in the core validation package.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { ValidationEngine } from "../ValidationEngine.js";
import { FilePatternRule, FileContentRule } from "../types/ValidationTypes.js";

// Mock file system operations
vi.mock("fs/promises");

describe("ValidationEngine", () => {
  let validationEngine: ValidationEngine;

  beforeEach(() => {
    validationEngine = new ValidationEngine();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("File Pattern Validation", () => {
    it("should validate file patterns correctly", async () => {
      const rule: FilePatternRule = {
        type: "file-pattern",
        pattern: "*.ts",
        description: "TypeScript files should exist",
        validator: files => files.length > 0,
      };

      const mockFiles = ["src/index.ts", "src/utils.ts"];

      const result = await validationEngine.validateFilePattern(rule, mockFiles);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect missing required files", async () => {
      const rule: FilePatternRule = {
        type: "file-pattern",
        pattern: "*.ts",
        description: "TypeScript files should exist",
        validator: files => files.length > 0,
      };

      const mockFiles: string[] = [];

      const result = await validationEngine.validateFilePattern(rule, mockFiles);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain("TypeScript files should exist");
    });
  });

  describe("File Content Validation", () => {
    it("should validate file content with regex", async () => {
      const rule: FileContentRule = {
        type: "file-content",
        pattern: "*.ts",
        contentRule: {
          type: "regex",
          pattern: "export.*from",
          description: "Files should have exports",
        },
      };

      const mockContent = "export { something } from './module'";

      const result = await validationEngine.validateFileContent(rule, "test.ts", mockContent);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect content violations", async () => {
      const rule: FileContentRule = {
        type: "file-content",
        pattern: "*.ts",
        contentRule: {
          type: "regex",
          pattern: "export.*from",
          description: "Files should have exports",
        },
      };

      const mockContent = "const something = 'value';";

      const result = await validationEngine.validateFileContent(rule, "test.ts", mockContent);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain("Files should have exports");
    });

    it("should validate line count constraints", async () => {
      const rule: FileContentRule = {
        type: "file-content",
        pattern: "*.ts",
        contentRule: {
          type: "line-count",
          maxLines: 140,
          description: "Files should not exceed 140 lines",
        },
      };

      const mockContent = "line1\nline2\nline3";

      const result = await validationEngine.validateFileContent(rule, "test.ts", mockContent);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect line count violations", async () => {
      const rule: FileContentRule = {
        type: "file-content",
        pattern: "*.ts",
        contentRule: {
          type: "line-count",
          maxLines: 5,
          description: "Files should not exceed 5 lines",
        },
      };

      const mockContent = "line1\nline2\nline3\nline4\nline5\nline6";

      const result = await validationEngine.validateFileContent(rule, "test.ts", mockContent);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain("Files should not exceed 5 lines");
    });
  });

  describe("Batch Validation", () => {
    it("should validate multiple rules", async () => {
      const rules = [
        {
          type: "file-pattern" as const,
          pattern: "*.ts",
          description: "TypeScript files should exist",
          validator: (files: string[]) => files.length > 0,
        },
        {
          type: "file-content" as const,
          pattern: "*.ts",
          contentRule: {
            type: "line-count" as const,
            maxLines: 140,
            description: "Files should not exceed 140 lines",
          },
        },
      ];

      const mockFiles = ["src/index.ts"];
      const mockContent = "export const test = 'value';";

      const results = await validationEngine.validateBatch(rules, mockFiles, {
        "src/index.ts": mockContent,
      });

      expect(results).toHaveLength(2);
      expect(results.every(r => r.isValid)).toBe(true);
    });
  });
});
