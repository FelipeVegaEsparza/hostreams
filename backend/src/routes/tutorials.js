const express = require('express');
const router = express.Router();
const { 
  getTutorials,
  getTutorialById,
  createTutorial,
  updateTutorial,
  deleteTutorial
} = require('../controllers/tutorialController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// @route   GET api/tutoriales
// @desc    Obtener todos los tutoriales (opcionalmente por categoría)
// @access  Public
router.get('/', getTutorials);

// @route   GET api/tutoriales/:id
// @desc    Obtener un tutorial por ID
// @access  Public
router.get('/:id', getTutorialById);

// @route   POST api/tutoriales
// @desc    Crear un nuevo tutorial
// @access  Private (Admin)
router.post('/', auth, admin, createTutorial);

// @route   PUT api/tutoriales/:id
// @desc    Actualizar un tutorial
// @access  Private (Admin)
router.put('/:id', auth, admin, updateTutorial);

// @route   DELETE api/tutoriales/:id
// @desc    Eliminar un tutorial
// @access  Private (Admin)
router.delete('/:id', auth, admin, deleteTutorial);

module.exports = router;
