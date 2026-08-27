/**
 * Dependency Agent for RepoSentinel.
 * Audits package.json for vulnerable third-party dependencies.
 */
const { scanPackageJson } = require('../scanners/dependencyScanner');

async function runDependencyAgent(files) {
    const agentName = 'DependencyAgent';
    const activity = {
        agent: agentName,
        step: 'Checking package dependencies',
        status: 'running',
        timestamp: new Date().toISOString()
    };

    const findings = [];
    const packageFiles = files.filter(f => f.path.endsWith('package.json'));

    for (const packageFile of packageFiles) {
        const depFindings = scanPackageJson(packageFile.path, packageFile.content);
        findings.push(...depFindings);
    }

    activity.status = 'completed';
    activity.detail = `Audited ${packageFiles.length} package manifest(s); found ${findings.length} vulnerable dependency issue(s)`;

    return {
        agent: agentName,
        activity,
        findings
    };
}

module.exports = {
    runDependencyAgent
};
