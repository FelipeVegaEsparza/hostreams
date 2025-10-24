const { sendConfirmationEmail } = require('../utils/emailService');

exports.handleContactRequest = async (req, res) => {
  const { nombre, email, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ msg: 'Por favor, completa todos los campos.' });
  }

  const recipientEmail = 'contacto@hostreams.com';
  const subject = `Nuevo Mensaje de Contacto de ${nombre}`;
  const textBody = `Has recibido un nuevo mensaje de contacto a través de tu sitio web.\n\nNombre: ${nombre}\nEmail: ${email}\nMensaje:\n${mensaje}`;
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #333;">Nuevo Mensaje de Contacto</h2>
      <p>Has recibido un nuevo mensaje a través del formulario de contacto de tu sitio web.</p>
      <hr>
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Mensaje:</strong></p>
      <p style="padding: 10px; border-left: 3px solid #eee;">${mensaje.replace(/\n/g, '<br>')}</p>
      <hr>
      <p style="font-size: 0.9em; color: #777;">Este es un mensaje automático enviado desde hostreams.com.</p>
    </div>
  `;

  try {
    await sendConfirmationEmail(recipientEmail, subject, textBody, htmlBody);
    res.status(200).json({ msg: 'Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos pronto.' });
  } catch (error) {
    console.error('Error al procesar la solicitud de contacto:', error);
    res.status(500).json({ msg: 'Error interno del servidor. No se pudo enviar tu mensaje.' });
  }
};