const express = require('express');
const router = express.Router();
const { handleContactRequest } = require('../controllers/contactController');

// @route   POST api/contact
// @desc    Manejar envíos del formulario de contacto
// @access  Public
router.post('/', handleContactRequest);

module.exports = router;
