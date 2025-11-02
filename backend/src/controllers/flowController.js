const axios = require('axios');
const crypto = require('crypto');
const querystring = require('querystring');
const { Op } = require('sequelize');
const { FLOW_API_KEY, FLOW_SECRET_KEY, FLOW_API_URL, FLOW_SUCCESS_URL, FLOW_FAILURE_URL, FLOW_CONFIRMATION_URL } = process.env;

// Importar modelos
const User = require('../models/User');
const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');
const Payment = require('../models/Payment');

// --- Funciones Auxiliares ---

const generateFlowSign = (params, secretKey) => {
  const sortedKeys = Object.keys(params).sort();
  let stringToSign = '';
  sortedKeys.forEach(key => {
    stringToSign += key + params[key];
  });
  return crypto.createHmac('sha256', secretKey).update(stringToSign).digest('hex');
};

const calcularFechaRenovacion = (periodo) => {
  const fecha = new Date();
  if (periodo === 'mensual') {
    fecha.setMonth(fecha.getMonth() + 1);
  } else if (periodo === 'anual') {
    fecha.setFullYear(fecha.getFullYear() + 1);
  }
  return fecha;
};

// --- Definición de Controladores ---

const createPayment = async (req, res) => {
  const { planId, amount, email, subject, currency } = req.body;

  try {
    const params = {
      apiKey: FLOW_API_KEY,
      commerceOrder: `ORDER-${Date.now()}`,
      subject: subject || `Pago de suscripción Hostreams - Plan ${planId}`,
      currency: currency,
      amount: Math.floor(parseFloat(amount)),
      email: email,
      urlReturn: FLOW_SUCCESS_URL,
      urlConfirmation: FLOW_CONFIRMATION_URL,
    };

    console.log('Flow.cl API Request Params:', params);

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

const getPaymentStatus = async (req, res) => {
  const { token } = req.body;

  try {
    const params = {
      apiKey: FLOW_API_KEY,
      token: token,
    };

    params.s = generateFlowSign(params, FLOW_SECRET_KEY);

    const response = await axios.post(`${FLOW_API_URL}/payment/getStatus`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Failed to get Flow payment status:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to get Flow payment status' });
  }
};

const confirmPayment = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    console.log('Confirmación de Flow recibida sin token.');
    return res.status(400).send('Token no proporcionado');
  }

  console.log(`Token de confirmación de Flow recibido: ${token}`);

  try {
    const params = { apiKey: FLOW_API_KEY, token };
    params.s = generateFlowSign(params, FLOW_SECRET_KEY);

    const statusResponse = await axios.get(`${FLOW_API_URL}/payment/getStatus`, { params });
    const paymentData = statusResponse.data;

    console.log('Respuesta de /payment/getStatus:', paymentData);

    if (paymentData.status !== 2) {
      console.log(`Pago de Flow con token ${token} no fue exitoso. Estado: ${paymentData.status}`);
      return res.status(200).send('Pago no exitoso, notificación recibida.');
    }

    const user = await User.findOne({ where: { email: paymentData.payer } });
    if (!user) {
      console.error(`Usuario con email ${paymentData.payer} no encontrado.`);
      return res.status(404).send('Usuario no encontrado');
    }

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

    const fecha_renovacion = calcularFechaRenovacion(plan.periodo);
    const newSubscription = await Subscription.create({
      usuario_id: user.id,
      plan_id: plan.id,
      metodo_pago: 'Flow',
      monto: paymentData.amount,
      moneda: paymentData.currency,
      estado: 'activa',
      fecha_renovacion,
    });

    console.log('Suscripción creada:', newSubscription.id);

    await Payment.create({
      usuario_id: user.id,
      suscripcion_id: newSubscription.id,
      plan_id: plan.id,
      metodo: 'Flow',
      monto: paymentData.amount,
      moneda: paymentData.currency,
      estado: 'completado',
      comprobante: paymentData.flowOrder.toString(),
    });

    console.log('Registro de pago creado para la suscripción:', newSubscription.id);

    res.status(200).send('Notificación de pago recibida y procesada exitosamente.');

  } catch (error) {
    console.error('Error procesando la confirmación de Flow:', error.response ? error.response.data : error.message);
    res.status(500).send('Error interno al procesar la notificación.');
  }
};

// --- Exportación del Módulo ---
module.exports = {
  createPayment,
  getPaymentStatus,
  confirmPayment,
};
