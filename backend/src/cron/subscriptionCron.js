const cron = require('node-cron');
const { Op } = require('sequelize');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const Plan = require('../models/Plan');
const emailService = require('../utils/emailService');

// Función para enviar recordatorios de pago en intervalos específicos
const sendPaymentReminders = async () => {
  console.log('Ejecutando tarea de recordatorios de pago...');
  const reminderDays = [7, 3, 0]; // Días antes del vencimiento para enviar recordatorio

  for (const days of reminderDays) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reminderDate = new Date(today);
    reminderDate.setDate(today.getDate() + days);

    try {
      const subscriptionsToRemind = await Subscription.findAll({
        where: {
          estado: 'activa',
          fecha_renovacion: {
            [Op.gte]: reminderDate,
            [Op.lt]: new Date(reminderDate.getTime() + 24 * 60 * 60 * 1000),
          },
        },
        include: [User, Plan],
      });

      for (const sub of subscriptionsToRemind) {
        let subject = '';
        let html = '';

        if (days === 0) {
          subject = `Tu suscripción a ${sub.Plan.nombre} vence hoy`;
          html = `
            <p>Hola ${sub.User.nombre},</p>
            <p>Este es un recordatorio de que tu suscripción al plan <strong>${sub.Plan.nombre}</strong> vence hoy, <strong>${new Date(sub.fecha_renovacion).toLocaleDateString()}</strong>.</p>
            <p>Puedes renovar tu plan desde tu panel de cliente para evitar interrupciones en el servicio.</p>
            <p>Gracias,<br>El equipo de Hostreams</p>
          `;
        } else {
          subject = `Recordatorio de Pago - Vence en ${days} días`;
          html = `
            <p>Hola ${sub.User.nombre},</p>
            <p>Este es un recordatorio de que tu suscripción al plan <strong>${sub.Plan.nombre}</strong> está por vencer en <strong>${days} días</strong> (el ${new Date(sub.fecha_renovacion).toLocaleDateString()}).</p>
            <p>Puedes renovar tu plan desde tu panel de cliente para evitar interrupciones en el servicio.</p>
            <p>Gracias,<br>El equipo de Hostreams</p>
          `;
        }

        await emailService.sendConfirmationEmail(sub.User.email, subject, '', html);
        console.log(`Recordatorio de ${days} días enviado a ${sub.User.email}`);
      }
    } catch (error) {
      console.error(`Error al enviar recordatorios de ${days} días:`, error);
    }
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
