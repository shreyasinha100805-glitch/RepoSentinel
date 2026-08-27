/**
 * GitHub API Integration Routes for RepoSentinel.
 */
const express = require('express');
const router = express.Router();
const { createPullRequest } = require('../services/githubService');
const { getScanById, updateScanState } = require('../services/firestoreService');

// POST /api/github/create-pr/:scanId - Create Pull Request upon explicit user approval
router.post('/create-pr/:scanId', async (req, res, next) => {
    try {
        const { scanId } = req.params;
        const { branchName, commitMessage, files } = req.body;

        const scan = await getScanById(scanId);
        if (!scan) {
            return res.status(404).json({ error: true, message: `Scan ID ${scanId} not found.` });
        }

        const prResult = await createPullRequest({
            repositoryUrl: scan.repository,
            branchName: branchName || `reposentinel-patch-${Date.now()}`,
            commitMessage: commitMessage || 'security: remediate exposed credentials and code flaws',
            files: files || [
                {
                    path: 'SECURITY.md',
                    content: '# Security Remediation Patch\nAutomated security fix applied by RepoSentinel AI Agent Architecture.\n'
                }
            ]
        });

        // Update scan with PR details
        scan.pullRequest = prResult;
        await updateScanState(scanId, scan);

        res.json({
            scanId,
            pullRequest: prResult
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
