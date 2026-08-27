const assert = require('assert');
const { test } = require('node:test');
const { isRelevantTextPath, selectScannableTreeFiles } = require('../backend/src/services/githubService');

test('GitHub service keeps security-relevant text files and excludes generated assets', () => {
    assert.strictEqual(isRelevantTextPath('src/server.js'), true);
    assert.strictEqual(isRelevantTextPath('backend/package.json'), true);
    assert.strictEqual(isRelevantTextPath('.env.example'), true);
    assert.strictEqual(isRelevantTextPath('node_modules/lodash/index.js'), false);
    assert.strictEqual(isRelevantTextPath('public/logo.png'), false);
});

test('GitHub service prioritizes manifests, env files, and source code instead of raw API order', () => {
    const selected = selectScannableTreeFiles([
        { type: 'blob', path: 'README.md', size: 100 },
        { type: 'blob', path: 'public/logo.png', size: 100 },
        { type: 'blob', path: 'node_modules/pkg/index.js', size: 100 },
        { type: 'blob', path: 'frontend/package.json', size: 100 },
        { type: 'blob', path: '.env.example', size: 100 },
        { type: 'blob', path: 'src/app.js', size: 100 },
        { type: 'tree', path: 'src' }
    ]);

    assert.deepStrictEqual(
        selected.map(file => file.path),
        ['frontend/package.json', '.env.example', 'src/app.js']
    );
});
