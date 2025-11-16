/**
 * Security validation utilities for detecting malicious patterns and attack vectors.
 *
 * This module provides security-focused validators to detect and prevent
 * various attack vectors, including the Contagious Interview campaign's
 * use of base64-encoded JSON storage service URLs for malware delivery.
 *
 * @example
 * ```typescript
 * import { SecurityValidators } from './security-validators.js';
 *
 * const errors: string[] = [];
 * SecurityValidators.detectBase64JsonStorageUrl(
 *   'aHR0cHM6Ly9qc29ua2VlcGVyLmNvbS9iL0dOT1g0',
 *   'configUrl',
 *   errors,
 *   schema
 * );
 * ```
 *
 * @since 1.0.0
 * @author Energetic-Essential-70
 *
 * @remarks
 * Reference: NVISO Labs - Contagious Interview Actors Now Utilize JSON Storage
 * Services for Malware Delivery (November 13, 2025)
 */

import type { ValidationSchema } from "../types.js";

/**
 * Known malicious JSON storage service domains from Contagious Interview IOCs.
 */
export const MALICIOUS_JSON_STORAGE_DOMAINS = new Set([
  "jsonkeeper.com",
  "www.jsonkeeper.com",
  "jsonsilo.com",
  "api.jsonsilo.com",
  "npoint.io",
  "api.npoint.io",
]);

/**
 * Known malicious JSON storage URLs from Contagious Interview IOCs.
 */
export const KNOWN_MALICIOUS_URLS = new Set([
  "hxxps://jsonkeeper.com/b/GNOX4",
  "hxxps://jsonkeeper.com/b/IARGW",
  "hxxps://jsonkeeper.com/b/FM8D6",
  "hxxps://jsonkeeper.com/b/GCGEX",
  "hxxps://jsonkeeper.com/b/IXHS4",
  "hxxps://jsonkeeper.com/b/86H03",
  "hxxps://jsonkeeper.com/b/6OCFY",
  "hxxps://jsonkeeper.com/b/E4YPZ",
  "hxxps://jsonkeeper.com/b/8RLOV",
  "hxxps://jsonkeeper.com/b/BADWN",
  "hxxps://jsonkeeper.com/b/4NAKK",
  "hxxps://jsonkeeper.com/b/JV43N",
  "hxxps://www.jsonkeeper.com/b/VBFK7",
  "hxxps://www.jsonkeeper.com/b/JNGUQ",
  "hxxps://www.jsonkeeper.com/b/O2QKK",
  "hxxps://www.jsonkeeper.com/b/RZATI",
  "hxxps://www.jsonkeeper.com/b/T7Q4V",
  "hxxps://api.jsonsilo.com/public/0048f102-336f-45dd-aef6-3641158a4c5d",
  "hxxps://api.jsonsilo.com/public/942acd98-8c8c-47d8-8648-0456b740ef8b",
  "hxxps://api.npoint.io/e6a6bfb97a294115677d",
  "hxxps://api.npoint.io/8df659fd009b5af90d35",
  "hxxps://api.npoint.io/f4be0f7713a6fcdaac8b",
  "hxxps://api.npoint.io/148984729e1384cbe212",
  "hxxps://api.npoint.io/2169940221e8b67d2312",
  "hxxps://api.npoint.io/a1dbf5a9d5d0636edf76",
  "hxxps://api.npoint.io/62755a9b33836b5a6c28",
  "hxxps://api.npoint.io/336c17cbc9abf234d423",
  "hxxps://api.npoint.io/832d58932fcfb3065bc7",
  "hxxps://api.npoint.io/cb0f9d0d03f50a5e1ebe",
  "hxxps://api.npoint.io/f6dd89c1dd59234873cb",
  "hxxps://api.npoint.io/03f98fa639fa37675526",
  "hxxps://api.npoint.io/38acf86b6eb42b51b9c2",
]);

/**
 * Collection of static methods for security validation.
 *
 * This class provides security-focused validation methods to detect
 * malicious patterns and attack vectors, including the Contagious Interview
 * campaign's use of base64-encoded JSON storage service URLs.
 *
 * @since 1.0.0
 */
