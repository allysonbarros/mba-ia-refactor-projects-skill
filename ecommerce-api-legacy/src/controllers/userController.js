const userModel = require('../models/userModel');

/**
 * DELETE /api/users/:id
 *
 * Deletes a user and cascade-deletes their enrollments and payments
 * so no orphaned records remain.
 */
async function deleteUser(req, res, next) {
    try {
        const userId = req.params.id;
        const deletedCount = await userModel.deleteUserCascade(userId);

        if (deletedCount === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        return res.status(200).json({ msg: 'User and related records deleted successfully.' });
    } catch (err) {
        next(err);
    }
}

module.exports = { deleteUser };
