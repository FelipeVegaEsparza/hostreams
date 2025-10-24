const express = require('express');
const router = express.Router();
const manualPaymentController = require('../controllers/manualPaymentController');
const auth = require('../middleware/authMiddleware'); // Middleware de autenticación
const admin = require('../middleware/adminMiddleware'); // Middleware de administrador

// @route   GET api/manual-payment
// @desc    Obtener todos los pagos manuales (solo admin)
// @access  Private (requiere autenticación y rol de admin)
router.get('/', auth, admin, manualPaymentController.getManualPayments);

// @route   POST api/manual-payment/create
// @desc    Registrar un pago manual y subir comprobante
// @access  Private (requiere autenticación)
router.post('/create', auth, manualPaymentController.uploadComprobante, manualPaymentController.createManualPayment);

// @route   PUT api/manual-payment/approve/:paymentId
// @desc    Aprobar o rechazar un pago manual (solo para administradores)
// @access  Private (requiere autenticación y rol de admin)
router.put('/approve/:paymentId', auth, admin, manualPaymentController.approveManualPayment);

module.exports = router;