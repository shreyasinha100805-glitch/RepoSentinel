/**
 * Scan History Routes for RepoSentinel.
 */
const express = require('express');
const router = express.Router();
const { getAllScans } = require('../services/firestoreService');

// GET /api/history - Return full scan history list
router.get('/history', async (req, res, next) => {
    try {
        const history = await getAllScans();
        res.json({
            count: history.length,
            history
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
