const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// @route   GET api/users
// @desc    Obtener todos los usuarios
// @access  Private (Admin)
router.get('/', auth, admin, userController.getUsers);

// @route   PUT api/admin/users/:id
// @desc    Actualizar un usuario (solo admin)
// @access  Private (Admin)
router.put('/:id', auth, admin, userController.updateUser);

// @route   DELETE api/admin/users/:id
// @desc    Eliminar un usuario (solo admin)
// @access  Private (Admin)
router.delete('/:id', auth, admin, userController.deleteUser);

module.exports = router;
