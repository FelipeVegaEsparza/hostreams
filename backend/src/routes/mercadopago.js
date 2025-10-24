const express = require('express');
const router = express.Router();
const mercadopagoController = require('../controllers/mercadopagoController');

// @route   POST api/mercadopago/create-preference
// @desc    Crear una preferencia de pago de MercadoPago
// @access  Private (requiere autenticación)
router.post('/create-preference', mercadopagoController.createPreference);

module.exports = router;
