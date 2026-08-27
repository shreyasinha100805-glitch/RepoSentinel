/**
 * Server entrypoint for RepoSentinel.
 */
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🛡️  RepoSentinel Backend Server Running on Port ${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   DEMO_MODE: ${process.env.DEMO_MODE === 'true' ? 'ENABLED (Safe Simulated Mode)' : 'DISABLED (Live Mode)'}`);
    console.log(`====================================================`);
});
