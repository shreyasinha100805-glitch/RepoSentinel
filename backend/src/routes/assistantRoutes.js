const express = require('express');
const router = express.Router();

function compactFinding(finding) {
    return `${finding.severity || 'INFO'} ${finding.type || finding.category || 'finding'} in ${finding.file || 'unknown file'}${finding.line ? `:${finding.line}` : ''}`;
}

router.post('/assistant', (req, res) => {
    const { question = '', selectedModel = 'gemini-3.5-flash' } = req.body;
    const scan = req.body.scan || {};
    const findings = Array.isArray(scan.findings) ? scan.findings : [];
    const counts = scan.severityCounts || {};
    const topFindings = findings.slice(0, 3).map(compactFinding);
    const lowered = String(question).toLowerCase();

    let answer = 'I can help you triage findings, explain risk, and decide what to fix next.';

    if (lowered.includes('fix') || lowered.includes('remed')) {
        answer = findings.length
            ? `Start with ${compactFinding(findings[0])}. Generate the patch, review the diff, then run verification before creating the pull request.`
            : 'No active findings are loaded. Start a scan or open a scan with findings, then I can guide the remediation order.';
    } else if (lowered.includes('score') || lowered.includes('risk')) {
        answer = `This scan is scored at ${scan.securityScore ?? 'unknown'} / 100. Current counts are critical ${counts.CRITICAL || 0}, high ${counts.HIGH || 0}, medium ${counts.MEDIUM || 0}, and low ${counts.LOW || 0}.`;
    } else if (lowered.includes('secret') || lowered.includes('token') || lowered.includes('key')) {
        answer = 'For exposed secrets, revoke the leaked credential first, move the value into a secret manager or environment variable, and rotate any dependent services before merging code changes.';
    } else if (lowered.includes('pr') || lowered.includes('pull')) {
        answer = 'Create the PR only after the proposed code removes the risky pattern and verification passes. Keep the commit message focused on the security control being added.';
    } else if (topFindings.length > 0) {
        answer = `I see ${findings.length} finding(s). Highest priority: ${topFindings.join('; ')}.`;
    }

    res.json({
        model: selectedModel,
        answer,
        suggestions: [
            'What should I fix first?',
            'Explain the current risk score',
            'How should I validate this patch?'
        ]
    });
});

module.exports = router;
