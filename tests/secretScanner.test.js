const assert = require('assert');
const { test } = require('node:test');
const { scanFileForSecrets } = require('../backend/src/scanners/secretScanner');

test('Secret Scanner - Detect AWS Access Key and redact', () => {
    const code = 'const AWS_KEY = "AKIA1234567890EXAMPLE";';
    const findings = scanFileForSecrets('config.js', code);
    assert.strictEqual(findings.length, 1);
    assert.strictEqual(findings[0].category, 'Secret Detection');
    assert.strictEqual(findings[0].severity, 'CRITICAL');
    assert.strictEqual(findings[0].redactedValue.includes('[REDACTED'), true);
    assert.strictEqual(findings[0].redactedValue.includes('AKIA1234567890EXAMPLE'), false);
});

test('Secret Scanner - Detect GitHub Token', () => {
    const code = 'const token = "ghp_123456789012345678901234567890123456";';
    const findings = scanFileForSecrets('auth.js', code);
    assert.strictEqual(findings.length, 1);
    assert.strictEqual(findings[0].type, 'GitHub Personal Access Token');
});
