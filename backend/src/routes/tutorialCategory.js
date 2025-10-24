const express = require('express');
const router = express.Router();
const { 
  getTutorialCategories,
  createTutorialCategory,
  updateTutorialCategory,
  deleteTutorialCategory
} = require('../controllers/tutorialCategoryController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// @route   GET api/tutorial-categorias
// @desc    Obtener todas las categorías de tutoriales
// @access  Public
router.get('/', getTutorialCategories);

// @route   POST api/tutorial-categorias
// @desc    Crear una nueva categoría de tutorial
// @access  Private (Admin)
router.post('/', auth, admin, createTutorialCategory);

// @route   PUT api/tutorial-categorias/:id
// @desc    Actualizar una categoría de tutorial
// @access  Private (Admin)
router.put('/:id', auth, admin, updateTutorialCategory);

// @route   DELETE api/tutorial-categorias/:id
// @desc    Eliminar una categoría de tutorial
// @access  Private (Admin)
router.delete('/:id', auth, admin, deleteTutorialCategory);

module.exports = router;
