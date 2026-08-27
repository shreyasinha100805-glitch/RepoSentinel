/**
 * Supervisor Agent for RepoSentinel.
 * Orchestrates multi-agent scan sequence:
 * Secret Detection -> Code Security -> Dependency -> Risk Analysis -> Remediation -> Verification.
 */
const { fetchRepoContents } = require('../services/githubService');
const { runSecretDetectionAgent } = require('./secretDetectionAgent');
const { runCodeSecurityAgent } = require('./codeSecurityAgent');
const { runDependencyAgent } = require('./dependencyAgent');
const { runRiskAnalysisAgent } = require('./riskAnalysisAgent');
const { runVerificationAgent } = require('./verificationAgent');
const { saveScan, updateScanState } = require('../services/firestoreService');
const { publishScanEvent } = require('../services/pubsubService');
const { generateRemediationPatch } = require('../services/geminiService');

async function executeScanWorkflow(scanId, repositoryUrl) {
    const timestamp = new Date().toISOString();
    const agentActivities = [];

    // Step 0: Supervisor Initialization
    const supervisorActivity = {
        agent: 'SupervisorAgent',
        step: 'Repository received',
        status: 'completed',
        timestamp: new Date().toISOString(),
        detail: `Received repository URL: ${repositoryUrl}`
    };
    agentActivities.push(supervisorActivity);

    // Initial Scan object state
    let scanData = {
        scanId,
        repository: repositoryUrl,
        owner: 'demo-org',
        repo: 'security-demo',
        branch: 'main',
        filesScannedCount: 0,
        timestamp,
        status: 'in_progress',
        securityScore: 100,
        severityCounts: { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 },
        findings: [],
        agentActivity: [...agentActivities],
        remediation: null,
        verification: null
    };

    await saveScan(scanData);
    await publishScanEvent('reposentinel-scans', { scanId, step: 'start' });

    try {
        // Fetch files
        const repoInfo = await fetchRepoContents(repositoryUrl);
        scanData.owner = repoInfo.owner;
        scanData.repo = repoInfo.repo;
        scanData.branch = repoInfo.branch;
        scanData.filesScannedCount = repoInfo.filesCount;

        // Step 1: Secret Detection Agent
        const secretRes = await runSecretDetectionAgent(repoInfo.files);
        agentActivities.push(secretRes.activity);
        scanData.findings.push(...secretRes.findings);

        // Step 2: Code Security Agent
        const codeRes = await runCodeSecurityAgent(repoInfo.files);
        agentActivities.push(codeRes.activity);
        scanData.findings.push(...codeRes.findings);

        // Step 3: Dependency Agent
        const depRes = await runDependencyAgent(repoInfo.files);
        agentActivities.push(depRes.activity);
        scanData.findings.push(...depRes.findings);

        // Step 4: Risk Analysis Agent
        const riskRes = await runRiskAnalysisAgent(scanData.findings);
        agentActivities.push(riskRes.activity);
        scanData.securityScore = riskRes.securityScore;
        scanData.severityCounts = riskRes.severityCounts;

        // Step 5: Verification calculation (simulating post-remediation score upgrade)
        let verifiedSimFiles = [...repoInfo.files];
        if (scanData.findings.length > 0) {
            const filesMap = new Map(repoInfo.files.map(f => [f.path, f.content]));
            let firstPatch = null;
            for (const finding of scanData.findings) {
                const curContent = filesMap.get(finding.file);
                if (curContent) {
                    const patchObj = await generateRemediationPatch(finding.file, curContent, finding);
                    if (patchObj && patchObj.proposedCode) {
                        filesMap.set(finding.file, patchObj.proposedCode);
                        if (!firstPatch) firstPatch = patchObj;
                    }
                }
            }
            scanData.remediation = firstPatch;
            verifiedSimFiles = Array.from(filesMap.entries()).map(([path, content]) => ({ path, content }));
        }

        const verifyRes = await runVerificationAgent(verifiedSimFiles);
        agentActivities.push({
            agent: 'RemediationAgent',
            step: 'Generating security patch',
            status: 'completed',
            timestamp: new Date().toISOString(),
            detail: 'Remediation patch templates generated and ready for approval'
        });
        agentActivities.push(verifyRes.activity);

        scanData.verification = {
            beforeScore: scanData.securityScore,
            afterScore: verifyRes.verifiedScore,
            checklist: verifyRes.checklist
        };

        scanData.status = 'completed';
        scanData.agentActivity = agentActivities;

        await updateScanState(scanId, scanData);
        await publishScanEvent('reposentinel-scans', { scanId, step: 'completed', score: scanData.securityScore });

        return scanData;
    } catch (err) {
        scanData.status = 'failed';
        scanData.error = err.message;
        agentActivities.push({
            agent: 'SupervisorAgent',
            step: 'Error occurred',
            status: 'failed',
            timestamp: new Date().toISOString(),
            detail: err.message
        });
        scanData.agentActivity = agentActivities;
        await updateScanState(scanId, scanData);
        return scanData;
    }
}

module.exports = {
    executeScanWorkflow
};
