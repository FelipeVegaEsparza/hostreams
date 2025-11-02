const nodemailer = require('nodemailer');
const EmailLog = require('../models/EmailLog'); // Importar el modelo de log

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendConfirmationEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: `"Hostreams" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo enviado a:', to);
    // Registrar el éxito en la base de datos
    await EmailLog.create({
      recipient: to,
      subject,
      status: 'sent',
    });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    // Registrar el fallo en la base de datos
    await EmailLog.create({
      recipient: to,
      subject,
      status: 'failed',
      error_message: error.message,
    });
    // Opcional: relanzar el error si quieres que el llamador lo maneje
    // throw error;
  }
};
