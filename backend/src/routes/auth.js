const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Importar authController
const { validateRegister, validateLogin } = require('../middleware/validationMiddleware');
const authMiddleware = require('../middleware/authMiddleware'); // Importar el middleware de autenticación

// @route   POST api/auth/register
// @desc    Registrar usuario
// @access  Public
router.post('/register', validateRegister, authController.register);

// @route   POST api/auth/login
// @desc    Autenticar usuario y obtener token
// @access  Public
router.post('/login', validateLogin, authController.login);

// @route   GET api/auth/me
// @desc    Obtener información del usuario autenticado
// @access  Private
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;