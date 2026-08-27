const { verifyToken } = require('../services/authService');

function requireAuth(req, res, next) {
    const header = req.get('authorization') || '';
    const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
    const user = verifyToken(token);

    if (!user) {
        return res.status(401).json({
            error: true,
            message: 'Login required before using RepoSentinel.'
        });
    }

    req.user = user;
    next();
}

module.exports = requireAuth;
