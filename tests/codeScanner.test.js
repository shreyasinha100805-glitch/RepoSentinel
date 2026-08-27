const assert = require('assert');
const { test } = require('node:test');
const { scanFileForCodeSecurity } = require('../backend/src/scanners/codeScanner');

test('Code Scanner - Detect eval dynamic code evaluation', () => {
    const code = 'const result = eval(userFormula);';
    const findings = scanFileForCodeSecurity('vulnerable.js', code);
    assert.strictEqual(findings.length, 1);
    assert.strictEqual(findings[0].category, 'Code Security');
    assert.strictEqual(findings[0].severity, 'CRITICAL');
});

test('Code Scanner - Detect SQL Injection', () => {
    const code = 'const query = "SELECT * FROM users WHERE id = \'" + req.query.id + "\'";';
    const findings = scanFileForCodeSecurity('db.js', code);
    assert.strictEqual(findings.length, 1);
    assert.strictEqual(findings[0].type, 'SQL Injection Risk');
});
