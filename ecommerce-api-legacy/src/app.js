const express = require('express');
const settings = require('./config/settings');
const { initializeDatabase } = require('./models/database');
const checkoutRoutes = require('./routes/checkoutRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(express.json());

// Mount routes under /api
app.use('/api', checkoutRoutes);
app.use('/api', adminRoutes);
app.use('/api', userRoutes);

// Centralized error handler (must be registered after routes)
app.use(errorHandler);

/**
 * Async bootstrap: initialise the database, then start the server.
 */
async function start() {
    await initializeDatabase();

    app.listen(settings.port, () => {
        console.log(`LMS API running on port ${settings.port}`);
    });
}

// Only auto-start when run directly (not when required for tests)
if (require.main === module) {
    start().catch((err) => {
        console.error('Failed to start application:', err);
        process.exit(1);
    });
}

module.exports = { app, start };
