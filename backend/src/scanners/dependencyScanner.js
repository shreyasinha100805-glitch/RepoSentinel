/**
 * Dependency Vulnerability Scanner for RepoSentinel.
 * Analyzes package.json for known vulnerable dependency versions.
 */

// Known vulnerable package versions mapping for standard auditing
const KNOWN_VULNERABLE_PACKAGES = [
    {
        name: 'lodash',
        vulnerableRange: '<4.17.21',
        severity: 'HIGH',
        confidence: '95%',
        explanation: 'Prototype Pollution vulnerability present in lodash versions prior to 4.17.21.',
        recommendation: 'Upgrade lodash to ^4.17.21 in package.json.'
    },
    {
        name: 'axios',
        vulnerableRange: '<0.21.1',
        severity: 'MEDIUM',
        confidence: '90%',
        explanation: 'Server-Side Request Forgery (SSRF) / ReDoS vulnerability in older axios versions.',
        recommendation: 'Upgrade axios to ^1.7.0 or latest release.'
    },
    {
        name: 'express',
        vulnerableRange: '<4.19.2',
        severity: 'MEDIUM',
        confidence: '85%',
        explanation: 'Open redirect and query parsing vulnerabilities in express <4.19.2.',
        recommendation: 'Upgrade express to ^4.19.2 or higher.'
    },
    {
        name: 'minimist',
        vulnerableRange: '<1.2.6',
        severity: 'MEDIUM',
        confidence: '92%',
        explanation: 'Prototype Pollution vulnerability in minimist <1.2.6.',
        recommendation: 'Upgrade minimist to ^1.2.6 or higher.'
    },
    {
        name: 'json5',
        vulnerableRange: '<2.2.2',
        severity: 'HIGH',
        confidence: '94%',
        explanation: 'Prototype Pollution vulnerability in json5 <2.2.2.',
        recommendation: 'Upgrade json5 to ^2.2.2.'
    },
    {
        name: 'semver',
        vulnerableRange: '<7.5.2',
        severity: 'MEDIUM',
        confidence: '90%',
        explanation: 'Regular Expression Denial of Service (ReDoS) in semver <7.5.2.',
        recommendation: 'Upgrade semver to ^7.5.2.'
    }
];

function parseSemver(vStr) {
    if (!vStr) return null;
    const clean = String(vStr).replace(/[^0-9.]/g, '').split('.');
    if (clean.length === 0 || !clean[0]) return null;
    const major = parseInt(clean[0], 10) || 0;
    const minor = parseInt(clean[1] || '0', 10) || 0;
    const patch = parseInt(clean[2] || '0', 10) || 0;
    return { major, minor, patch };
}

function compareSemver(v1, v2) {
    if (!v1 || !v2) return 0;
    if (v1.major !== v2.major) return v1.major - v2.major;
    if (v1.minor !== v2.minor) return v1.minor - v2.minor;
    return v1.patch - v2.patch;
}

function isVersionVulnerable(installedVersion, vulnerableRange) {
    if (!installedVersion || !vulnerableRange) return false;
    const targetMatch = vulnerableRange.match(/<=\s*([0-9.]+)|<\s*([0-9.]+)/);
    if (!targetMatch) return false;

    const targetVerStr = targetMatch[1] || targetMatch[2];
    const isInclusive = Boolean(targetMatch[1]);
    const installed = parseSemver(installedVersion);
    const target = parseSemver(targetVerStr);

    if (!installed || !target) return false;
    const comp = compareSemver(installed, target);
    return isInclusive ? comp <= 0 : comp < 0;
}

function scanPackageJson(filename, content) {
    const findings = [];
    try {
        const packageData = JSON.parse(content);
        const allDeps = {
            ...(packageData.dependencies || {}),
            ...(packageData.devDependencies || {})
        };

        for (const [pkg, version] of Object.entries(allDeps)) {
            const knownVuln = KNOWN_VULNERABLE_PACKAGES.find(p => p.name === pkg);
            if (knownVuln && isVersionVulnerable(version, knownVuln.vulnerableRange)) {
                findings.push({
                    id: `dep_${pkg}_${Date.now()}`,
                    category: 'Dependency Vulnerability',
                    type: `Vulnerable Dependency (${pkg})`,
                    severity: knownVuln.severity,
                    confidence: knownVuln.confidence,
                    file: filename,
                    line: 1,
                    rawValue: `"${pkg}": "${version}"`,
                    redactedValue: `"${pkg}": "${version}"`,
                    explanation: knownVuln.explanation,
                    recommendation: knownVuln.recommendation,
                    status: 'Open'
                });
            } else if (!knownVuln) {
                // Return requirement note for unknown dependencies without inventing CVEs
                // "AI-assisted analysis; verification required."
            }
        }
    } catch (e) {
        // Invalid JSON file fallback
    }

    return findings;
}

module.exports = {
    KNOWN_VULNERABLE_PACKAGES,
    scanPackageJson
};
