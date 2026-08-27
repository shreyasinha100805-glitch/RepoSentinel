const assert = require('assert');
const { test } = require('node:test');
const { generateRemediationPatch } = require('../backend/src/services/geminiService');

test('Remediation Service - Patch generation demo mode', async () => {
    process.env.DEMO_MODE = 'true';
    const original = 'const AWS_KEY = "AKIA1234567890EXAMPLE";';
    const result = await generateRemediationPatch('config.js', original, { type: 'AWS Access Key' });

    assert.strictEqual(result.proposedCode.includes('process.env.AWS_KEY'), true);
    assert.strictEqual(result.proposedCode.includes('AKIA1234567890EXAMPLE'), false);
});
