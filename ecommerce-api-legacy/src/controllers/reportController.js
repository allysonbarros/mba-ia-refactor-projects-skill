const enrollmentModel = require('../models/enrollmentModel');

/**
 * GET /api/admin/financial-report
 *
 * Returns a financial report grouped by course, with revenue and student list.
 * Uses a single JOIN query instead of N+1 queries.
 */
async function financialReport(req, res, next) {
    try {
        const rows = await enrollmentModel.getFinancialReport();

        // Group the flat rows by course title
        const courseMap = {};

        for (const row of rows) {
            if (!courseMap[row.courseTitle]) {
                courseMap[row.courseTitle] = { course: row.courseTitle, revenue: 0, students: [] };
            }

            const courseData = courseMap[row.courseTitle];

            // LEFT JOIN may produce rows with NULL student (course with no enrollments)
            if (row.studentName) {
                const paidAmount = row.paymentAmount || 0;

                if (row.paymentStatus === 'PAID') {
                    courseData.revenue += paidAmount;
                }

                courseData.students.push({
                    student: row.studentName,
                    paid: paidAmount,
                });
            }
        }

        const report = Object.values(courseMap);
        return res.status(200).json(report);
    } catch (err) {
        next(err);
    }
}

module.exports = { financialReport };
