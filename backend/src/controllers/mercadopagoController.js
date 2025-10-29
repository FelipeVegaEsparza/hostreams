const mercadopago = require('mercadopago');
const { MERCADOPAGO_ACCESS_TOKEN } = process.env;

mercadopago.configure({
  access_token: MERCADOPAGO_ACCESS_TOKEN,
});

exports.createPreference = async (req, res) => {
  const { planId, amount, email, subject, quantity = 1 } = req.body;

  try {
    const preference = {
      items: [
        {
          title: subject || `Suscripción Hostreams - Plan ${planId}`,
          unit_price: Number(amount),
          quantity: Number(quantity),
        },
      ],
      back_urls: {
        success: "https://hostreams-frontend.0ieu13.easypanel.host/payment-success", // URL de éxito en el frontend
        failure: "https://hostreams-frontend.0ieu13.easypanel.host/payment-cancel", // URL de fallo en el frontend
        pending: "https://hostreams-frontend.0ieu13.easypanel.host/payment-pending", // URL pendiente en el frontend
      },
      auto_return: "approved",
      external_reference: `planId-${planId}-user-${email}-${Date.now()}`, // Referencia externa para identificar la transacción
      notification_url: "https://hostreams-hostreams.0ieu13.easypanel.host/api/mercadopago/webhook", // URL para notificaciones de MercadoPago
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({
      id: response.body.id,
      init_point: response.body.init_point,
    });
  } catch (error) {
    console.error('Error al crear preferencia de MercadoPago:', error);
    res.status(500).json({ error: 'Error al crear preferencia de MercadoPago' });
  }
};

exports.receiveWebhook = async (req, res) => {
  const { query } = req;
  const topic = query.topic || query.type; // 'payment' o 'merchant_order'

  try {
    if (topic === 'payment') {
      const paymentId = query.id || query['data.id'];
      const payment = await mercadopago.payment.findById(paymentId);
      // Aquí puedes actualizar el estado de tu suscripción o pago en tu base de datos
      console.log('MercadoPago Payment:', payment.body);
    } else if (topic === 'merchant_order') {
      const merchantOrderId = query.id || query['data.id'];
      const merchantOrder = await mercadopago.merchant_orders.findById(merchantOrderId);
      console.log('MercadoPago Merchant Order:', merchantOrder.body);
    }

    res.status(200).send('Webhook recibido');
  } catch (error) {
    console.error('Error al procesar webhook de MercadoPago:', error);
    res.status(500).json({ error: 'Error al procesar webhook de MercadoPago' });
  }
};
