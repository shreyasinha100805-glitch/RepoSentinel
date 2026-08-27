/**
 * Secret Detection Agent for RepoSentinel.
 * Scans files for exposed API keys, tokens, JWTs, credentials, database URIs with instant redaction.
 */
const { scanFileForSecrets } = require('../scanners/secretScanner');

async function runSecretDetectionAgent(files) {
    const agentName = 'SecretDetectionAgent';
    const activity = {
        agent: agentName,
        step: 'Scanning source files',
        status: 'running',
        timestamp: new Date().toISOString()
    };

    const findings = [];
    for (const file of files) {
        if (file.path && file.content) {
            const fileFindings = scanFileForSecrets(file.path, file.content);
            findings.push(...fileFindings);
        }
    }

    activity.status = 'completed';
    activity.detail = `Detected ${findings.length} secret security risk(s)`;

    return {
        agent: agentName,
        activity,
        findings
    };
}

module.exports = {
    runSecretDetectionAgent
};
