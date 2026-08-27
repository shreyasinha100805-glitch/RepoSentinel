/**
 * Scan persistence service for RepoSentinel.
 * Uses MongoDB when MONGODB_URI is configured, with in-memory fallback for demo mode.
 */
const { MongoClient } = require('mongodb');

// In-memory scan collection for fast, zero-dependency demo mode operation
const scansDatabase = new Map();
const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'reposentinel';
const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION || 'scans';
const MONGODB_SERVER_SELECTION_TIMEOUT_MS = Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || 5000);
const MONGODB_RETRY_INTERVAL_MS = Number(process.env.MONGODB_RETRY_INTERVAL_MS || 30000);

let mongoClient;
let mongoCollection;
let mongoConnectionPromise;
let mongoUnavailableReason = '';
let mongoLastFailureAt = 0;

function shouldUseMongo() {
    return Boolean(MONGODB_URI) && process.env.DEMO_MODE !== 'true';
}

async function getMongoCollection() {
    if (!shouldUseMongo()) return null;
    if (mongoCollection) return mongoCollection;
    if (mongoUnavailableReason && Date.now() - mongoLastFailureAt < MONGODB_RETRY_INTERVAL_MS) {
        return null;
    }

    if (!mongoConnectionPromise) {
        mongoClient = new MongoClient(MONGODB_URI, {
            serverSelectionTimeoutMS: MONGODB_SERVER_SELECTION_TIMEOUT_MS,
            tls: MONGODB_URI.startsWith('mongodb+srv://') ? true : undefined
        });

        mongoConnectionPromise = mongoClient.connect()
            .then(client => {
                mongoCollection = client.db(MONGODB_DB_NAME).collection(MONGODB_COLLECTION);
                mongoUnavailableReason = '';
                mongoLastFailureAt = 0;
                return mongoCollection;
            })
            .catch(err => {
                mongoUnavailableReason = err.message;
                mongoLastFailureAt = Date.now();
                mongoConnectionPromise = null;
                if (mongoClient) {
                    mongoClient.close().catch(() => {});
                    mongoClient = null;
                }
                console.error(`MongoDB connection failed. Falling back to in-memory storage: ${err.message}`);
                return null;
            });
    }

    return mongoConnectionPromise;
}

function serializeScan(scanData) {
    const { _id, ...scan } = scanData || {};
    return scan;
}

async function saveScan(scanData) {
    if (!scanData || !scanData.scanId) return;
    const document = {
        ...scanData,
        updatedAt: new Date().toISOString()
    };

    const collection = await getMongoCollection();
    if (collection) {
        await collection.updateOne(
            { scanId: scanData.scanId },
            { $set: document },
            { upsert: true }
        );
    }

    scansDatabase.set(scanData.scanId, document);
    return scanData;
}

async function getScanById(scanId) {
    const collection = await getMongoCollection();
    if (collection) {
        const scan = await collection.findOne({ scanId });
        if (scan) return serializeScan(scan);
    }

    return scansDatabase.get(scanId) || null;
}

async function getAllScans() {
    const collection = await getMongoCollection();
    if (collection) {
        const scans = await collection
            .find({})
            .sort({ timestamp: -1 })
            .toArray();
        return scans.map(serializeScan);
    }

    const list = Array.from(scansDatabase.values());
    list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return list;
}

async function updateScanState(scanId, updateFields) {
    const collection = await getMongoCollection();
    if (collection) {
        const updatedAt = new Date().toISOString();
        await collection.updateOne(
            { scanId },
            { $set: { ...updateFields, updatedAt } },
            { upsert: false }
        );

        const updatedScan = await collection.findOne({ scanId });
        if (updatedScan) {
            const serialized = serializeScan(updatedScan);
            scansDatabase.set(scanId, serialized);
            return serialized;
        }
    }

    const existing = scansDatabase.get(scanId);
    if (!existing) return null;
    const updated = {
        ...existing,
        ...updateFields,
        updatedAt: new Date().toISOString()
    };
    scansDatabase.set(scanId, updated);
    return updated;
}

async function getStorageStatus() {
    const collection = await getMongoCollection();
    return {
        provider: collection ? 'mongodb' : 'memory',
        mongoConfigured: Boolean(MONGODB_URI),
        mongoConnected: Boolean(collection),
        database: collection ? MONGODB_DB_NAME : null,
        collection: collection ? MONGODB_COLLECTION : null,
        fallbackReason: collection ? null : mongoUnavailableReason || (shouldUseMongo() ? 'MongoDB not connected yet.' : 'MongoDB disabled or demo mode enabled.'),
        retryInMs: collection || !mongoUnavailableReason
            ? 0
            : Math.max(0, MONGODB_RETRY_INTERVAL_MS - (Date.now() - mongoLastFailureAt))
    };
}

async function closeStorage() {
    if (mongoClient) {
        await mongoClient.close();
    }
    mongoClient = null;
    mongoCollection = null;
    mongoConnectionPromise = null;
    mongoUnavailableReason = '';
    mongoLastFailureAt = 0;
}

module.exports = {
    saveScan,
    getScanById,
    getAllScans,
    updateScanState,
    getStorageStatus,
    closeStorage
};
