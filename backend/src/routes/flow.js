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

module.exports = router;
