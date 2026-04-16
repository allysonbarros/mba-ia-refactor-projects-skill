const courseModel = require('../models/courseModel');
const userModel = require('../models/userModel');
const enrollmentModel = require('../models/enrollmentModel');

/**
 * POST /api/checkout
 *
 * Accepts legacy field names (usr, eml, pwd, c_id, card) and performs:
 *   1. Course lookup
 *   2. User lookup or creation (with proper password hashing)
 *   3. Payment simulation (card starting with "4" is approved)
 *   4. Enrollment + payment + audit log creation
 */
async function checkout(req, res, next) {
    try {
        // Map legacy short field names to descriptive names
        const username = req.body.usr;
        const email = req.body.eml;
        const password = req.body.pwd;
        const courseId = req.body.c_id;
        const cardNumber = req.body.card;

        if (!username || !email || !courseId || !cardNumber) {
            return res.status(400).json({ error: 'Missing required fields (usr, eml, c_id, card).' });
        }

        // 1. Find the active course
        const course = await courseModel.findActiveCourseById(courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found or inactive.' });
        }

        // 2. Find or create user
        let existingUser = await userModel.findByEmail(email);
        let userId;

        if (!existingUser) {
            const plainPassword = password || '123456';
            userId = await userModel.createUser(username, email, plainPassword);
        } else {
            userId = existingUser.id;
        }

        // 3. Simulate payment (never log card number or gateway key)
        const paymentStatus = cardNumber.startsWith('4') ? 'PAID' : 'DENIED';

        if (paymentStatus === 'DENIED') {
            return res.status(400).json({ error: 'Payment denied.' });
        }

        // 4. Create enrollment, payment record, and audit log
        const enrollmentId = await enrollmentModel.createEnrollment(userId, courseId);
        await enrollmentModel.createPayment(enrollmentId, course.price, paymentStatus);
        await enrollmentModel.createAuditLog(`Checkout course ${courseId} by user ${userId}`);

        return res.status(200).json({ msg: 'Sucesso', enrollment_id: enrollmentId });
    } catch (err) {
        next(err);
    }
}

module.exports = { checkout };
