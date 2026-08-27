/**
 * Main Express Application for RepoSentinel.
 * Enterprise Architecture with Structured Logging & Security Middleware.
 */
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const scanRoutes = require('./routes/scanRoutes');
const githubRoutes = require('./routes/githubRoutes');
const historyRoutes = require('./routes/historyRoutes');
const assistantRoutes = require('./routes/assistantRoutes');
const errorHandler = require('./middleware/errorHandler');
const requireAuth = require('./middleware/requireAuth');
const securityHeaders = require('./middleware/securityHeaders');
const logger = require('./utils/logger');
const { getStorageStatus } = require('./services/firestoreService');

const app = express();

app.use(securityHeaders);
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
    logger.info(`HTTP ${req.method} ${req.path}`, { ip: req.ip, userAgent: req.get('user-agent') });
    next();
});

// Health Check Endpoint
app.get('/api/health', async (req, res, next) => {
    try {
        const storage = await getStorageStatus();

        res.json({
            status: 'ok',
            service: 'RepoSentinel Enterprise Core Engine',
            demoMode: process.env.DEMO_MODE === 'true',
            version: '1.0.0-production',
            storage,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        next(err);
    }
});

// API Routes
app.use('/api', authRoutes);
app.use('/api', requireAuth, scanRoutes);
app.use('/api/github', requireAuth, githubRoutes);
app.use('/api', requireAuth, historyRoutes);
app.use('/api', requireAuth, assistantRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
