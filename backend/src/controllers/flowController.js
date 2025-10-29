const axios = require('axios');
const crypto = require('crypto');
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
  const { planId, amount, email, subject } = req.body; // planId para asociar la suscripción

  try {
    const params = {
      apiKey: FLOW_API_KEY,
      commerceOrder: `ORDER-${Date.now()}`, // Generar un número de orden único
      subject: subject || `Pago de suscripción Hostreams - Plan ${planId}`,
      currency: 'CLP',
      amount: Math.floor(parseFloat(amount)), // Ensure amount is an integer
      email: email,
      urlReturn: FLOW_SUCCESS_URL, // Flow.cl expects a single return URL
      urlConfirmation: FLOW_CONFIRMATION_URL, // URL para que Flow.cl notifique al backend
    };

    console.log('Flow.cl API Request Params:', params); // Log the parameters

    params.s = generateFlowSign(params, FLOW_SECRET_KEY);

    const encodedParams = new URLSearchParams(params).toString();

    const response = await axios.post(`${FLOW_API_URL}/payment/create`, encodedParams, {
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

exports.getPaymentStatus = async (req, res) => {
  const { token } = req.body; // Token de Flow.cl

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
