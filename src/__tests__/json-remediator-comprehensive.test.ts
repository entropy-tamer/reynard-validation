/**
 * @fileoverview Comprehensive tests for JSON Remediator comma handling
 * @author Reynard Validation Package
 * @since 0.2.0
 */

import { describe, it, expect } from "vitest";
import { JsonRemediator } from "../json-remediator.js";

describe("JSON Remediator - Comprehensive Comma Handling", () => {
  const remediator = new JsonRemediator();

  describe("Missing Comma Detection", () => {
    it("should add missing commas between properties", () => {
      const malformedJson = `{
  "name": "test"
  "version": "1.0.0"
  "description": "Test package"
}`;

      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.errors.some(e => e.type === "missing-comma")).toBe(true);
      expect(result.fixedJson).toContain('"name": "test",');
      expect(result.fixedJson).toContain('"version": "1.0.0",');
      expect(result.fixedJson).not.toContain('"description": "Test package",'); // Last property shouldn't have comma
    });

    it("should add missing commas before nested objects", () => {
      const malformedJson = `{
  "name": "test"
  "scripts": {
    "build": "vite build"
  }
}`;

      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.errors.some(e => e.type === "missing-comma")).toBe(true);
      expect(result.fixedJson).toContain('"name": "test",');
    });

    it("should add missing commas before nested arrays", () => {
      const malformedJson = `{
  "name": "test"
  "keywords": [
    "test",
    "package"
  ]
}`;

      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.errors.some(e => e.type === "missing-comma")).toBe(true);
      expect(result.fixedJson).toContain('"name": "test",');
    });

    it("should NOT add commas before closing braces", () => {
      const malformedJson = `{
  "name": "test"
}`;

      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.fixedJson).not.toContain('"name": "test",');
      expect(result.fixedJson).toContain('"name": "test"');
    });

    it("should NOT add commas before closing brackets", () => {
      const malformedJson = `{
  "keywords": [
    "test"
  ]
}`;

      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.fixedJson).not.toContain('"test",');
      expect(result.fixedJson).toContain('"test"');
    });
  });

  describe("Trailing Comma Removal", () => {
    it("should remove trailing commas before closing braces", () => {
      const malformedJson = `{
  "name": "test",
  "version": "1.0.0",
}`;

      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.errors.some(e => e.type === "trailing-comma")).toBe(true);
      expect(result.fixedJson).not.toContain('"version": "1.0.0",');
      expect(result.fixedJson).toContain('"version": "1.0.0"');
    });

    it("should remove trailing commas before closing brackets", () => {
      const malformedJson = `{
  "keywords": [
    "test",
    "package",
  ]
}`;

      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.errors.some(e => e.type === "trailing-comma")).toBe(true);
      expect(result.fixedJson).not.toContain('"package",');
      expect(result.fixedJson).toContain('"package"');
    });

    it("should remove trailing commas on same line as closing brace", () => {
      const malformedJson = `{
  "name": "test",
  "version": "1.0.0",
}`;

      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.errors.some(e => e.type === "trailing-comma")).toBe(true);
      expect(result.fixedJson).not.toContain('"version": "1.0.0",');
    });

    it("should remove trailing commas on same line as closing bracket", () => {
      const malformedJson = `{
  "keywords": [
    "test",
    "package",
  ]
}`;

      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.errors.some(e => e.type === "trailing-comma")).toBe(true);
      expect(result.fixedJson).not.toContain('"package",');
    });
  });

  describe("Complex Nested Structures", () => {
    it("should handle deeply nested objects with missing commas", () => {
      const malformedJson = `{
  "name": "test"
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

      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.errors.some(e => e.type === "missing-comma")).toBe(true);

      const parsed = JSON.parse(result.fixedJson!);
      expect(parsed.name).toBe("test");
      expect(parsed.exports["."].types).toBe("./dist/index.d.ts");
      expect(parsed.exports["./utils"].import).toBe("./dist/utils/index.js");
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
      expect(result.errors.some(e => e.type === "missing-comma")).toBe(true);

      const parsed = JSON.parse(result.fixedJson!);
      expect(parsed.keywords).toEqual(["test", "package", "reynard"]);
      expect(parsed.files).toEqual(["dist", "src"]);
    });

    it("should handle mixed objects and arrays", () => {
      const malformedJson = `{
  "name": "test"
  "scripts": {
    "build": "vite build"
    "dev": "vite dev"
  }
  "keywords": [
    "test"
    "package"
  ]
  "dependencies": {
    "solid-js": "1.9.9"
  }
}`;

      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.errors.some(e => e.type === "missing-comma")).toBe(true);

      const parsed = JSON.parse(result.fixedJson!);
      expect(parsed.name).toBe("test");
      expect(parsed.scripts.build).toBe("vite build");
      expect(parsed.keywords).toEqual(["test", "package"]);
      expect(parsed.dependencies["solid-js"]).toBe("1.9.9");
    });
  });

  describe("Edge Cases with Structural Elements", () => {
    it("should handle single property objects", () => {
      const malformedJson = `{
  "name": "test"
}`;

      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.fixedJson).not.toContain('"name": "test",');
      expect(result.fixedJson).toContain('"name": "test"');
    });

    it("should handle single element arrays", () => {
      const malformedJson = `{
  "keywords": [
    "test"
  ]
}`;

      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.fixedJson).not.toContain('"test",');
      expect(result.fixedJson).toContain('"test"');
    });

    it("should handle empty objects", () => {
      const malformedJson = `{
  "empty": {}
  "name": "test"
}`;

      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.errors.some(e => e.type === "missing-comma")).toBe(true);
      expect(result.fixedJson).toContain('"empty": {},');
    });

    it("should handle empty arrays", () => {
      const malformedJson = `{
  "empty": []
  "name": "test"
}`;

      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.errors.some(e => e.type === "missing-comma")).toBe(true);
      expect(result.fixedJson).toContain('"empty": [],');
    });

    it("should handle null values correctly", () => {
      const malformedJson = `{
  "name": "test"
  "version": null
  "description": "Test package"
}`;

      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.errors.some(e => e.type === "missing-comma")).toBe(true);

      const parsed = JSON.parse(result.fixedJson!);
      expect(parsed.name).toBe("test");
      expect(parsed.version).toBe(null);
      expect(parsed.description).toBe("Test package");
    });

    it("should handle boolean values correctly", () => {
      const malformedJson = `{
  "name": "test"
  "private": true
  "description": "Test package"
}`;

      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.errors.some(e => e.type === "missing-comma")).toBe(true);

      const parsed = JSON.parse(result.fixedJson!);
      expect(parsed.name).toBe("test");
      expect(parsed.private).toBe(true);
      expect(parsed.description).toBe("Test package");
    });

    it("should handle numeric values correctly", () => {
      const malformedJson = `{
  "name": "test"
  "version": 1
  "description": "Test package"
}`;

      const result = remediator.remediate(malformedJson);

      expect(result.success).toBe(true);
      expect(result.errors.some(e => e.type === "missing-comma")).toBe(true);

      const parsed = JSON.parse(result.fixedJson!);
      expect(parsed.name).toBe("test");
      expect(parsed.version).toBe(1);
      expect(parsed.description).toBe("Test package");
    });
  });

  describe("Real-world Package.json Scenarios", () => {
    it("should handle typical Reynard package.json structure", () => {
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

      const result = remediator.remediate(reynardPackageJson);

      expect(result.success).toBe(true);
      expect(result.errors.some(e => e.type === "missing-comma")).toBe(true);

      const parsed = JSON.parse(result.fixedJson!);
      expect(parsed.name).toBe("reynard-test");
      expect(parsed.version).toBe("0.1.0");
      expect(parsed.scripts.build).toBe("vite build");
      expect(parsed.dependencies["solid-js"]).toBe("1.9.9");
      expect(parsed.devDependencies.typescript).toBe("5.9.3");
    });

    it("should handle package.json with trailing commas", () => {
      const trailingCommaJson = `{
  "name": "test",
  "version": "1.0.0",
  "scripts": {
    "build": "vite build",
    "dev": "vite dev",
  },
  "dependencies": {
    "solid-js": "1.9.9",
  },
}`;

      const result = remediator.remediate(trailingCommaJson);

      expect(result.success).toBe(true);
      expect(result.errors.some(e => e.type === "trailing-comma")).toBe(true);

      const parsed = JSON.parse(result.fixedJson!);
      expect(parsed.name).toBe("test");
      expect(parsed.version).toBe("1.0.0");
      expect(parsed.scripts.build).toBe("vite build");
      expect(parsed.dependencies["solid-js"]).toBe("1.9.9");
    });
  });

  describe("Combined Error Scenarios", () => {
    it("should handle both missing and trailing commas", () => {
      const mixedJson = `{
  "name": "test"
  "version": "1.0.0"
  "scripts": {
    "build": "vite build"
    "dev": "vite dev",
  },
  "dependencies": {
    "solid-js": "1.9.9"
  },
}`;

      const result = remediator.remediate(mixedJson);

      expect(result.success).toBe(true);
      expect(result.errors.some(e => e.type === "missing-comma")).toBe(true);
      expect(result.errors.some(e => e.type === "trailing-comma")).toBe(true);

      const parsed = JSON.parse(result.fixedJson!);
      expect(parsed.name).toBe("test");
      expect(parsed.version).toBe("1.0.0");
      expect(parsed.scripts.build).toBe("vite build");
      expect(parsed.dependencies["solid-js"]).toBe("1.9.9");
    });

    it("should handle missing quotes and missing commas", () => {
      const mixedJson = `{
  name: "test"
  version: "1.0.0"
  description: "Test package"
}`;

      const result = remediator.remediate(mixedJson);

      expect(result.success).toBe(true);
      expect(result.errors.some(e => e.type === "missing-quote")).toBe(true);
      expect(result.errors.some(e => e.type === "missing-comma")).toBe(true);

      const parsed = JSON.parse(result.fixedJson!);
      expect(parsed.name).toBe("test");
      expect(parsed.version).toBe("1.0.0");
      expect(parsed.description).toBe("Test package");
    });
  });

  describe("Integration Tests with Real Package.json Files", () => {
    it("should handle real package.json from core/validation", () => {
      const realPackageJson = `{
  "name": "reynard-validation",
  "version": "0.2.0",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "vite build && rm -f tsconfig.tsbuildinfo && tsc -p tsconfig.json --declaration --noEmit false",
    "dev": "vite dev",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint src --ext .ts,.tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "solid-js": "1.9.9"
  },
  "devDependencies": {
    "@types/node": "^22.10.2",
    "typescript": "^5.7.2",
    "vite": "^6.0.3",
    "vitest": "^3.2.4"
  }
}`;

      const result = remediator.remediate(realPackageJson);

      expect(result.success).toBe(true);
      expect(result.unfixableErrors).toHaveLength(0);
    });

    it("should handle malformed real package.json with missing commas", () => {
      const malformedPackageJson = `{
  "name": "reynard-validation"
  "version": "0.2.0"
  "type": "module"
  "exports": {
    ".": {
      "types": "./dist/index.d.ts"
      "import": "./dist/index.js"
      "require": "./dist/index.cjs"
    }
  }
  "files": [
    "dist"
  ]
  "scripts": {
    "build": "vite build && rm -f tsconfig.tsbuildinfo && tsc -p tsconfig.json --declaration --noEmit false"
    "dev": "vite dev"
    "test": "vitest run"
    "test:watch": "vitest"
    "lint": "eslint src --ext .ts,.tsx --report-unused-disable-directives --max-warnings 0"
    "type-check": "tsc --noEmit"
  }
  "dependencies": {
    "solid-js": "1.9.9"
  }
  "devDependencies": {
    "@types/node": "^22.10.2"
    "typescript": "^5.7.2"
    "vite": "^6.0.3"
    "vitest": "^3.2.4"
  }
}`;

      const result = remediator.remediate(malformedPackageJson);

      expect(result.success).toBe(true);
      expect(result.errors.some(e => e.type === "missing-comma")).toBe(true);
      expect(result.unfixableErrors).toHaveLength(0);
    });

    it("should handle real package.json with trailing commas", () => {
      const trailingCommaPackageJson = `{
  "name": "reynard-validation",
  "version": "0.2.0",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
    },
  },
  "files": [
    "dist",
  ],
  "scripts": {
    "build": "vite build && rm -f tsconfig.tsbuildinfo && tsc -p tsconfig.json --declaration --noEmit false",
    "dev": "vite dev",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint src --ext .ts,.tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit",
  },
  "dependencies": {
    "solid-js": "1.9.9",
  },
  "devDependencies": {
    "@types/node": "^22.10.2",
    "typescript": "^5.7.2",
    "vite": "^6.0.3",
    "vitest": "^3.2.4",
  },
}`;

      const result = remediator.remediate(trailingCommaPackageJson);

      expect(result.success).toBe(true);
      expect(result.errors.some(e => e.type === "trailing-comma")).toBe(true);
      expect(result.unfixableErrors).toHaveLength(0);
    });
  });
});
