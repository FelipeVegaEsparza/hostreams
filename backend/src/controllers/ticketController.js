const { Op } = require('sequelize');
const Ticket = require('../models/Ticket');
const TicketMensaje = require('../models/TicketMensaje');
const User = require('../models/User');
const { sendConfirmationEmail } = require('../utils/emailService');

// Crear un nuevo ticket
exports.createTicket = async (req, res) => {
  const { asunto, mensaje } = req.body;
  const { id: usuario_id, email: userEmail, nombre: userName } = req.user;

  if (!asunto || !mensaje) {
    return res.status(400).json({ msg: 'Por favor, proporciona un asunto y un mensaje.' });
  }

  try {
    const newTicket = await Ticket.create({ usuario_id, asunto });
    await TicketMensaje.create({ ticket_id: newTicket.id, usuario_id, mensaje });

    // Notificar al cliente
    const clientSubject = `Ticket de Soporte Creado #${newTicket.id}`;
    const clientHtml = `<p>Hola ${userName},</p><p>Hemos recibido tu ticket de soporte "${asunto}". Nuestro equipo lo revisará y te responderá a la brevedad.</p><p>Puedes ver tu ticket aquí: <a href="http://localhost:5173/soporte/${newTicket.id}">Ver Ticket</a></p>`;
    await sendConfirmationEmail(userEmail, clientSubject, clientHtml, clientHtml);

    // Notificar al admin
    const adminSubject = `Nuevo Ticket de Soporte #${newTicket.id} de ${userName}`;
    const adminHtml = `<p>Se ha creado un nuevo ticket de soporte.</p><p><strong>Cliente:</strong> ${userName} (${userEmail})</p><p><strong>Asunto:</strong> ${asunto}</p><p><strong>Mensaje:</strong></p><p>${mensaje}</p><p>Puedes responder aquí: <a href="http://localhost:5173/soporte/${newTicket.id}">Ver Ticket</a></p>`;
    await sendConfirmationEmail('soporte@hostreams.com', adminSubject, adminHtml, adminHtml);

    res.status(201).json(newTicket);
  } catch (error) {
    console.error('Error al crear el ticket:', error);
    res.status(500).send('Error del servidor');
  }
};

// Obtener los tickets de un usuario con info de la última respuesta
exports.getUserTickets = async (req, res) => {
  const usuario_id = req.user.id;
  try {
    const tickets = await Ticket.findAll({
      where: { usuario_id },
      order: [['fecha_creacion', 'DESC']],
      raw: true,
    });

    // Ineficiente (N+1), pero funcional. Mejorar en el futuro si el rendimiento se ve afectado.
    for (const ticket of tickets) {
      const lastMessage = await TicketMensaje.findOne({
        where: { ticket_id: ticket.id },
        order: [['fecha_envio', 'DESC']],
        include: [{ model: User, attributes: ['nombre', 'rol'] }],
      });
      if (lastMessage) {
        ticket.lastReplier = lastMessage.User.get({ plain: true });
      }
    }

    res.json(tickets);
  } catch (error) {
    console.error('Error al obtener los tickets del usuario:', error);
    res.status(500).send('Error del servidor');
  }
};

// Obtener todos los tickets (solo para admin)
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      include: [{ model: User, attributes: ['nombre', 'email'] }],
      order: [['fecha_creacion', 'DESC']],
    });
    res.json(tickets);
  } catch (error) {
    console.error('Error al obtener todos los tickets:', error);
    res.status(500).send('Error del servidor');
  }
};

// Obtener un ticket específico por ID con sus mensajes
exports.getTicketById = async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await Ticket.findByPk(id, {
      include: [
        { model: User, attributes: ['nombre', 'email'] },
        {
          model: TicketMensaje,
          include: [{ model: User, attributes: ['nombre', 'rol'] }],
        },
      ],
      order: [[TicketMensaje, 'fecha_envio', 'ASC']],
    });
    if (!ticket) return res.status(404).json({ msg: 'Ticket no encontrado' });
    if (req.user.rol !== 'admin' && ticket.usuario_id !== req.user.id) {
      return res.status(403).json({ msg: 'Acceso no autorizado' });
    }
    res.json(ticket);
  } catch (error) {
    console.error(`Error al obtener el ticket ${id}:`, error);
    res.status(500).send('Error del servidor');
  }
};

// Añadir una respuesta a un ticket
exports.replyToTicket = async (req, res) => {
  const { id } = req.params;
  const { mensaje } = req.body;
  const { id: usuario_id, rol: userRole, nombre: userName } = req.user;

  if (!mensaje) return res.status(400).json({ msg: 'El mensaje no puede estar vacío.' });

  try {
    const ticket = await Ticket.findByPk(id, { include: [User] });
    if (!ticket) return res.status(404).json({ msg: 'Ticket no encontrado' });
    if (userRole !== 'admin' && ticket.usuario_id !== usuario_id) {
      return res.status(403).json({ msg: 'Acceso no autorizado para responder' });
    }

    const newMensaje = await TicketMensaje.create({ ticket_id: id, usuario_id, mensaje });

    // Notificaciones por correo
    if (userRole === 'admin') {
      ticket.estado = 'En Progreso';
      await ticket.save();
      const clientSubject = `Nueva Respuesta a tu Ticket #${id}`;
      const clientHtml = `<p>Hola ${ticket.User.nombre},</p><p>Nuestro equipo de soporte ha respondido a tu ticket "${ticket.asunto}".</p><p><strong>Respuesta:</strong></p><p>${mensaje}</p><p>Puedes ver la conversación completa aquí: <a href="http://localhost:5173/soporte/${id}">Ver Ticket</a></p>`;
      await sendConfirmationEmail(ticket.User.email, clientSubject, clientHtml, clientHtml);
    } else {
      const adminSubject = `Nueva Respuesta en Ticket #${id} de ${userName}`;
      const adminHtml = `<p>El cliente ${userName} ha respondido al ticket "${ticket.asunto}".</p><p><strong>Respuesta:</strong></p><p>${mensaje}</p><p>Puedes ver la conversación completa aquí: <a href="http://localhost:5173/soporte/${id}">Ver Ticket</a></p>`;
      await sendConfirmationEmail('soporte@hostreams.com', adminSubject, adminHtml, adminHtml);
    }

    res.status(201).json(newMensaje);
  } catch (error) {
    console.error(`Error al responder al ticket ${id}:`, error);
    res.status(500).send('Error del servidor');
  }
};

// Actualizar el estado de un ticket (solo para admin)
exports.updateTicketStatus = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  if (!estado) return res.status(400).json({ msg: 'Por favor, proporciona un nuevo estado.' });

  try {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) return res.status(404).json({ msg: 'Ticket no encontrado' });
    ticket.estado = estado;
    await ticket.save();
    res.json(ticket);
  } catch (error) {
    console.error(`Error al actualizar el estado del ticket ${id}:`, error);
    res.status(500).send('Error del servidor');
  }
};
