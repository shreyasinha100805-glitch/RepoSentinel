/**
 * Remediation Agent for RepoSentinel.
 * Generates security patches and git diffs using Gemini AI service.
 */
const { generateRemediationPatch } = require('../services/geminiService');

async function runRemediationAgent(file, originalContent, finding) {
    const agentName = 'RemediationAgent';
    const activity = {
        agent: agentName,
        step: 'Generating security patch',
        status: 'running',
        timestamp: new Date().toISOString()
    };

    const patchResult = await generateRemediationPatch(file, originalContent, finding);

    activity.status = 'completed';
    activity.detail = `Generated safe code patch diff for ${file}`;

    return {
        agent: agentName,
        activity,
        patchResult
    };
}

module.exports = {
    runRemediationAgent
};
