const { dbGet } = require('./database');

/**
 * Find an active course by its id.
 */
async function findActiveCourseById(courseId) {
    return dbGet("SELECT id, title, price, active FROM courses WHERE id = ? AND active = 1", [courseId]);
}

module.exports = { findActiveCourseById };
