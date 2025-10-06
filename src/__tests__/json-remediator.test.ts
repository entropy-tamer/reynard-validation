/**
 * @fileoverview Tests for JSON Remediator
 * @author Reynard Validation Package
 * @since 0.2.0
 */

import { describe, it, expect, beforeEach } from "vitest";
import { JsonRemediator, fixJsonSyntax, fixPackageJson } from "../json-remediator.js";
import { JsonRemediatorFinal } from "../json-remediator-final.js";

describe("JsonRemediator", () => {
  const remediator = new JsonRemediatorFinal();

  describe("fixMissingCommas", () => {
    it("should fix missing commas after property values", () => {
      const malformedJson = `{
  "name": "test"
  "version": "1.0.0"
  "description": "Test package"
}`;

      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].type).toBe("missing-comma");
      expect(result.fixedJson).toContain('"name": "test",');
      expect(result.fixedJson).toContain('"version": "1.0.0",');
    });

    it("should fix missing commas in nested objects", () => {
      const malformedJson = `{
  "scripts": {
    "build": "vite build"
    "dev": "vite dev"
  }
  "dependencies": {
    "solid-js": "1.9.9"
  }
}`;

      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.fixedJson).toContain('"build": "vite build",');
      expect(result.fixedJson).toContain('"dev": "vite dev"');
    });
  });

  describe("fixTrailingCommas", () => {
    it("should remove trailing commas before closing braces", () => {
      const malformedJson = `{
  "name": "test",
  "version": "1.0.0",
}`;

      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].type).toBe("trailing-comma");
      expect(result.fixedJson).not.toContain('"version": "1.0.0",');
      expect(result.fixedJson).toContain('"version": "1.0.0"');
    });

    it("should remove trailing commas in arrays", () => {
      const malformedJson = `{
  "keywords": [
    "test",
    "package",
  ]
}`;

      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].type).toBe("trailing-comma");
      expect(result.fixedJson).not.toContain('"package",');
      expect(result.fixedJson).toContain('"package"');
    });
  });

  describe("fixMissingQuotes", () => {
    it("should add quotes around unquoted property names", () => {
      const malformedJson = `{
  name: "test",
  version: "1.0.0"
}`;

      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].type).toBe("missing-quote");
      expect(result.fixedJson).toContain('"name": "test"');
      expect(result.fixedJson).toContain('"version": "1.0.0"');
    });
  });

  describe("fixMalformedStructures", () => {
    it("should add missing closing braces", () => {
      const malformedJson = `{
  "name": "test",
  "version": "1.0.0"`;

      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].type).toBe("malformed-object");
      expect(result.fixedJson).toContain("}");
    });

    it("should add missing closing brackets", () => {
      const malformedJson = `{
  "keywords": [
    "test",
    "package"`;

      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].type).toBe("malformed-array");
      expect(result.fixedJson).toContain("]");
    });
  });

  describe("remediatePackageJson", () => {
    it("should validate package.json specific fields", () => {
      const malformedPackageJson = `{
  "name": "test-package"
  "version": "1.0.0"
  "description": "Test package"
}`;

      const result = remediator.remediatePackageJson(malformedPackageJson);

      expect(result.success).toBe(true);
      expect(result.errors.length).toBeGreaterThan(0);

      // Should be able to parse the result
      const parsed = JSON.parse(result.fixedJson!);
      expect(parsed.name).toBe("test-package");
      expect(parsed.version).toBe("1.0.0");
    });

    it("should detect missing required fields", () => {
      const malformedPackageJson = `{
  "description": "Test package"
}`;

      const result = remediator.remediatePackageJson(malformedPackageJson);

      expect(result.unfixableErrors).toContain("Missing required field: name");
      expect(result.unfixableErrors).toContain("Missing required field: version");
    });

    it("should validate version format", () => {
      const malformedPackageJson = `{
  "name": "test-package",
  "version": "invalid-version"
}`;

      const result = remediator.remediatePackageJson(malformedPackageJson);

      expect(result.unfixableErrors).toContain("Invalid version format. Expected semantic version (e.g., 1.0.0)");
    });
  });

  describe("utility functions", () => {
    it("fixJsonSyntax should work as a utility function", () => {
      const malformedJson = `{
  "name": "test"
  "version": "1.0.0"
}`;

      const fixed = fixJsonSyntax(malformedJson);

      expect(fixed).toContain('"name": "test",');
      expect(fixed).toContain('"version": "1.0.0"');
    });

    it("fixPackageJson should work as a utility function", () => {
      const malformedPackageJson = `{
  "name": "test-package"
  "version": "1.0.0"
}`;

      const fixed = fixPackageJson(malformedPackageJson);

      expect(fixed).toContain('"name": "test-package",');
      expect(fixed).toContain('"version": "1.0.0"');
    });
  });

  describe("complex scenarios", () => {
    it("should handle multiple types of errors in one file", () => {
      const malformedJson = `{
  name: "test-package"
  "version": "1.0.0"
  "scripts": {
    "build": "vite build"
    "dev": "vite dev"
  }
  "dependencies": {
    "solid-js": "1.9.9"
  }
}`;

      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.errors.length).toBeGreaterThan(3);

      // Should be able to parse the result
      const parsed = JSON.parse(result.fixedJson!);
      expect(parsed.name).toBe("test-package");
      expect(parsed.version).toBe("1.0.0");
      expect(parsed.scripts.build).toBe("vite build");
    });
  });
});

