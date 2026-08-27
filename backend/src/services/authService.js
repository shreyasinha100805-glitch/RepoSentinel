const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const TOKEN_TTL_MS = 1000 * 60 * 60 * 12;
const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'auth-users.json');
const users = new Map();
const sessions = new Map();

function loadUsers() {
    try {
        if (!fs.existsSync(USERS_FILE)) return;
        const savedUsers = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
        savedUsers.forEach((user) => users.set(user.email, user));
    } catch (err) {
        console.warn('Auth user store could not be loaded:', err.message);
    }
}

function saveUsers() {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(USERS_FILE, JSON.stringify(Array.from(users.values()), null, 2));
}

function publicUser(user) {
    return {
        id: user.id,
        name: user.name,
        organization: user.organization,
        email: user.email,
        createdAt: user.createdAt
    };
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
    const hash = crypto.pbkdf2Sync(password, salt, 120000, 32, 'sha256').toString('hex');
    return { salt, hash };
}

function createSession(user) {
    const token = crypto.randomBytes(32).toString('hex');
    sessions.set(token, {
        userId: user.id,
        expiresAt: Date.now() + TOKEN_TTL_MS
    });
    return token;
}

function registerUser({ name, organization, email, password }) {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    if (!name || !organization || !normalizedEmail || !password) {
        const err = new Error('Name, organization, email, and password are required.');
        err.statusCode = 400;
        throw err;
    }
    if (String(password).length < 8) {
        const err = new Error('Password must be at least 8 characters.');
        err.statusCode = 400;
        throw err;
    }
    if (users.has(normalizedEmail)) {
        const err = new Error('An account already exists for this email.');
        err.statusCode = 409;
        throw err;
    }

    const passwordRecord = hashPassword(password);
    const user = {
        id: `user_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
        name: String(name).trim(),
        organization: String(organization).trim(),
        email: normalizedEmail,
        passwordHash: passwordRecord.hash,
        passwordSalt: passwordRecord.salt,
        createdAt: new Date().toISOString()
    };
    users.set(normalizedEmail, user);
    saveUsers();

    return {
        user: publicUser(user),
        token: createSession(user)
    };
}

function loginUser({ email, password }) {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const user = users.get(normalizedEmail);
    if (!user || !password) {
        const err = new Error('Invalid email or password.');
        err.statusCode = 401;
        throw err;
    }

    const { hash } = hashPassword(password, user.passwordSalt);
    const supplied = Buffer.from(hash, 'hex');
    const stored = Buffer.from(user.passwordHash, 'hex');
    if (supplied.length !== stored.length || !crypto.timingSafeEqual(supplied, stored)) {
        const err = new Error('Invalid email or password.');
        err.statusCode = 401;
        throw err;
    }

    return {
        user: publicUser(user),
        token: createSession(user)
    };
}

function verifyToken(token) {
    const session = sessions.get(token);
    if (!session || session.expiresAt < Date.now()) {
        if (session) sessions.delete(token);
        return null;
    }

    const user = Array.from(users.values()).find((item) => item.id === session.userId);
    return user ? publicUser(user) : null;
}

function logoutUser(token) {
    if (token) sessions.delete(token);
}

module.exports = {
    registerUser,
    loginUser,
    verifyToken,
    logoutUser
};

loadUsers();
