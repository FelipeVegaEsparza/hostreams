const axios = require('axios');
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_API_BASE, FRONTEND_BASE_URL } = process.env;

// Función para generar un token de acceso de PayPal
const generateAccessToken = async () => {
  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    const response = await axios.post(
      `${PAYPAL_API_BASE}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Failed to generate Access Token:', error.response ? error.response.data : error.message);
    throw new Error('Failed to generate Access Token');
  }
};

// Función para crear una orden de PayPal
exports.createOrder = async (req, res) => {
  const { planId, amount, currency } = req.body; // planId para asociar la suscripción

  try {
    const accessToken = await generateAccessToken();
    const response = await axios.post(
      `${PAYPAL_API_BASE}/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount,
            },
          },
        ],
        application_context: {
          return_url: `${FRONTEND_BASE_URL}/payment-success`, // URL de éxito en el frontend
          cancel_url: `${FRONTEND_BASE_URL}/payment-cancel`, // URL de cancelación en el frontend
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Failed to create order:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// Función para capturar un pago de PayPal
exports.captureOrder = async (req, res) => {
  const { orderID } = req.body;

  try {
    const accessToken = await generateAccessToken();
    const response = await axios.post(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Failed to capture order:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to capture order' });
  }
};
