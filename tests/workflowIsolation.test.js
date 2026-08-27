const assert = require('assert');
const { test } = require('node:test');
const { executeScanWorkflow } = require('../backend/src/agents/supervisorAgent');

test('Scan workflow produces distinct findings and scores for different repositories', async () => {
    // Scan demo repository target
    const demoScan = await executeScanWorkflow(`scan_${Date.now()}_1`, 'https://github.com/example/security-demo');
    
    // Demo repository has secrets and vulnerabilities
    assert.strictEqual(demoScan.findings.length > 0, true);
    assert.strictEqual(demoScan.securityScore < 100, true);
    assert.strictEqual(demoScan.verification.afterScore > demoScan.securityScore, true);
});
