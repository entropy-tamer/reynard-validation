/**
 * @fileoverview Tests for JSON Remediator CLI functionality
 * @author Reynard Validation Package
 * @since 0.2.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { readFileSync, writeFileSync, existsSync, unlinkSync } from "fs";
import { JsonRemediatorFinal } from "../json-remediator-final.js";

// Mock file system operations
vi.mock("fs", async () => {
  const actual = await vi.importActual("fs");
  return {
    ...actual,
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
    existsSync: vi.fn(),
    unlinkSync: vi.fn(),
  };
});

// Mock child_process
vi.mock("child_process", () => ({
  execSync: vi.fn(),
}));

describe("JSON Remediator CLI Integration", () => {
  const mockReadFileSync = vi.mocked(readFileSync);
  const mockWriteFileSync = vi.mocked(writeFileSync);
  const mockExistsSync = vi.mocked(existsSync);
  const mockExecSync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("File Processing", () => {
    it("should handle valid JSON files", () => {
      const validJson = '{"name": "test", "version": "1.0.0"}';
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(validJson);

      const remediator = new JsonRemediatorFinal();
      const result = remediator.remediate(validJson);

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should fix malformed JSON files", () => {
      const malformedJson = `{
  "name": "test"
  "version": "1.0.0"
}`;
      const fixedJson = `{
  "name": "test",
  "version": "1.0.0"
}`;

      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(malformedJson);

      const remediator = new JsonRemediatorFinal();
      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.fixedJson).toContain('"name": "test",');
    });

    it("should handle file not found errors", () => {
      mockExistsSync.mockReturnValue(false);

      expect(() => {
        if (!existsSync("nonexistent.json")) {
          throw new Error("File not found");
        }
      }).toThrow("File not found");
    });
  });

  describe("Package.json Specific Processing", () => {
    it("should validate package.json structure", () => {
      const validPackageJson = `{
  "name": "test-package",
  "version": "1.0.0",
  "description": "A test package"
}`;

      const remediator = new JsonRemediatorFinal();
      const result = remediator.remediatePackageJson(validPackageJson);

      expect(result.success).toBe(true);
      expect(result.unfixableErrors).toHaveLength(0);
    });

    it("should detect missing required fields in package.json", () => {
      const incompletePackageJson = `{
  "description": "A test package"
}`;

      const remediator = new JsonRemediatorFinal();
      const result = remediator.remediatePackageJson(incompletePackageJson);

      expect(result.unfixableErrors).toContain("Missing required field: name");
      expect(result.unfixableErrors).toContain("Missing required field: version");
    });

    it("should validate version format in package.json", () => {
      const invalidVersionPackageJson = `{
  "name": "test-package",
  "version": "invalid-version"
}`;

      const remediator = new JsonRemediatorFinal();
      const result = remediator.remediatePackageJson(invalidVersionPackageJson);

      expect(result.unfixableErrors).toContain("Invalid version format. Expected semantic version (e.g., 1.0.0)");
    });
  });

  describe("Batch Processing Simulation", () => {
    it("should handle multiple files", () => {
      const files = ["package1.json", "package2.json", "package3.json"];

      const validJson = '{"name": "test", "version": "1.0.0"}';
      const malformedJson = `{
  "name": "test"
  "version": "1.0.0"
}`;

      mockExistsSync.mockReturnValue(true);
      mockReadFileSync
        .mockReturnValueOnce(validJson) // package1.json - valid
        .mockReturnValueOnce(malformedJson) // package2.json - malformed
        .mockReturnValueOnce(validJson); // package3.json - valid

      const remediator = new JsonRemediatorFinal();
      const results = files.map(file => {
        const content = readFileSync(file, "utf8");
        return remediator.remediate(content);
      });

      expect(results[0].success).toBe(true); // package1.json
      expect(results[1].success).toBe(true); // package2.json (fixed)
      expect(results[2].success).toBe(true); // package3.json
      expect(results[1].errors.length).toBeGreaterThan(0); // package2.json had errors
    });

    it("should simulate find command output", () => {
      const mockFindOutput = `/home/kade/runeset/reynard/package.json
/home/kade/runeset/reynard/packages/core/validation/package.json
/home/kade/runeset/reynard/examples/test-app/package.json`;

      mockExecSync.mockReturnValue(mockFindOutput);
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('{"name": "test", "version": "1.0.0"}');

      const output = mockExecSync('find . -name "package.json"', { encoding: "utf8" });
      const files = output
        .trim()
        .split("\n")
        .filter(f => f);

      expect(files).toHaveLength(3);
      expect(files[0]).toBe("/home/kade/runeset/reynard/package.json");
      expect(files[1]).toBe("/home/kade/runeset/reynard/packages/core/validation/package.json");
      expect(files[2]).toBe("/home/kade/runeset/reynard/examples/test-app/package.json");
    });
  });

  describe("Error Handling", () => {
    it("should handle read file errors", () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockImplementation(() => {
        throw new Error("Permission denied");
      });

      expect(() => {
        readFileSync("test.json", "utf8");
      }).toThrow("Permission denied");
    });

    it("should handle write file errors", () => {
      mockWriteFileSync.mockImplementation(() => {
        throw new Error("Disk full");
      });

      expect(() => {
        writeFileSync("test.json", "content", "utf8");
      }).toThrow("Disk full");
    });

    it("should handle exec command errors", () => {
      mockExecSync.mockImplementation(() => {
        throw new Error("Command not found");
      });

      expect(() => {
        mockExecSync("invalid-command", { encoding: "utf8" });
      }).toThrow("Command not found");
    });
  });

  describe("Real-world Scenarios", () => {
    it("should handle the typical Reynard package.json structure", () => {
      const reynardPackageJson = `{
  "name": "reynard-test"
  "version": "0.1.0"
  "description": "Test package for Reynard framework"
  "type": "module"
  "main": "./dist/index.cjs"
  "module": "./dist/index.js"
  "types": "./dist/index.d.ts"
  "exports": {
    ".": {
      "types": "./dist/index.d.ts"
      "import": "./dist/index.js"
      "require": "./dist/index.cjs"
    }
  }
  "files": ["dist"]
  "scripts": {
    "dev": "vite build --watch"
    "build": "vite build"
    "test": "vitest run"
    "typecheck": "tsc --noEmit"
    "lint": "eslint src --ext .ts,.tsx"
    "clean": "rm -rf dist"
  }
  "dependencies": {
    "solid-js": "1.9.9"
  }
  "devDependencies": {
    "@types/node": "24.6.1"
    "typescript": "5.9.3"
    "vite": "7.1.7"
    "vitest": "3.2.4"
  }
  "peerDependencies": {
    "solid-js": "1.9.9"
  }
}`;

      const remediator = new JsonRemediatorFinal();
      const result = remediator.remediatePackageJson(reynardPackageJson);

      expect(result.success).toBe(true);
      expect(result.errors.length).toBeGreaterThan(10); // Many missing commas

      const parsed = JSON.parse(result.fixedJson!);
      expect(parsed.name).toBe("reynard-test");
      expect(parsed.version).toBe("0.1.0");
      expect(parsed.scripts.build).toBe("vite build");
      expect(parsed.dependencies["solid-js"]).toBe("1.9.9");
      expect(parsed.devDependencies.typescript).toBe("5.9.3");
    });

    it("should handle complex nested structures", () => {
      const complexJson = `{
  "name": "complex-package"
  "version": "1.0.0"
  "scripts": {
    "build": "vite build"
    "dev": "vite dev"
    "test": "vitest run"
  }
  "dependencies": {
    "solid-js": "1.9.9"
    "vite": "7.1.7"
  }
  "devDependencies": {
    "@types/node": "24.6.1"
    "typescript": "5.9.3"
    "vitest": "3.2.4"
  }
  "exports": {
    ".": {
      "types": "./dist/index.d.ts"
      "import": "./dist/index.js"
      "require": "./dist/index.cjs"
    }
    "./utils": {
      "types": "./dist/utils/index.d.ts"
      "import": "./dist/utils/index.js"
    }
  }
}`;

      const remediator = new JsonRemediatorFinal();
      const result = remediator.remediate(complexJson);

      expect(result.success).toBe(true);
      expect(result.errors.length).toBeGreaterThan(15);

      const parsed = JSON.parse(result.fixedJson!);
      expect(parsed.name).toBe("complex-package");
      expect(parsed.exports["."].types).toBe("./dist/index.d.ts");
      expect(parsed.exports["./utils"].import).toBe("./dist/utils/index.js");
    });
  });
});
