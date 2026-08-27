/**
 * Enterprise Structured Logging Utility for RepoSentinel.
 * Implements ISO timestamps, log levels (INFO, WARN, ERROR, AUDIT), and request correlation IDs.
 */

const LOG_LEVELS = {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
    AUDIT: 'AUDIT'
};

function formatLog(level, message, meta = {}) {
    return JSON.stringify({
        timestamp: new Date().toISOString(),
        level,
        service: 'reposentinel-core',
        pid: process.pid,
        message,
        ...meta
    });
}

const logger = {
    info: (msg, meta) => console.log(formatLog(LOG_LEVELS.INFO, msg, meta)),
    warn: (msg, meta) => console.warn(formatLog(LOG_LEVELS.WARN, msg, meta)),
    error: (msg, meta) => console.error(formatLog(LOG_LEVELS.ERROR, msg, meta)),
    audit: (msg, meta) => console.log(formatLog(LOG_LEVELS.AUDIT, `[ZERO-TRUST AUDIT] ${msg}`, meta))
};

module.exports = logger;
