const assert = require('assert');
const { test } = require('node:test');
const { parseGitHubRepo, validateGitHubUrl } = require('../backend/src/utils/validators');

test('GitHub URL parser ignores query strings and trailing .git', () => {
    assert.deepStrictEqual(
        parseGitHubRepo('https://github.com/setu1421/SecretBench?utm_source=chatgpt.com'),
        { owner: 'setu1421', repo: 'SecretBench' }
    );

    assert.deepStrictEqual(
        parseGitHubRepo('https://github.com/shreyasinha100805-glitch/threatlens2.git'),
        { owner: 'shreyasinha100805-glitch', repo: 'threatlens2' }
    );
});

test('GitHub URL validator rejects non-GitHub URLs', () => {
    assert.strictEqual(validateGitHubUrl('http://localhost:5173/'), false);
    assert.strictEqual(validateGitHubUrl('https://github.com/example/security-demo'), true);
});
