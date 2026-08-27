/**
 * Redaction utility functions for RepoSentinel.
 * Ensures raw sensitive credentials are never stored or sent to APIs.
 */

function redactSecret(value, secretType = 'Secret') {
    if (!value || typeof value !== 'string') return '[REDACTED]';
    if (value.length <= 8) {
        return `${value.substring(0, 2)}****[REDACTED]`;
    }
    const prefix = value.substring(0, 4);
    const suffix = value.substring(value.length - 2);
    return `${prefix}****[REDACTED_${secretType.toUpperCase().replace(/\s+/g, '_')}]****${suffix}`;
}

function maskCodeContext(codeContent, secretMatches = []) {
    let masked = codeContent;
    for (const match of secretMatches) {
        if (match.rawValue && masked.includes(match.rawValue)) {
            const redacted = redactSecret(match.rawValue, match.type);
            masked = masked.replace(match.rawValue, redacted);
        }
    }
    return masked;
}

module.exports = {
    redactSecret,
    maskCodeContext
};
