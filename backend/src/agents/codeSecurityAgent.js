/**
 * Code Security Agent for RepoSentinel.
 * Analyzes application logic for dangerous patterns (SQLi, RCE eval, Command exec, Path traversal).
 */
const { scanFileForCodeSecurity } = require('../scanners/codeScanner');

async function runCodeSecurityAgent(files) {
    const agentName = 'CodeSecurityAgent';
    const activity = {
        agent: agentName,
        step: 'Analyzing source code',
        status: 'running',
        timestamp: new Date().toISOString()
    };

    const findings = [];
    for (const file of files) {
        if (file.path && file.content) {
            const fileFindings = scanFileForCodeSecurity(file.path, file.content);
            findings.push(...fileFindings);
        }
    }

    activity.status = 'completed';
    activity.detail = `Identified ${findings.length} code security flaw(s)`;

    return {
        agent: agentName,
        activity,
        findings
    };
}

module.exports = {
    runCodeSecurityAgent
};
