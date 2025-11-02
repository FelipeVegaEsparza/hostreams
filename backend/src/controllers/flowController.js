const axios = require('axios');
const crypto = require('crypto');
const querystring = require('querystring');
const { FLOW_API_KEY, FLOW_SECRET_KEY, FLOW_API_URL, FLOW_SUCCESS_URL, FLOW_FAILURE_URL, FLOW_CONFIRMATION_URL } = process.env;

// Función auxiliar para generar el 'sign' requerido por Flow.cl
const generateFlowSign = (params, secretKey) => {
  const sortedKeys = Object.keys(params).sort();
  let stringToSign = '';
  sortedKeys.forEach(key => {
    stringToSign += key + params[key];
  });
  return crypto.createHmac('sha256', secretKey).update(stringToSign).digest('hex');
};

exports.createPayment = async (req, res) => {
  const { planId, amount, email, subject, currency } = req.body; // planId para asociar la suscripción

  try {
    const params = {
      apiKey: FLOW_API_KEY,
      commerceOrder: `ORDER-${Date.now()}`, // Generar un número de orden único
      subject: subject || `Pago de suscripción Hostreams - Plan ${planId}`,
      currency: currency,
      amount: Math.floor(parseFloat(amount)), // Ensure amount is an integer
      email: email,
      urlReturn: FLOW_SUCCESS_URL, // Flow.cl expects a single return URL
      urlConfirmation: FLOW_CONFIRMATION_URL, // URL para que Flow.cl notifique al backend
    };

    console.log('Flow.cl API Request Params:', params); // Log the parameters

    params.s = generateFlowSign(params, FLOW_SECRET_KEY);

    const response = await axios.post(`${FLOW_API_URL}/payment/create`, querystring.stringify(params), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Failed to create Flow payment:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to create Flow payment', details: error.response ? error.response.data : error.message });
  }
};

const { Op } = require('sequelize');
const User = require('../models/User');
const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');
const Payment = require('../models/Payment');

// Función para calcular la fecha de renovación
const calcularFechaRenovacion = (periodo) => {
  const fecha = new Date();
  if (periodo === 'mensual') {
    fecha.setMonth(fecha.getMonth() + 1);
  } else if (periodo === 'anual') {
    fecha.setFullYear(fecha.getFullYear() + 1);
  }
  return fecha;
};

exports.confirmPayment = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    console.log('Confirmación de Flow recibida sin token.');
    return res.status(400).send('Token no proporcionado');
  }

  console.log(`Token de confirmación de Flow recibido: ${token}`);

  try {
    // 1. Verificar el estado del pago con Flow
    const params = { apiKey: FLOW_API_KEY, token };
    params.s = generateFlowSign(params, FLOW_SECRET_KEY);

    const statusResponse = await axios.get(`${FLOW_API_URL}/payment/getStatus`, { params });
    const paymentData = statusResponse.data;

    console.log('Respuesta de /payment/getStatus:', paymentData);

    // status = 1 (pendiente), 2 (pagada), 3 (rechazada), 4 (anulada)
    if (paymentData.status !== 2) {
      console.log(`Pago de Flow con token ${token} no fue exitoso. Estado: ${paymentData.status}`);
      // Aunque no fue exitoso, respondemos 200 para que Flow no siga reintentando.
      return res.status(200).send('Pago no exitoso, notificación recibida.');
    }

    // 2. El pago fue exitoso, buscar usuario y plan
    const user = await User.findOne({ where: { email: paymentData.payer } });
    if (!user) {
      console.error(`Usuario con email ${paymentData.payer} no encontrado.`);
      return res.status(404).send('Usuario no encontrado');
    }

    // Extraer el nombre del plan del 'subject' del pago
    const planNameMatch = paymentData.subject.match(/Plan (.+)/);
    if (!planNameMatch || !planNameMatch[1]) {
      console.error(`No se pudo extraer el nombre del plan desde el subject: ${paymentData.subject}`);
      return res.status(400).send('Nombre del plan no encontrado en el subject.');
    }
    const planName = planNameMatch[1];
    const plan = await Plan.findOne({ where: { nombre: planName } });

    if (!plan) {
      console.error(`Plan con nombre ${planName} no encontrado.`);
      return res.status(404).send('Plan no encontrado');
    }

    // 3. Crear la suscripción
    const fecha_renovacion = calcularFechaRenovacion(plan.periodo);
    const newSubscription = await Subscription.create({
      usuario_id: user.id,
      plan_id: plan.id,
      metodo_pago: 'Flow',
      monto: paymentData.amount,
      moneda: paymentData.currency,
      estado: 'activa',
      fecha_renovacion,
      // El nombre del proyecto se debería obtener de otra forma, quizás del `optional` de Flow si se envía
    });

    console.log('Suscripción creada:', newSubscription.id);

    // 4. Crear el registro del pago
    await Payment.create({
      usuario_id: user.id,
      suscripcion_id: newSubscription.id,
      plan_id: plan.id,
      metodo: 'Flow',
      monto: paymentData.amount,
      moneda: paymentData.currency,
      estado: 'completado',
      comprobante: paymentData.flowOrder, // Guardar el ID de Flow como referencia
    });

    console.log('Registro de pago creado para la suscripción:', newSubscription.id);

    // 5. Responder a Flow que la notificación fue procesada correctamente
    res.status(200).send('Notificación de pago recibida y procesada exitosamente.');

  } catch (error) {
    console.error('Error procesando la confirmación de Flow:', error.response ? error.response.data : error.message);
    // Respondemos 500, Flow podría reintentar la notificación
    res.status(500).send('Error interno al procesar la notificación.');
  }
};

