const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyToken, logoutUser } = require('../services/authService');

function sendSession(res, session) {
    res.json({
        authenticated: true,
        user: session.user,
        token: session.token
    });
}

router.post('/auth/register', (req, res, next) => {
    try {
        sendSession(res, registerUser(req.body));
    } catch (err) {
        next(err);
    }
});

router.post('/auth/login', (req, res, next) => {
    try {
        sendSession(res, loginUser(req.body));
    } catch (err) {
        next(err);
    }
});

router.get('/auth/me', (req, res) => {
    const header = req.get('authorization') || '';
    const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
    const user = verifyToken(token);

    if (!user) {
        return res.status(401).json({ authenticated: false });
    }

    res.json({ authenticated: true, user });
});

router.post('/auth/logout', (req, res) => {
    const header = req.get('authorization') || '';
    const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
    logoutUser(token);
    res.json({ authenticated: false });
});

module.exports = router;
