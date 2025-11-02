const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// @route   GET api/subscriptions
// @desc    Obtener todas las suscripciones
// @access  Private (Admin)
router.get('/', auth, admin, subscriptionController.getSubscriptions);

// @route   POST api/subscriptions
// @desc    Crear o renovar una suscripción
// @access  Private
router.post('/', auth, subscriptionController.createSubscription);

// @route   PUT api/subscriptions/:id/status
// @desc    Actualizar el estado de una suscripción
// @access  Private (Admin)
router.put('/:id/status', auth, admin, subscriptionController.updateSubscriptionStatus);

// @route   DELETE api/subscriptions/:id
// @desc    Eliminar una suscripción
// @access  Private (Admin)
router.delete('/:id', auth, admin, subscriptionController.deleteSubscription);

module.exports = router;
