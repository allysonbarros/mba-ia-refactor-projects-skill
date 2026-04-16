const { dbRun, dbAll } = require('./database');

/**
 * Create an enrollment record. Returns the new enrollment id.
 */
async function createEnrollment(userId, courseId) {
    const result = await dbRun(
        "INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)",
        [userId, courseId]
    );
    return result.lastID;
}

/**
 * Create a payment record linked to an enrollment.
 */
async function createPayment(enrollmentId, amount, status) {
    const result = await dbRun(
        "INSERT INTO payments (enrollment_id, amount, status) VALUES (?, ?, ?)",
        [enrollmentId, amount, status]
    );
    return result.lastID;
}

/**
 * Create an audit log entry.
 */
async function createAuditLog(action) {
    await dbRun(
        "INSERT INTO audit_logs (action, created_at) VALUES (?, datetime('now'))",
        [action]
    );
}

/**
 * Financial report using a single JOIN query instead of N+1.
 * Returns rows with course title, student name, payment amount, and payment status.
 */
async function getFinancialReport() {
    const sql = `
        SELECT
            c.title   AS courseTitle,
            u.name    AS studentName,
            p.amount  AS paymentAmount,
            p.status  AS paymentStatus
        FROM courses c
        LEFT JOIN enrollments e ON e.course_id = c.id
        LEFT JOIN users u       ON u.id = e.user_id
        LEFT JOIN payments p    ON p.enrollment_id = e.id
        ORDER BY c.title, u.name
    `;
    return dbAll(sql);
}

module.exports = { createEnrollment, createPayment, createAuditLog, getFinancialReport };
