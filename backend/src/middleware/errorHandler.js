/**
 * Global Express Error Handling Middleware for RepoSentinel.
 * Returns consistent, sanitized JSON error responses without crashing the server.
 */

function errorHandler(err, req, res, next) {
    console.error(`[Express Error Handler] Path: ${req.path}`, err);

    const statusCode = err.statusCode || err.status || 500;
    const response = {
        error: true,
        message: err.message || 'Internal Server Error',
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
    };

    res.status(statusCode).json(response);
}

module.exports = errorHandler;
