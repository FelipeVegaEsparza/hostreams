const express = require('express');
const router = express.Router();
const paypalController = require('../controllers/paypalController');

// @route   POST api/paypal/create-order
// @desc    Crear una orden de pago de PayPal
// @access  Private (requiere autenticación)
router.post('/create-order', paypalController.createOrder);

// @route   POST api/paypal/capture-order
// @desc    Capturar un pago de PayPal
// @access  Private (requiere autenticación)
router.post('/capture-order', paypalController.captureOrder);

module.exports = router;
