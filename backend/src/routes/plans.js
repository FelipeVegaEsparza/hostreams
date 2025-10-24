const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// @route   GET api/plans
// @desc    Obtener planes activos (filtrables por categoría)
// @access  Public
router.get('/', planController.getPlans);

// @route   GET api/plans/all
// @desc    Obtener TODOS los planes (para admin)
// @access  Private (Admin)
router.get('/all', auth, admin, planController.getAllPlans);

// @route   GET api/plans/:id
// @desc    Obtener un plan por ID
// @access  Public
router.get('/:id', planController.getPlanById);

// @route   POST api/plans
// @desc    Crear un nuevo plan
// @access  Private (Admin)
router.post('/', auth, admin, planController.createPlan);

// @route   PUT api/plans/:id
// @desc    Actualizar un plan
// @access  Private (Admin)
router.put('/:id', auth, admin, planController.updatePlan);

// @route   DELETE api/plans/:id
// @desc    Eliminar un plan
// @access  Private (Admin)
router.delete('/:id', auth, admin, planController.deletePlan);

module.exports = router;