describe("JsonRemediatorFinal", () => {
  let remediator: JsonRemediatorFinal;

  beforeEach(() => {
    remediator = new JsonRemediatorFinal();
  });

  describe("Basic JSON Remediation", () => {
    it("should handle already valid JSON", () => {
      const validJson = '{"name": "test", "version": "1.0.0"}';
      const result = remediator.remediate(validJson);

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.fixedJson).toBe(validJson);
    });

    it("should fix missing commas in simple objects", () => {
      const malformedJson = `{
  "name": "test-package"
  "version": "1.0.0"
  "description": "A test package"
}`;

      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.type === "missing-comma")).toBe(true);

      // Should be parseable
      const parsed = JSON.parse(result.fixedJson!);
      expect(parsed.name).toBe("test-package");
      expect(parsed.version).toBe("1.0.0");
      expect(parsed.description).toBe("A test package");
    });

    it("should fix trailing commas", () => {
      const malformedJson = `{
  "name": "test",
  "version": "1.0.0",
}`;

      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.errors.some(e => e.type === "trailing-comma")).toBe(true);

      const parsed = JSON.parse(result.fixedJson!);
      expect(parsed.name).toBe("test");
      expect(parsed.version).toBe("1.0.0");
    });

    it("should fix missing quotes around property names", () => {
      const malformedJson = `{
  name: "test",
  version: "1.0.0"
}`;

      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.errors.some(e => e.type === "missing-quote")).toBe(true);

      const parsed = JSON.parse(result.fixedJson!);
      expect(parsed.name).toBe("test");
      expect(parsed.version).toBe("1.0.0");
    });

    it("should fix missing closing braces", () => {
      const malformedJson = `{
  "name": "test",
  "version": "1.0.0"`;

      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.errors.some(e => e.type === "malformed-object")).toBe(true);

      const parsed = JSON.parse(result.fixedJson!);
      expect(parsed.name).toBe("test");
      expect(parsed.version).toBe("1.0.0");
    });
  });

  describe("Complex Package.json Scenarios", () => {
    it("should fix a typical broken package.json", () => {
      const brokenPackageJson = `{
  "name": "reynard-test"
  "version": "0.1.0"
  "description": "Test package for Reynard"
  "type": "module"
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
    "typescript": "5.9.3"
    "vitest": "3.2.4"
  }
}`;

      const result = remediator.remediatePackageJson(brokenPackageJson);

      expect(result.success).toBe(true);
      expect(result.errors.length).toBeGreaterThan(5);

      const parsed = JSON.parse(result.fixedJson!);
      expect(parsed.name).toBe("reynard-test");
      expect(parsed.version).toBe("0.1.0");
      expect(parsed.scripts.build).toBe("vite build");
      expect(parsed.dependencies["solid-js"]).toBe("1.9.9");
      expect(parsed.devDependencies.typescript).toBe("5.9.3");
    });

    it("should handle nested objects with missing commas", () => {
      const malformedJson = `{
  "scripts": {
    "build": "vite build"
    "dev": "vite dev"
    "preview": "vite preview"
  }
  "dependencies": {
    "solid-js": "1.9.9"
    "vite": "7.1.7"
  }
}`;

      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.errors.length).toBeGreaterThan(0);

      const parsed = JSON.parse(result.fixedJson!);
      expect(parsed.scripts.build).toBe("vite build");
      expect(parsed.scripts.dev).toBe("vite dev");
      expect(parsed.dependencies["solid-js"]).toBe("1.9.9");
    });

    it("should handle arrays with missing commas", () => {
      const malformedJson = `{
  "keywords": [
    "test"
    "package"
    "reynard"
  ]
  "files": [
    "dist"
    "src"
  ]
}`;

      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.errors.length).toBeGreaterThan(0);

      const parsed = JSON.parse(result.fixedJson!);
      expect(parsed.keywords).toEqual(["test", "package", "reynard"]);
      expect(parsed.files).toEqual(["dist", "src"]);
    });
  });

  describe("Package.json Specific Validation", () => {
    it("should validate required fields", () => {
      const incompletePackageJson = `{
  "description": "A test package"
}`;

      const result = remediator.remediatePackageJson(incompletePackageJson);

      expect(result.unfixableErrors).toContain("Missing required field: name");
      expect(result.unfixableErrors).toContain("Missing required field: version");
    });

    it("should validate version format", () => {
      const invalidVersionPackageJson = `{
  "name": "test-package",
  "version": "not-a-version"
}`;

      const result = remediator.remediatePackageJson(invalidVersionPackageJson);

      expect(result.unfixableErrors).toContain("Invalid version format. Expected semantic version (e.g., 1.0.0)");
    });

    it("should accept valid semantic versions", () => {
      const validPackageJson = `{
  "name": "test-package",
  "version": "1.2.3"
}`;

      const result = remediator.remediatePackageJson(validPackageJson);

      expect(result.success).toBe(true);
      expect(result.unfixableErrors).not.toContain("Invalid version format");
    });

    it("should accept pre-release versions", () => {
      const preReleasePackageJson = `{
  "name": "test-package",
  "version": "1.0.0-beta.1"
}`;

      const result = remediator.remediatePackageJson(preReleasePackageJson);

      expect(result.success).toBe(true);
      expect(result.unfixableErrors).not.toContain("Invalid version format");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty objects", () => {
      const emptyJson = "{}";
      const result = remediator.remediate(emptyJson);

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.fixedJson).toBe(emptyJson);
    });

    it("should handle empty arrays", () => {
      const emptyArrayJson = '{"items": []}';
      const result = remediator.remediate(emptyArrayJson);

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.fixedJson).toBe(emptyArrayJson);
    });

    it("should handle deeply nested structures", () => {
      const nestedJson = `{
  "level1": {
    "level2": {
      "level3": {
        "value": "test"
      }
    }
  }
}`;

      const result = remediator.remediate(nestedJson);

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.fixedJson).toBe(nestedJson);
    });

    it("should handle mixed data types", () => {
      const mixedJson = `{
  "string": "value"
  "number": 42
  "boolean": true
  "null": null
  "array": [1, 2, 3]
  "object": {"nested": "value"}
}`;

      const result = remediator.remediate(mixedJson);

      expect(result.success).toBe(true);
      expect(result.errors.length).toBeGreaterThan(0);

      const parsed = JSON.parse(result.fixedJson!);
      expect(parsed.string).toBe("value");
      expect(parsed.number).toBe(42);
      expect(parsed.boolean).toBe(true);
      expect(parsed.null).toBe(null);
      expect(parsed.array).toEqual([1, 2, 3]);
      expect(parsed.object.nested).toBe("value");
    });
  });

  describe("Error Handling", () => {
    it("should handle completely malformed JSON gracefully", () => {
      const malformedJson = "this is not json at all";
      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(false);
      expect(result.unfixableErrors.length).toBeGreaterThan(0);
    });

    it("should handle partial JSON objects", () => {
      const partialJson = `{
  "name": "test"
  "version": "1.0.0"
  "incomplete": {`;

      const result = remediator.remediate(partialJson);

      // Should attempt to fix what it can
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should handle JSON with comments (which are invalid)", () => {
      const jsonWithComments = `{
  "name": "test",
  // This is a comment
  "version": "1.0.0"
}`;

      const result = remediator.remediate(jsonWithComments);

      // Comments are not valid JSON, so this should fail
      expect(result.success).toBe(false);
    });
  });

  describe("Performance and Large Files", () => {
    it("should handle reasonably large JSON objects", () => {
      // Create a large JSON object with many properties
      const largeJson = {
        name: "large-package",
        version: "1.0.0",
        ...Object.fromEntries(Array.from({ length: 100 }, (_, i) => [`prop${i}`, `value${i}`])),
      };

      const malformedJson = JSON.stringify(largeJson).replace(/,/g, "\n  ");
      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
