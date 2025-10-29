const express = require('express');
const router = express.Router();
const mercadopagoController = require('../controllers/mercadopagoController');

// @route   POST /api/mercadopago/create-preference
// @desc    Crear una preferencia de pago en MercadoPago
// @access  Private (o Public si se maneja la autenticación en el frontend)
router.post('/create-preference', mercadopagoController.createPreference);

// @route   POST /api/mercadopago/webhook
// @desc    Recibir notificaciones de MercadoPago
// @access  Public (MercadoPago envía las notificaciones)
router.post('/webhook', mercadopagoController.receiveWebhook);

module.exports = router;