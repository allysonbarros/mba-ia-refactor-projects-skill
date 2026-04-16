const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.delete('/users/:id', userController.deleteUser);

module.exports = router;
