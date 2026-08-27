const assert = require('assert');
const { test } = require('node:test');
const {
    saveScan,
    getScanById,
    getAllScans,
    updateScanState,
    getStorageStatus
} = require('../backend/src/services/firestoreService');

test('Storage service uses in-memory fallback when MongoDB is not configured', async () => {
    const status = await getStorageStatus();
    assert.strictEqual(status.provider, 'memory');
    assert.strictEqual(status.mongoConfigured, false);
});

test('Storage service saves, updates, and lists scans through the fallback store', async () => {
    const scan = {
        scanId: 'scan_storage_test',
        repository: 'https://github.com/example/repo',
        timestamp: new Date().toISOString(),
        status: 'in_progress'
    };

    await saveScan(scan);
    await updateScanState(scan.scanId, { status: 'completed', securityScore: 90 });

    const saved = await getScanById(scan.scanId);
    const scans = await getAllScans();

    assert.strictEqual(saved.status, 'completed');
    assert.strictEqual(saved.securityScore, 90);
    assert.strictEqual(scans.some(item => item.scanId === scan.scanId), true);
});
