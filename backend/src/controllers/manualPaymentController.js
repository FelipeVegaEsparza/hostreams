const Payment = require('../models/Payment');
const Subscription = require('../models/Subscription');
const multer = require('multer');
const path = require('path');
const emailService = require('../utils/emailService'); // Importar el servicio de correo
const User = require('../models/User'); // Importar el modelo User para obtener el email
const Plan = require('../models/Plan'); // Importar el modelo Plan

// Configuración de Multer para la subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // La carpeta 'uploads' debe existir en la raíz del backend
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

// Obtener todos los pagos manuales (solo admin)
exports.getManualPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        { model: User, attributes: ['id', 'nombre', 'email'] },
        { model: Plan, attributes: ['id', 'nombre', 'precio_clp', 'precio_usd'] },
      ],
      order: [['fecha_pago', 'DESC']],
    });
    res.json(payments);
  } catch (err) {
    console.error('Error al obtener pagos manuales:', err.message);
    res.status(500).send('Error del servidor');
  }
};

exports.uploadComprobante = upload.single('comprobante'); // 'comprobante' es el nombre del campo en el formulario

exports.createManualPayment = async (req, res) => {
  const { planId, monto, moneda, nombre_proyecto } = req.body;
  const usuario_id = req.user.id; // Obtener usuario_id del token de autenticación
  const comprobante = req.file ? req.file.path : null; // Ruta del archivo subido

  try {
    const payment = await Payment.create({
      usuario_id,
      plan_id: planId, // Asociar el pago pendiente a un plan, usando el nombre de campo correcto
      metodo: 'transferencia_manual',
      monto,
      moneda,
      estado: 'pendiente', // Estado inicial pendiente de aprobación
      comprobante,
      nombre_proyecto,
    });

    res.status(201).json({ msg: 'Pago manual registrado, pendiente de aprobación.', payment });
  } catch (error) {
    console.error('Error al registrar pago manual:', error.message);
    res.status(500).json({ error: 'Error al registrar pago manual' });
  }
};

exports.approveManualPayment = async (req, res) => {
  const { paymentId } = req.params;
  const { estado } = req.body; // 'aprobado' o 'rechazado'

  try {
    const payment = await Payment.findByPk(paymentId);

    if (!payment) {
      return res.status(404).json({ msg: 'Pago no encontrado' });
    }

    if (payment.estado !== 'pendiente') {
      return res.status(400).json({ msg: 'El pago ya ha sido procesado' });
    }

    payment.estado = estado; // 'aprobado' o 'rechazado'
    await payment.save();

    // Si el pago es aprobado, crear o renovar una suscripción
    if (estado === 'aprobado') {
      const user = await User.findByPk(payment.usuario_id);
      const plan = await Plan.findByPk(payment.plan_id);
      const nombreProyecto = payment.nombre_proyecto; // Obtener nombre_proyecto del pago

      if (!user || !plan) {
        return res.status(404).json({ msg: 'Usuario o Plan no encontrado para la suscripción.' });
      }

      // Buscar una suscripción activa existente para el usuario
      let existingSubscription = await Subscription.findOne({
        where: {
          usuario_id: user.id,
          estado: 'activa',
        },
        order: [['fecha_renovacion', 'DESC']], // Obtener la más reciente si hay varias
      });

      let subscriptionToAssociatePayment; // Variable para la suscripción final (nueva o renovada)

      if (existingSubscription) {
        // Si existe una suscripción activa, renovarla
        let newRenewalDate = new Date(existingSubscription.fecha_renovacion);

        // Si la fecha de renovación actual ya pasó, renovar a partir de hoy
        if (newRenewalDate < new Date()) {
            newRenewalDate = new Date();
        }
        newRenewalDate.setMonth(newRenewalDate.getMonth() + 1); // Asumiendo periodo mensual

        existingSubscription.fecha_renovacion = newRenewalDate;
        existingSubscription.estado = 'activa'; // Asegurar que esté activa
        existingSubscription.plan_id = plan.id; // Actualizar al plan del pago
        existingSubscription.metodo_pago = payment.metodo; // Actualizar método de pago
        existingSubscription.monto = payment.monto; // Actualizar monto
        existingSubscription.moneda = payment.moneda; // Actualizar moneda
        existingSubscription.nombre_proyecto = nombreProyecto; // Actualizar nombre_proyecto

        await existingSubscription.save();
        subscriptionToAssociatePayment = existingSubscription;

        // Enviar correo de confirmación de pago y renovación
        await emailService.sendConfirmationEmail(
          user.email,
          'Confirmación de Pago y Renovación de Suscripción - Hostreams',
          `Hola ${user.nombre},\n\nTu pago manual ha sido aprobado y tu suscripción al plan ${plan.nombre} (${nombreProyecto || 'sin proyecto'}) ha sido renovada exitosamente. Tu nueva fecha de renovación es ${newRenewalDate.toISOString().split('T')[0]}.`,
          `<p>Hola <strong>${user.nombre}</strong>,</p><p>Tu pago manual ha sido aprobado y tu suscripción al plan <strong>${plan.nombre}</strong> (${nombreProyecto || 'sin proyecto'}) ha sido renovada exitosamente.</p><p>Tu nueva fecha de renovación es <strong>${newRenewalDate.toISOString().split('T')[0]}</strong>.</p><p>¡Gracias por tu preferencia!</p>`
        );

      } else {
        // Si no existe una suscripción activa, crear una nueva (comportamiento actual)
        const fechaInicio = new Date();
        const fechaRenovacion = new Date(fechaInicio);
        fechaRenovacion.setMonth(fechaRenovacion.getMonth() + 1); // Asumiendo periodo mensual

        const newSubscription = await Subscription.create({
          usuario_id: user.id,
          plan_id: plan.id,
          metodo_pago: payment.metodo,
          monto: payment.monto,
          moneda: payment.moneda,
          estado: 'activa',
          fecha_inicio: fechaInicio,
          fecha_renovacion: fechaRenovacion,
          nombre_proyecto: nombreProyecto, // Añadir nombre_proyecto
        });
        subscriptionToAssociatePayment = newSubscription;

        // Enviar correo de confirmación de pago y suscripción
        await emailService.sendConfirmationEmail(
          user.email,
          'Confirmación de Pago y Suscripción - Hostreams',
          `Hola ${user.nombre},\n\nTu pago manual ha sido aprobado y tu suscripción al plan ${plan.nombre} (${nombreProyecto || 'sin proyecto'}) ahora está activa.`,
          `<p>Hola <strong>${user.nombre}</strong>,</p><p>Tu pago manual ha sido aprobado y tu suscripción al plan <strong>${plan.nombre}</strong> (${nombreProyecto || 'sin proyecto'}) ahora está activa.</p><p>¡Gracias por tu preferencia!</p>`
        );
      }

      // Asociar el pago a la suscripción (nueva o renovada)
      payment.suscripcion_id = subscriptionToAssociatePayment.id;
      await payment.save();
    }

    res.json({ msg: `Pago ${estado} correctamente.`, payment });
  } catch (error) {
    console.error('Error al aprobar/rechazar pago manual:', error.message);
    res.status(500).json({ error: 'Error al aprobar/rechazar pago manual' });
  }
};
