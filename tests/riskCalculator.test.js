const assert = require('assert');
const { test } = require('node:test');
const { calculateRiskScore, getSeverityCounts } = require('../backend/src/utils/riskCalculator');

test('Risk Calculator - Penalties and score deduction', () => {
    const findings = [
        { severity: 'CRITICAL' }, // 10
        { severity: 'HIGH' },     // 7
        { severity: 'HIGH' },     // 7
        { severity: 'MEDIUM' },   // 4
        { severity: 'MEDIUM' },   // 4
        { severity: 'MEDIUM' },   // 4
        { severity: 'LOW' }       // 1
    ];
    // Total penalty = 10 + 14 + 12 + 1 = 37. Score = 100 - 37 = 63.
    const score = calculateRiskScore(findings);
    assert.strictEqual(score, 63);

    const counts = getSeverityCounts(findings);
    assert.strictEqual(counts.CRITICAL, 1);
    assert.strictEqual(counts.HIGH, 2);
    assert.strictEqual(counts.MEDIUM, 3);
    assert.strictEqual(counts.LOW, 1);
});
