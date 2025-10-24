const express = require('express');
const router = express.Router();
const { 
  createTicket,
  getUserTickets,
  getAllTickets,
  getTicketById,
  replyToTicket,
  updateTicketStatus 
} = require('../controllers/ticketController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// --- Rutas para Clientes ---

// @route   POST api/tickets
// @desc    Crear un nuevo ticket
// @access  Private
router.post('/', auth, createTicket);

// @route   GET api/tickets
// @desc    Obtener los tickets del usuario logueado
// @access  Private
router.get('/', auth, getUserTickets);

// @route   GET api/tickets/:id
// @desc    Obtener un ticket específico (con sus mensajes)
// @access  Private
router.get('/:id', auth, getTicketById);

// @route   POST api/tickets/:id/reply
// @desc    Añadir una respuesta a un ticket
// @access  Private
router.post('/:id/reply', auth, replyToTicket);


// --- Rutas para Administradores ---

// @route   GET api/tickets/admin/all
// @desc    Obtener todos los tickets
// @access  Private (Admin)
router.get('/admin/all', auth, admin, getAllTickets);

// @route   PUT api/tickets/admin/:id/status
// @desc    Actualizar el estado de un ticket
// @access  Private (Admin)
router.put('/admin/:id/status', auth, admin, updateTicketStatus);


module.exports = router;
