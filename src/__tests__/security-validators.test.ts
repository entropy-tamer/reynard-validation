/**
 * Tests for security validators detecting Contagious Interview attack vectors.
 *
 * @since 1.0.0
 */

import { describe, expect, it } from "vitest";
import {
  KNOWN_MALICIOUS_URLS,
  MALICIOUS_JSON_STORAGE_DOMAINS,
  SecurityValidators,
} from "../validators/security-validators.js";
import type { ValidationSchema } from "../types.js";

describe("SecurityValidators", () => {
  const mockSchema: ValidationSchema = { type: "string" };

  describe("isBase64Encoded", () => {
    it("should detect valid base64-encoded strings", () => {
      expect(SecurityValidators.isBase64Encoded("aHR0cHM6Ly9qc29ua2VlcGVyLmNvbS9iL0dOT1g0")).toBe(
        true
      );
      expect(SecurityValidators.isBase64Encoded("dGVzdA==")).toBe(true);
      expect(SecurityValidators.isBase64Encoded("YWJj")).toBe(true);
    });

    it("should reject invalid base64 strings", () => {
      expect(SecurityValidators.isBase64Encoded("not base64!")).toBe(false);
      expect(SecurityValidators.isBase64Encoded("")).toBe(false);
      expect(SecurityValidators.isBase64Encoded("abc")).toBe(false); // Too short
      expect(SecurityValidators.isBase64Encoded("abc@def")).toBe(false); // Invalid character
    });
  });

  describe("decodeBase64", () => {
    it("should decode valid base64 strings", () => {
      const testUrl = "https://jsonkeeper.com/b/GNOX4";
      const encoded = btoa(testUrl);
      const decoded = SecurityValidators.decodeBase64(encoded);
      expect(decoded).toBe(testUrl);
    });

    it("should return null for invalid base64", () => {
      expect(SecurityValidators.decodeBase64("invalid!")).toBeNull();
      expect(SecurityValidators.decodeBase64("")).toBeNull();
    });
  });

  describe("isJsonStorageUrl", () => {
    it("should detect known malicious JSON storage domains", () => {
      expect(SecurityValidators.isJsonStorageUrl("https://jsonkeeper.com/b/GNOX4")).toBe(true);
      expect(SecurityValidators.isJsonStorageUrl("https://www.jsonkeeper.com/b/VBFK7")).toBe(
        true
      );
      expect(SecurityValidators.isJsonStorageUrl("https://api.jsonsilo.com/public/123")).toBe(
        true
      );
      expect(SecurityValidators.isJsonStorageUrl("https://api.npoint.io/abc123")).toBe(true);
    });

    it("should detect obfuscated URLs (hxxp/hxxps)", () => {
      expect(SecurityValidators.isJsonStorageUrl("hxxps://jsonkeeper.com/b/GNOX4")).toBe(true);
      expect(SecurityValidators.isJsonStorageUrl("hxxp://api.npoint.io/test")).toBe(true);
    });

    it("should reject non-JSON storage URLs", () => {
      expect(SecurityValidators.isJsonStorageUrl("https://example.com/api")).toBe(false);
      expect(SecurityValidators.isJsonStorageUrl("https://github.com/user/repo")).toBe(false);
      expect(SecurityValidators.isJsonStorageUrl("https://api.example.com/data")).toBe(false);
    });
  });

  describe("isKnownMaliciousUrl", () => {
    it("should detect known malicious IOCs", () => {
      // Test with actual IOCs from research document
      const testIocs = [
        "hxxps://jsonkeeper.com/b/GNOX4",
        "hxxps://api.jsonsilo.com/public/0048f102-336f-45dd-aef6-3641158a4c5d",
        "hxxps://api.npoint.io/e6a6bfb97a294115677d",
      ];

      for (const ioc of testIocs) {
        expect(SecurityValidators.isKnownMaliciousUrl(ioc)).toBe(true);
      }
    });

    it("should reject non-malicious URLs", () => {
      expect(SecurityValidators.isKnownMaliciousUrl("https://example.com/api")).toBe(false);
      expect(
        SecurityValidators.isKnownMaliciousUrl("https://jsonkeeper.com/b/UNKNOWN")
      ).toBe(false);
    });
  });

  describe("detectBase64JsonStorageUrl", () => {
    it("should detect base64-encoded JSON storage URLs", () => {
      const errors: string[] = [];
      const maliciousUrl = "https://jsonkeeper.com/b/GNOX4";
      const encoded = btoa(maliciousUrl);

      SecurityValidators.detectBase64JsonStorageUrl(encoded, "configUrl", errors, mockSchema);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain("base64-encoded JSON storage");
    });

    it("should detect known malicious IOCs with CRITICAL severity", () => {
      const errors: string[] = [];
      const maliciousIoc = "hxxps://jsonkeeper.com/b/GNOX4";
      const encoded = btoa(maliciousIoc.replace(/^hxxps?:\/\//i, "https://"));

      SecurityValidators.detectBase64JsonStorageUrl(encoded, "configUrl", errors, mockSchema);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain("CRITICAL");
      expect(errors[0]).toContain("known malicious IOC");
    });

    it("should not trigger on non-base64 values", () => {
      const errors: string[] = [];
      SecurityValidators.detectBase64JsonStorageUrl(
        "not base64",
        "configUrl",
        errors,
        mockSchema
      );
      expect(errors.length).toBe(0);
    });

    it("should not trigger on base64 that doesn't decode to JSON storage URL", () => {
      const errors: string[] = [];
      const safeUrl = "https://example.com/api";
      const encoded = btoa(safeUrl);

      SecurityValidators.detectBase64JsonStorageUrl(encoded, "configUrl", errors, mockSchema);

      expect(errors.length).toBe(0);
    });

    it("should handle non-string values gracefully", () => {
      const errors: string[] = [];
      SecurityValidators.detectBase64JsonStorageUrl(123, "configUrl", errors, mockSchema);
      expect(errors.length).toBe(0);
    });
  });

  describe("validateConfigFileSecurity", () => {
    it("should detect threats in config file content", () => {
      const errors: string[] = [];
      const maliciousUrl = "https://jsonkeeper.com/b/GNOX4";
      const encoded = btoa(maliciousUrl);
      const configContent = `API_KEY=sk_live_1234567890abcdef\nCONFIG_URL=${encoded}\n`;

      SecurityValidators.validateConfigFileSecurity(configContent, errors);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain("CONFIG_URL");
      expect(errors[0]).toContain("base64-encoded JSON storage");
    });

    it("should detect multiple threats in config file", () => {
      const errors: string[] = [];
      const maliciousUrl1 = "https://jsonkeeper.com/b/GNOX4";
      const maliciousUrl2 = "hxxps://api.npoint.io/test123";
      const encoded1 = btoa(maliciousUrl1);
      const encoded2 = btoa(maliciousUrl2.replace(/^hxxps?:\/\//i, "https://"));
      const configContent = `CONFIG_URL=${encoded1}\nSECRET_KEY=${encoded2}\n`;

      SecurityValidators.validateConfigFileSecurity(configContent, errors);

      expect(errors.length).toBeGreaterThanOrEqual(2);
    });

    it("should not trigger false positives on safe config content", () => {
      const errors: string[] = [];
      const safeContent = `API_KEY=sk_live_1234567890abcdef\nDATABASE_URL=postgresql://user:pass@localhost/db\nNODE_ENV=production\n`;

      SecurityValidators.validateConfigFileSecurity(safeContent, errors);

      expect(errors.length).toBe(0);
    });

    it("should handle strict mode", () => {
      const errors: string[] = [];
      const maliciousUrl = "https://jsonkeeper.com/b/GNOX4";
      const encoded = btoa(maliciousUrl);
      const configContent = `CONFIG_URL=${encoded}\n`;

      SecurityValidators.validateConfigFileSecurity(configContent, errors, { strict: true });

      expect(errors.length).toBeGreaterThan(1);
      expect(errors.some((e) => e.includes("validation failed"))).toBe(true);
    });

    it("should handle empty config content", () => {
      const errors: string[] = [];
      SecurityValidators.validateConfigFileSecurity("", errors);
      expect(errors.length).toBe(0);
    });
  });

  describe("isKnownMaliciousJsonStorage", () => {
    it("should detect known malicious JSON storage services", () => {
      expect(
        SecurityValidators.isKnownMaliciousJsonStorage("hxxps://jsonkeeper.com/b/GNOX4")
      ).toBe(true);
      expect(
        SecurityValidators.isKnownMaliciousJsonStorage(
          "hxxps://api.jsonsilo.com/public/0048f102-336f-45dd-aef6-3641158a4c5d"
        )
      ).toBe(true);
    });

    it("should reject non-malicious URLs", () => {
      expect(SecurityValidators.isKnownMaliciousJsonStorage("https://example.com/api")).toBe(
        false
      );
    });
  });

  describe("IOC validation", () => {
    it("should have malicious domains configured", () => {
      expect(MALICIOUS_JSON_STORAGE_DOMAINS.has("jsonkeeper.com")).toBe(true);
      expect(MALICIOUS_JSON_STORAGE_DOMAINS.has("www.jsonkeeper.com")).toBe(true);
      expect(MALICIOUS_JSON_STORAGE_DOMAINS.has("jsonsilo.com")).toBe(true);
      expect(MALICIOUS_JSON_STORAGE_DOMAINS.has("api.jsonsilo.com")).toBe(true);
      expect(MALICIOUS_JSON_STORAGE_DOMAINS.has("npoint.io")).toBe(true);
      expect(MALICIOUS_JSON_STORAGE_DOMAINS.has("api.npoint.io")).toBe(true);
    });

    it("should have known malicious URLs from research document", () => {
      expect(KNOWN_MALICIOUS_URLS.size).toBeGreaterThan(0);
      expect(
        Array.from(KNOWN_MALICIOUS_URLS).some((url) => url.includes("jsonkeeper.com/b/GNOX4"))
      ).toBe(true);
      expect(
        Array.from(KNOWN_MALICIOUS_URLS).some((url) =>
          url.includes("api.jsonsilo.com/public/0048f102")
        )
      ).toBe(true);
      expect(
        Array.from(KNOWN_MALICIOUS_URLS).some((url) =>
          url.includes("api.npoint.io/e6a6bfb97a294115677d")
        )
      ).toBe(true);
    });

    it("should detect all known IOCs from research document", () => {
      // Test a sample of IOCs
      const testIocs = [
        "hxxps://jsonkeeper.com/b/GNOX4",
        "hxxps://jsonkeeper.com/b/IARGW",
        "hxxps://api.jsonsilo.com/public/0048f102-336f-45dd-aef6-3641158a4c5d",
        "hxxps://api.npoint.io/e6a6bfb97a294115677d",
        "hxxps://api.npoint.io/8df659fd009b5af90d35",
      ];

      for (const ioc of testIocs) {
        expect(SecurityValidators.isKnownMaliciousUrl(ioc)).toBe(true);
        expect(SecurityValidators.isJsonStorageUrl(ioc)).toBe(true);
      }
    });
  });

  describe("Real-world attack pattern detection", () => {
    it("should detect the Contagious Interview attack pattern", () => {
      // Simulate the attack pattern: base64-encoded JSON storage URL in config
      const errors: string[] = [];
      const attackPayload = "aHR0cHM6Ly9qc29ua2VlcGVyLmNvbS9iL0dOT1g0"; // Base64 of https://jsonkeeper.com/b/GNOX4

      SecurityValidators.detectBase64JsonStorageUrl(attackPayload, "API_KEY", errors, mockSchema);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain("base64-encoded JSON storage");
    });

    it("should detect obfuscated URLs in base64", () => {
      const errors: string[] = [];
      // Obfuscated URL (hxxps) encoded in base64
      const obfuscatedUrl = "hxxps://api.npoint.io/test123";
      const normalized = obfuscatedUrl.replace(/^hxxps?:\/\//i, "https://");
      const encoded = btoa(normalized);

      SecurityValidators.detectBase64JsonStorageUrl(encoded, "CONFIG_URL", errors, mockSchema);

      expect(errors.length).toBeGreaterThan(0);
    });
  });
});

