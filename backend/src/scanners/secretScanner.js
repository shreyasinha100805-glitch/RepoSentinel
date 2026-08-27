/**
 * Regex-based Secret Detection Scanner for RepoSentinel.
 * Detects hardcoded credentials & sensitive tokens with instant redaction.
 */
const { redactSecret } = require('../utils/redaction');

const SECRET_PATTERNS = [
    {
        name: 'AWS Access Key',
        regex: /(?:A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/g,
        severity: 'CRITICAL',
        confidence: '98%',
        explanation: 'Exposed AWS Access Key detected in repository files.',
        recommendation: 'Move credentials to environment variables (e.g. process.env.AWS_ACCESS_KEY_ID) or AWS Secrets Manager.'
    },
    {
        name: 'AWS Secret Key',
        regex: /(?:aws_secret_access_key|aws_secret|aws_key)\s*[:=]\s*["']?([A-Za-z0-9/+=]{40})["']?/gi,
        severity: 'CRITICAL',
        confidence: '95%',
        explanation: 'Hardcoded AWS Secret Access Key found in source file.',
        recommendation: 'Immediately revoke key, rotate AWS credentials, and use IAM roles or env variables.'
    },
    {
        name: 'GitHub Personal Access Token',
        regex: /gh[pousr]_[A-Za-z0-9_]{36,255}/g,
        severity: 'CRITICAL',
        confidence: '99%',
        explanation: 'Exposed GitHub access token allows potential unauthorized repository access.',
        recommendation: 'Revoke token immediately on GitHub and load via environment secrets.'
    },
    {
        name: 'Google API Key',
        regex: /AIzaSy[A-Za-z0-9_-]{35}/g,
        severity: 'HIGH',
        confidence: '96%',
        explanation: 'Hardcoded Google Cloud / Gemini API key found.',
        recommendation: 'Restrict API key scope in Google Cloud Console and store in environment configuration.'
    },
    {
        name: 'JSON Web Token (JWT)',
        regex: /ey[A-Za-z0-9_-]{10,}\.ey[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g,
        severity: 'HIGH',
        confidence: '92%',
        explanation: 'Hardcoded JWT token present in source code.',
        recommendation: 'Avoid committing static JWT tokens; issue tokens dynamically at runtime.'
    },
    {
        name: 'Private Key',
        regex: /-----BEGIN (?:RSA|OPENSSH|EC|DSA|PRIVATE) KEY-----/g,
        severity: 'CRITICAL',
        confidence: '99%',
        explanation: 'Private RSA/SSH cryptographic key committed in code repository.',
        recommendation: 'Remove key immediately from git history and use secure secrets management.'
    },
    {
        name: 'Bearer Token',
        regex: /Bearer\s+[A-Za-z0-9_\-\.]{20,}/gi,
        severity: 'HIGH',
        confidence: '90%',
        explanation: 'Hardcoded Authorization Bearer token detected.',
        recommendation: 'Pass Bearer tokens dynamically via headers from env vars.'
    },
    {
        name: 'Database URL / Connection String',
        regex: /(?:postgres|postgresql|mongodb|mysql|redis):\/\/[A-Za-z0-9_]+:[A-Za-z0-9_@.-]+@[A-Za-z0-9_.-]+:\d+\/[A-Za-z0-9_-]+/gi,
        severity: 'CRITICAL',
        confidence: '97%',
        explanation: 'Database connection string containing plaintext password detected.',
        recommendation: 'Use process.env.DATABASE_URL to inject connection string securely.'
    },
    {
        name: 'Generic API Key',
        regex: /(?:api[_-]?key|secret[_-]?key|app[_-]?secret)\s*[:=]\s*["'](DEMO_[A-Z0-9_]+|[a-zA-Z0-9_\-]{16,})["']/gi,
        severity: 'HIGH',
        confidence: '88%',
        explanation: 'Hardcoded API credential variable detected.',
        recommendation: 'Extract credential to .env file and reference via environment variables.'
    }
];

function scanFileForSecrets(filename, content) {
    const findings = [];
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const lineContent = lines[i];
        for (const pattern of SECRET_PATTERNS) {
            pattern.regex.lastIndex = 0;
            let match;
            while ((match = pattern.regex.exec(lineContent)) !== null) {
                const rawValue = match[0];
                const redactedValue = redactSecret(rawValue, pattern.name);

                findings.push({
                    id: `secret_${filename.replace(/[^a-zA-Z0-9]/g, '_')}_l${i + 1}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
                    category: 'Secret Detection',
                    type: pattern.name,
                    severity: pattern.severity,
                    confidence: pattern.confidence,
                    file: filename,
                    line: i + 1,
                    rawValue: rawValue,
                    redactedValue: redactedValue,
                    explanation: pattern.explanation,
                    recommendation: pattern.recommendation,
                    status: 'Open'
                });
            }
        }
    }

    return findings;
}

module.exports = {
    SECRET_PATTERNS,
    scanFileForSecrets
};
