const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/admin/financial-report', reportController.financialReport);

module.exports = router;
