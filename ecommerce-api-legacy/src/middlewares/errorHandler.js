/**
 * Centralized error-handling middleware.
 * Must have 4 parameters so Express recognises it as an error handler.
 */
function errorHandler(err, req, res, _next) {
    console.error('[ERROR]', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
}

module.exports = errorHandler;
