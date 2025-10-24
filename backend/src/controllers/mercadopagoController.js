const { MercadoPagoConfig, Preference } = require('mercadopago'); // Importar MercadoPagoConfig y Preference
const { MERCADOPAGO_ACCESS_TOKEN } = process.env;

// Configurar MercadoPago
const client = new MercadoPagoConfig({ accessToken: MERCADOPAGO_ACCESS_TOKEN });

exports.createPreference = async (req, res) => {
  const { planId, title, unit_price, quantity, currency_id } = req.body; // planId para asociar la suscripción

  try {
    const preference = new Preference(client); // Crear una instancia de Preference con el cliente configurado

    let preferenceBody = {
      items: [
        {
          title: title,
          unit_price: parseFloat(unit_price),
          quantity: parseInt(quantity),
          currency_id: currency_id,
        },
      ],
      back_urls: {
        success: 'http://localhost:3001/payment-success', // URL de éxito en el frontend
        failure: 'http://localhost:3001/payment-cancel', // URL de fallo en el frontend
        pending: 'http://localhost:3001/payment-pending', // URL de pendiente en el frontend
      },
      auto_return: 'approved',
      external_reference: planId, // Puedes usar esto para identificar el plan o la suscripción
    };

    const response = await preference.create({ body: preferenceBody }); // Usar la instancia de Preference
    res.json({ id: response.id, init_point: response.init_point }); // Ajustar la respuesta
  } catch (error) {
    console.error('Failed to create preference:', error.message);
    res.status(500).json({ error: 'Failed to create preference' });
  }
};