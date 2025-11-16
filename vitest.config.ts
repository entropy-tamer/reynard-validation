import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./src/test-setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      thresholds: {
        global: {
          branches: 85,
          functions: 90,
          lines: 90,
          statements: 90,
        },
      },
    },
    // Exclude problematic dependencies from transformation
    server: {
      deps: {
        // Externalize playwright to avoid transformation issues
        external: ["playwright/test", "playwright"],
      },
    },
    // Optimize dependencies - exclude playwright from optimization
    optimizeDeps: {
      exclude: ["playwright/test", "playwright"],
    },
  },
  resolve: {
    alias: {
      // Mock playwright/test to avoid dependency issues
      "playwright/test": resolve(__dirname, "./src/__tests__/mocks/playwright-mock.ts"),
    },
  },
});
