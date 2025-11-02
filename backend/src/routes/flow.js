const express = require('express');
const router = express.Router();
const flowController = require('../controllers/flowController');

// @route   POST api/flow/create-payment
// @desc    Crear un pago con Flow.cl
// @access  Private (requiere autenticación)
router.post('/create-payment', flowController.createPayment);

// @route   POST api/flow/payment-status
// @desc    Obtener el estado de un pago de Flow.cl
// @access  Private (requiere autenticación)
router.post('/payment-status', flowController.getPaymentStatus);

// @route   POST api/flow/confirm-payment
// @desc    Webhook para recibir la confirmación de pago de Flow.cl
// @access  Public
router.post('/confirm-payment', flowController.confirmPayment);

module.exports = router;
