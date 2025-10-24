const Subscription = require('../models/Subscription');
const User = require('../models/User');
const Plan = require('../models/Plan');
const Payment = require('../models/Payment'); // Importar el modelo Payment

// Obtener todas las suscripciones (solo admin)
exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll({
      include: [
        { model: User, attributes: ['id', 'nombre', 'email'] },
        { model: Plan, attributes: ['id', 'nombre', 'precio_clp', 'precio_usd'] },
      ],
    });
    res.json(subscriptions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};

// Crear o renovar una suscripción
exports.createSubscription = async (req, res) => {
  console.log('createSubscription: Incoming request body:', req.body);
  const { planId, paymentMethod, amount, currency, nombre_proyecto, subscriptionToRenewId } = req.body;
  const usuario_id = req.user.id; // ID del usuario autenticado
  console.log('createSubscription: Authenticated user ID:', usuario_id);

  try {
    const user = await User.findByPk(usuario_id);
    const plan = await Plan.findByPk(planId);

    if (!user || !plan) {
      return res.status(404).json({ message: 'Usuario o Plan no encontrado.' });
    }

    let subscription;
    let paymentStatus = 'aprobado'; // Asumimos que el pago con pasarela es aprobado instantáneamente

    if (subscriptionToRenewId) {
      // Lógica para renovar una suscripción existente
      let existingSubscription = await Subscription.findByPk(subscriptionToRenewId);

      if (!existingSubscription || existingSubscription.usuario_id !== usuario_id) {
        return res.status(404).json({ message: 'Suscripción a renovar no encontrada o no pertenece al usuario.' });
      }

      let newRenewalDate = new Date(existingSubscription.fecha_renovacion);
      if (newRenewalDate < new Date()) {
          newRenewalDate = new Date();
      }
      newRenewalDate.setMonth(newRenewalDate.getMonth() + 1); // Asumiendo periodo mensual

      existingSubscription.fecha_renovacion = newRenewalDate;
      existingSubscription.estado = 'activa';
      existingSubscription.plan_id = plan.id; // Actualizar al plan del pago
      existingSubscription.metodo_pago = paymentMethod; // Actualizar método de pago
      existingSubscription.monto = amount;
      existingSubscription.moneda = currency;
      existingSubscription.nombre_proyecto = nombre_proyecto;

      await existingSubscription.save();
      subscription = existingSubscription;

    } else {
      // Lógica para crear una nueva suscripción
      const fechaInicio = new Date();
      const fechaRenovacion = new Date(fechaInicio);
      fechaRenovacion.setMonth(fechaRenovacion.getMonth() + 1); // Asumiendo periodo mensual

      subscription = await Subscription.create({
        usuario_id,
        plan_id: plan.id,
        metodo_pago: paymentMethod,
        monto: amount,
        moneda: currency,
        estado: 'activa',
        fecha_inicio: fechaInicio,
        fecha_renovacion: fechaRenovacion,
        nombre_proyecto,
      });
    }

    // Crear un registro de pago asociado
    await Payment.create({
      usuario_id,
      suscripcion_id: subscription.id,
      plan_id: plan.id,
      metodo: paymentMethod,
      monto: amount,
      moneda: currency,
      estado: paymentStatus,
      comprobante: null, // No hay comprobante para pagos con pasarela
      nombre_proyecto, // Guardar nombre_proyecto en el pago
    });

    res.status(201).json({ message: 'Suscripción procesada exitosamente.', subscription });

  } catch (err) {
    console.error('Error al procesar suscripción en createSubscription:', err.message, err.stack);
    res.status(500).json({ message: 'Error del servidor al procesar la suscripción.' });
  }
};

// Actualizar el estado de una suscripción (solo admin)
exports.updateSubscriptionStatus = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body; // 'activa', 'cancelada', 'pendiente'

  try {
    let subscription = await Subscription.findByPk(id);
    if (!subscription) {
      return res.status(404).json({ msg: 'Suscripción no encontrada' });
    }

    subscription.estado = estado;
    await subscription.save();
    res.json(subscription);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};
