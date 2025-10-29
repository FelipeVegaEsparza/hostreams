const express = require('express');
const router = express.Router();
const paypalController = require('../controllers/paypalController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/paypal/create-order
// @desc    Crear una orden de pago de PayPal
// @access  Private (requiere autenticación)
router.post('/create-order', authMiddleware, paypalController.createOrder);

// @route   POST api/paypal/capture-order
// @desc    Capturar un pago de PayPal
// @access  Private (requiere autenticación)
router.post('/capture-order', authMiddleware, paypalController.captureOrder);

module.exports = router;
