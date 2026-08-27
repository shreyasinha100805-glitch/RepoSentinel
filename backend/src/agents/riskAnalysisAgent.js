/**
 * Risk Analysis Agent for RepoSentinel.
 * Calculates repository security score (0-100) and severity counts.
 */
const { calculateRiskScore, getSeverityCounts } = require('../utils/riskCalculator');

async function runRiskAnalysisAgent(findings) {
    const agentName = 'RiskAnalysisAgent';
    const activity = {
        agent: agentName,
        step: 'Calculating repository risk',
        status: 'running',
        timestamp: new Date().toISOString()
    };

    const securityScore = calculateRiskScore(findings);
    const severityCounts = getSeverityCounts(findings);

    activity.status = 'completed';
    activity.detail = `Calculated Security Score: ${securityScore} / 100`;

    return {
        agent: agentName,
        activity,
        securityScore,
        severityCounts
    };
}

module.exports = {
    runRiskAnalysisAgent
};
