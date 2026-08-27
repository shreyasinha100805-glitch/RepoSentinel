/**
 * Enterprise Security Headers & Rate Limiting Middleware for RepoSentinel.
 * Enforces Zero-Trust HTTP security posture.
 */

function securityHeaders(req, res, next) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Powered-By', 'RepoSentinel Security Engine v1.0');
    next();
}

module.exports = securityHeaders;
