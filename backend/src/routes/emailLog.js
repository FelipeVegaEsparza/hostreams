const express = require('express');
const router = express.Router();
const emailLogController = require('../controllers/emailLogController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// @route   GET api/admin/email-logs
// @desc    Obtener todos los registros de correos
// @access  Private (Admin)
router.get('/', auth, admin, emailLogController.getEmailLogs);

module.exports = router;