export class SecurityValidators {
  /**
   * Checks if a string is base64-encoded.
   *
   * @param value - The value to check
   * @returns True if the string appears to be base64-encoded
   *
   * @example
   * ```typescript
   * SecurityValidators.isBase64Encoded('aHR0cHM6Ly9qc29ua2VlcGVyLmNvbS9iL0dOT1g0');
   * // Returns: true
   * ```
   *
   * @since 1.0.0
   */
  static isBase64Encoded(value: string): boolean {
    if (!value || value.length < 4) {
      return false;
    }

    // Base64 strings are typically alphanumeric with +, /, and = padding
    const base64Pattern = /^[A-Za-z0-9+/]+=*$/;
    if (!base64Pattern.test(value)) {
      return false;
    }

    // Try to decode it
    try {
      const decoded = atob(value);
      // Check if decoded result is valid UTF-8 (likely a URL)
      decodeURIComponent(escape(decoded));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Decodes a base64-encoded string.
   *
   * @param encodedValue - Base64-encoded string
   * @returns Decoded string if successful, null otherwise
   *
   * @example
   * ```typescript
   * SecurityValidators.decodeBase64('aHR0cHM6Ly9qc29ua2VlcGVyLmNvbS9iL0dOT1g0');
   * // Returns: 'https://jsonkeeper.com/b/GNOX4'
   * ```
   *
   * @since 1.0.0
   */
  static decodeBase64(encodedValue: string): string | null {
    if (!encodedValue) {
      return null;
    }
    try {
      const decoded = atob(encodedValue);
      return decodeURIComponent(escape(decoded));
    } catch {
      return null;
    }
  }

  /**
   * Checks if a URL points to a known JSON storage service.
   *
   * @param url - URL to check
   * @returns True if the URL is a known JSON storage service
   *
   * @example
   * ```typescript
   * SecurityValidators.isJsonStorageUrl('https://jsonkeeper.com/b/GNOX4');
   * // Returns: true
   * ```
   *
   * @since 1.0.0
   */
  static isJsonStorageUrl(url: string): boolean {
    try {
      // Normalize URL (remove hxxp/hxxps obfuscation)
      const normalized = url.replace(/^hxxp:\/\//i, "http://").replace(/^hxxps:\/\//i, "https://");
      const urlObj = new URL(normalized);
      const domain = urlObj.hostname.toLowerCase();

      // Check against known malicious domains
      for (const maliciousDomain of MALICIOUS_JSON_STORAGE_DOMAINS) {
        if (domain === maliciousDomain || domain.endsWith(`.${maliciousDomain}`)) {
          return true;
        }
      }

      // Check for JSON storage service patterns
      const jsonStoragePatterns = [/jsonkeeper\.com/i, /jsonsilo\.com/i, /npoint\.io/i];

      return jsonStoragePatterns.some((pattern) => pattern.test(domain));
    } catch {
      return false;
    }
  }

  /**
   * Checks if a URL matches a known malicious IOC.
   *
   * @param url - URL to check
   * @returns True if the URL matches a known malicious IOC
   *
   * @example
   * ```typescript
   * SecurityValidators.isKnownMaliciousUrl('hxxps://jsonkeeper.com/b/GNOX4');
   * // Returns: true
   * ```
   *
   * @since 1.0.0
   */
  static isKnownMaliciousUrl(url: string): boolean {
    const normalized = url.replace(/^hxxp:\/\//i, "http://").replace(/^hxxps:\/\//i, "https://");
    const normalizedLower = normalized.toLowerCase();

    for (const maliciousUrl of KNOWN_MALICIOUS_URLS) {
      const maliciousNormalized = maliciousUrl
        .replace(/^hxxp:\/\//i, "http://")
        .replace(/^hxxps:\/\//i, "https://");
      if (normalizedLower.includes(maliciousNormalized.toLowerCase())) {
        return true;
      }
    }

    return false;
  }

  /**
   * Detects base64-encoded JSON storage service URLs.
   *
   * This method detects the Contagious Interview attack pattern where
   * base64-encoded JSON storage service URLs are embedded in config files
   * to deliver obfuscated malware payloads.
   *
   * @param value - The value to validate (must be a string)
   * @param fieldName - Name of the field for error messages
   * @param errors - Array to collect validation errors
   * @param schema - Validation schema (unused in this validator)
   *
   * @example
   * ```typescript
   * const errors: string[] = [];
   * SecurityValidators.detectBase64JsonStorageUrl(
   *   'aHR0cHM6Ly9qc29ua2VlcGVyLmNvbS9iL0dOT1g0',
   *   'configUrl',
   *   errors,
   *   schema
   * );
   * // errors will contain security warning if threat detected
   * ```
   *
   * @since 1.0.0
   */
  static detectBase64JsonStorageUrl(
    value: unknown,
    fieldName: string,
    errors: string[],
    schema: ValidationSchema
  ): void {
    if (typeof value !== "string") return;

    // Check if value is base64-encoded
    if (!this.isBase64Encoded(value)) {
      return;
    }

    // Decode the base64 value
    const decodedUrl = this.decodeBase64(value);
    if (!decodedUrl) {
      return;
    }

    // Check if decoded value is a JSON storage URL
    if (this.isJsonStorageUrl(decodedUrl)) {
      const isKnownMalicious = this.isKnownMaliciousUrl(decodedUrl);
      const severity = isKnownMalicious ? "CRITICAL" : "HIGH";

      const errorMessage = isKnownMalicious
        ? `${fieldName} contains a base64-encoded JSON storage URL matching a known malicious IOC from the Contagious Interview campaign. This is a CRITICAL security threat.`
        : `${fieldName} contains a base64-encoded JSON storage service URL. This matches the Contagious Interview attack pattern and may be used for malware delivery.`;

      errors.push(errorMessage);
    }
  }

  /**
   * Validates config file content for security threats.
   *
   * This method scans config file content for malicious patterns, including
   * base64-encoded JSON storage URLs and other suspicious patterns.
   *
   * @param content - Config file content to validate
   * @param errors - Array to collect validation errors
   * @param options - Validation options
   *
   * @example
   * ```typescript
   * const errors: string[] = [];
   * SecurityValidators.validateConfigFileSecurity(
   *   'CONFIG_URL=aHR0cHM6Ly9qc29ua2VlcGVyLmNvbS9iL0dOT1g0',
   *   errors,
   *   { strict: true }
   * );
   * ```
   *
   * @since 1.0.0
   */
  static validateConfigFileSecurity(
    content: string,
    errors: string[],
    options: { strict?: boolean } = {}
  ): void {
    const { strict = false } = options;

    // Split content into lines
    const lines = content.split("\n");

    for (let lineNum = 0; lineNum < lines.length; lineNum++) {
      const line = lines[lineNum];
      const trimmedLine = line.trim();

      // Look for environment variable patterns: KEY=VALUE or KEY="VALUE"
      const envPattern = /^([A-Z_][A-Z0-9_]*)\s*[=:]\s*["']?([^"'\n]+)["']?/;
      const match = trimmedLine.match(envPattern);

      if (match) {
        const [, varName, varValue] = match;

        // Check if value is base64-encoded and contains JSON storage URL
        if (this.isBase64Encoded(varValue)) {
          const decodedUrl = this.decodeBase64(varValue);

          if (decodedUrl && this.isJsonStorageUrl(decodedUrl)) {
            const isKnownMalicious = this.isKnownMaliciousUrl(decodedUrl);
            const severity = isKnownMalicious ? "CRITICAL" : "HIGH";

            const errorMessage = isKnownMalicious
              ? `Line ${lineNum + 1}: Variable '${varName}' contains a base64-encoded JSON storage URL matching a known malicious IOC (${severity} threat).`
              : `Line ${lineNum + 1}: Variable '${varName}' contains a base64-encoded JSON storage service URL (${severity} threat).`;

            errors.push(errorMessage);

            if (strict) {
              errors.push(
                `Line ${lineNum + 1}: Config file validation failed due to security threat.`
              );
            }
          }
        }
      }
    }
  }

  /**
   * Checks if a URL is a known malicious JSON storage service.
   *
   * @param url - URL to check
   * @returns True if the URL is a known malicious JSON storage service
   *
   * @example
   * ```typescript
   * SecurityValidators.isKnownMaliciousJsonStorage('https://jsonkeeper.com/b/GNOX4');
   * // Returns: true
   * ```
   *
   * @since 1.0.0
   */
  static isKnownMaliciousJsonStorage(url: string): boolean {
    return this.isJsonStorageUrl(url) && this.isKnownMaliciousUrl(url);
  }
}

