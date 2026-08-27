/**
 * Static Code Analysis Scanner for RepoSentinel.
 * Identifies common application security vulnerabilities and unsafe execution paths.
 */

const CODE_SECURITY_PATTERNS = [
    {
        name: 'SQL Injection Risk',
        regex: /(?:SELECT|INSERT|UPDATE|DELETE).*\+.*req\.(?:query|body|params)/gi,
        severity: 'CRITICAL',
        confidence: '94%',
        explanation: 'Dynamic string concatenation detected in SQL query using untrusted user input.',
        recommendation: 'Use parameterized queries or ORM query builders (e.g. pool.query("SELECT * FROM users WHERE id = $1", [id])).'
    },
    {
        name: 'Command Injection Risk',
        regex: /(?:exec|execSync|spawn|fork)\s*\(\s*["'].*?\+.*?req\.(?:query|body|params)/gi,
        severity: 'CRITICAL',
        confidence: '96%',
        explanation: 'Untrusted user input concatenated directly into OS command execution function.',
        recommendation: 'Avoid executing shell commands with user input. Use execFile or validate and sanitize input strictly.'
    },
    {
        name: 'Path Traversal Risk',
        regex: /(?:readFile|readFileSync|createReadStream)\s*\(\s*.*?\+.*?req\.(?:query|body|params)/gi,
        severity: 'HIGH',
        confidence: '90%',
        explanation: 'Unvalidated user input passed directly to filesystem read function.',
        recommendation: 'Sanitize file paths using path.basename() or validate against an allowed directory whitelist.'
    },
    {
        name: 'Unsafe Dynamic Code Evaluation (eval)',
        regex: /\beval\s*\(\s*.*?(?:req\.|input|formula|code)/gi,
        severity: 'CRITICAL',
        confidence: '99%',
        explanation: 'Use of eval() executes arbitrary JavaScript code and poses severe Remote Code Execution (RCE) risks.',
        recommendation: 'Replace eval() with safe parsing libraries (e.g., mathjs for math expressions, JSON.parse for data).'
    },
    {
        name: 'Unsafe child_process Execution',
        regex: /require\s*\(\s*['"]child_process['"]\s*\)/g,
        severity: 'MEDIUM',
        confidence: '85%',
        explanation: 'Importing child_process module allows subshell creation.',
        recommendation: 'Ensure all invocations using child_process are strictly hardcoded without external parameters.'
    },
    {
        name: 'Insecure HTTP Protocol Usage',
        regex: /http:\/\/(?!localhost|127\.0\.0\.1)[a-zA-Z0-9\.\_\-]+/gi,
        severity: 'MEDIUM',
        confidence: '88%',
        explanation: 'Unencrypted HTTP endpoint URL configured for remote network calls.',
        recommendation: 'Upgrade endpoint URLs to HTTPS to enforce TLS encryption in transit.'
    },
    {
        name: 'Debug Mode Enabled in Production Code',
        regex: /(?:DEBUG|DEBUG_MODE|IS_DEBUG)\s*=\s*true/gi,
        severity: 'LOW',
        confidence: '80%',
        explanation: 'Debug mode flag hardcoded to true.',
        recommendation: 'Toggle debug flags based on process.env.NODE_ENV === "development".'
    },
    {
        name: 'Weak Cryptographic Algorithm',
        regex: /crypto\.createHash\s*\(\s*['"](?:md5|sha1)['"]\s*\)/gi,
        severity: 'MEDIUM',
        confidence: '95%',
        explanation: 'MD5 or SHA1 hash functions are cryptographically broken and prone to collision attacks.',
        recommendation: 'Upgrade hashing to SHA-256 or SHA-512, or use bcrypt/argon2 for password hashing.'
    }
];

function scanFileForCodeSecurity(filename, content) {
    const findings = [];
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const lineContent = lines[i];
        for (const pattern of CODE_SECURITY_PATTERNS) {
            pattern.regex.lastIndex = 0;
            let match;
            while ((match = pattern.regex.exec(lineContent)) !== null) {
                findings.push({
                    id: `code_${filename.replace(/[^a-zA-Z0-9]/g, '_')}_l${i + 1}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
                    category: 'Code Security',
                    type: pattern.name,
                    severity: pattern.severity,
                    confidence: pattern.confidence,
                    file: filename,
                    line: i + 1,
                    rawValue: match[0],
                    redactedValue: match[0],
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
    CODE_SECURITY_PATTERNS,
    scanFileForCodeSecurity
};
