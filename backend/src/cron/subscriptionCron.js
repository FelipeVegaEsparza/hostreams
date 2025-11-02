const cron = require('node-cron');
const { Op } = require('sequelize');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const Plan = require('../models/Plan');
const emailService = require('../utils/emailService');

// Función para enviar recordatorios de pago
const sendPaymentReminders = async () => {
  console.log('Ejecutando tarea de recordatorios de pago...');
  const today = new Date();
  const reminderDate = new Date();
  reminderDate.setDate(today.getDate() + 7); // Recordatorio 7 días antes

  try {
    const upcomingSubscriptions = await Subscription.findAll({
      where: {
        estado: 'activa',
        fecha_renovacion: {
          [Op.between]: [today, reminderDate],
        },
      },
      include: [User, Plan],
    });

    for (const sub of upcomingSubscriptions) {
      const subject = `Recordatorio de Pago - Tu suscripción a ${sub.Plan.nombre}`;
      const html = `
        <p>Hola ${sub.User.nombre},</p>
        <p>Este es un recordatorio de que tu suscripción al plan <strong>${sub.Plan.nombre}</strong> está por vencer el día <strong>${new Date(sub.fecha_renovacion).toLocaleDateString()}</strong>.</p>
        <p>Puedes renovar tu plan desde tu panel de cliente para evitar interrupciones en el servicio.</p>
        <p>Gracias,<br>El equipo de Hostreams</p>
      `;
      await emailService.sendConfirmationEmail(sub.User.email, subject, '', html);
      console.log(`Recordatorio de pago enviado a ${sub.User.email}`);
    }
  } catch (error) {
    console.error('Error al enviar recordatorios de pago:', error);
  }
};

// Función para actualizar suscripciones vencidas
const updateOverdueSubscriptions = async () => {
  console.log('Ejecutando tarea de actualización de suscripciones vencidas...');
  const today = new Date();

  try {
    const overdueSubscriptions = await Subscription.findAll({
      where: {
        estado: 'activa',
        fecha_renovacion: {
          [Op.lt]: today,
        },
      },
      include: [User, Plan],
    });

    for (const sub of overdueSubscriptions) {
      sub.estado = 'pendiente'; // Cambiar estado a pendiente
      await sub.save();
      console.log(`Suscripción #${sub.id} de ${sub.User.email} actualizada a PENDIENTE.`);

      const subject = `Tu suscripción a ${sub.Plan.nombre} ha vencido`;
      const html = `
        <p>Hola ${sub.User.nombre},</p>
        <p>Tu suscripción al plan <strong>${sub.Plan.nombre}</strong> ha vencido.</p>
        <p>Tu servicio puede ser interrumpido. Por favor, renueva tu plan lo antes posible desde tu panel de cliente para continuar disfrutando de nuestros servicios.</p>
        <p>Gracias,<br>El equipo de Hostreams</p>
      `;
      await emailService.sendConfirmationEmail(sub.User.email, subject, '', html);
      console.log(`Correo de suscripción vencida enviado a ${sub.User.email}`);
    }
  } catch (error) {
    console.error('Error al actualizar suscripciones vencidas:', error);
  }
};

// Programar las tareas para que se ejecuten una vez al día a la 1 AM
const initScheduledJobs = () => {
  // Se ejecuta todos los días a las 13:00 (1 PM)
  cron.schedule('0 13 * * *', () => {
    console.log('--- Iniciando Tareas Programadas Diarias ---');
    sendPaymentReminders();
    updateOverdueSubscriptions();
  });

  console.log('Tareas programadas (cron jobs) inicializadas.');
};

module.exports = initScheduledJobs;
