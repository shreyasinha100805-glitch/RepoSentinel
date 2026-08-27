/**
 * Risk Calculator Utility for RepoSentinel.
 * Calculates overall Repository Security Score (0 - 100).
 * Penalties: CRITICAL = 10, HIGH = 7, MEDIUM = 4, LOW = 1
 */

const SEVERITY_WEIGHTS = {
    CRITICAL: 10,
    HIGH: 7,
    MEDIUM: 4,
    LOW: 1
};

function calculateRiskScore(findings = []) {
    let baseScore = 100;
    let totalPenalty = 0;

    for (const finding of findings) {
        const severity = (finding.severity || 'LOW').toUpperCase();
        const penalty = SEVERITY_WEIGHTS[severity] || 1;
        totalPenalty += penalty;
    }

    const finalScore = Math.max(0, baseScore - totalPenalty);
    return finalScore;
}

function getSeverityCounts(findings = []) {
    const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
    for (const finding of findings) {
        const sev = (finding.severity || 'LOW').toUpperCase();
        if (counts[sev] !== undefined) {
            counts[sev]++;
        } else {
            counts.LOW++;
        }
    }
    return counts;
}

module.exports = {
    SEVERITY_WEIGHTS,
    calculateRiskScore,
    getSeverityCounts
};
