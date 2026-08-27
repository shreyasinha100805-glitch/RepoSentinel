const assert = require('assert');
const { test } = require('node:test');
const { runDependencyAgent } = require('../backend/src/agents/dependencyAgent');

test('Dependency agent audits every package.json in a repository', async () => {
    const result = await runDependencyAgent([
        {
            path: 'backend/package.json',
            content: JSON.stringify({ dependencies: { express: '4.21.2' } })
        },
        {
            path: 'frontend/package.json',
            content: JSON.stringify({ dependencies: { lodash: '4.17.15' } })
        }
    ]);

    assert.strictEqual(result.findings.length, 1);
    assert.strictEqual(result.findings[0].file, 'frontend/package.json');
    assert.match(result.activity.detail, /Audited 2 package manifest/);
});

test('Dependency agent evaluates semver ranges correctly', async () => {
    const result = await runDependencyAgent([
        {
            path: 'package.json',
            content: JSON.stringify({ dependencies: { lodash: '4.17.19', minimist: '1.2.0', express: '4.20.0' } })
        }
    ]);

    assert.strictEqual(result.findings.length, 2);
    assert.strictEqual(result.findings.some(f => f.type.includes('lodash')), true);
    assert.strictEqual(result.findings.some(f => f.type.includes('minimist')), true);
});
