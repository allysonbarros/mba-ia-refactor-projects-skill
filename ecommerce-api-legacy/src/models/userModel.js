const crypto = require('crypto');
const { dbRun, dbGet } = require('./database');

/**
 * Hash a password using PBKDF2 with a random salt.
 * Returns "salt:derivedKey" as a hex string.
 */
function hashPassword(plainPassword) {
    const salt = crypto.randomBytes(16).toString('hex');
    const derivedKey = crypto.pbkdf2Sync(plainPassword, salt, 100000, 64, 'sha512').toString('hex');
    return `${salt}:${derivedKey}`;
}

/**
 * Find a user by email.
 */
async function findByEmail(email) {
    return dbGet("SELECT id, name, email, pass FROM users WHERE email = ?", [email]);
}

/**
 * Find a user by id.
 */
async function findById(userId) {
    return dbGet("SELECT id, name, email FROM users WHERE id = ?", [userId]);
}

/**
 * Create a new user. Returns the new user's id.
 */
async function createUser(name, email, plainPassword) {
    const hashedPassword = hashPassword(plainPassword);
    const result = await dbRun(
        "INSERT INTO users (name, email, pass) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
    );
    return result.lastID;
}

/**
 * Delete a user and cascade-delete their enrollments and payments.
 */
async function deleteUserCascade(userId) {
    // First, delete payments linked to this user's enrollments
    await dbRun(
        "DELETE FROM payments WHERE enrollment_id IN (SELECT id FROM enrollments WHERE user_id = ?)",
        [userId]
    );
    // Then delete the enrollments
    await dbRun("DELETE FROM enrollments WHERE user_id = ?", [userId]);
    // Finally delete the user
    const result = await dbRun("DELETE FROM users WHERE id = ?", [userId]);
    return result.changes;
}

module.exports = { hashPassword, findByEmail, findById, createUser, deleteUserCascade };
