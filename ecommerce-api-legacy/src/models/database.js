const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');

/**
 * Promisified helper: run a SQL statement (INSERT, UPDATE, DELETE, CREATE).
 * Resolves with { lastID, changes } on success.
 */
function dbRun(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) return reject(err);
            resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
}

/**
 * Promisified helper: fetch a single row.
 */
function dbGet(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
}

/**
 * Promisified helper: fetch all rows.
 */
function dbAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

/**
 * Initialize the schema and seed data.
 */
async function initializeDatabase() {
    await dbRun("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT, pass TEXT)");
    await dbRun("CREATE TABLE IF NOT EXISTS courses (id INTEGER PRIMARY KEY, title TEXT, price REAL, active INTEGER)");
    await dbRun("CREATE TABLE IF NOT EXISTS enrollments (id INTEGER PRIMARY KEY, user_id INTEGER, course_id INTEGER)");
    await dbRun("CREATE TABLE IF NOT EXISTS payments (id INTEGER PRIMARY KEY, enrollment_id INTEGER, amount REAL, status TEXT)");
    await dbRun("CREATE TABLE IF NOT EXISTS audit_logs (id INTEGER PRIMARY KEY, action TEXT, created_at DATETIME)");

    // Seed data
    await dbRun("INSERT INTO users (name, email, pass) VALUES ('Leonan', 'leonan@fullcycle.com.br', '123')");
    await dbRun("INSERT INTO courses (title, price, active) VALUES ('Clean Architecture', 997.00, 1)");
    await dbRun("INSERT INTO courses (title, price, active) VALUES ('Docker', 497.00, 1)");
    await dbRun("INSERT INTO enrollments (user_id, course_id) VALUES (1, 1)");
    await dbRun("INSERT INTO payments (enrollment_id, amount, status) VALUES (1, 997.00, 'PAID')");
}

module.exports = { db, dbRun, dbGet, dbAll, initializeDatabase };
