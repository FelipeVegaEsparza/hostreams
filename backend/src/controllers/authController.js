const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Subscription = require('../models/Subscription'); // Importar Subscription
const Plan = require('../models/Plan'); // Importar Plan
const Payment = require('../models/Payment'); // Importar Payment
const emailService = require('../utils/emailService'); // Importar el servicio de correo

exports.register = async (req, res) => {
  const { nombre, email, contrasena, pais, moneda_preferida, rol } = req.body;

  try {
    // Verificar si el usuario ya existe
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);

    // Crear nuevo usuario
    user = await User.create({
      nombre,
      email,
      contrasena: hashedPassword,
      pais,
      moneda_preferida,
      rol: rol || 'cliente', // Por defecto 'cliente'
    });

    // Generar JWT
    const payload = {
      user: {
        id: user.id,
        rol: user.rol,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        // Excluir la contraseña del objeto de usuario antes de enviarlo
        const userResponse = user.toJSON();
        delete userResponse.contrasena;

        res.json({ token, user: userResponse });
      }
    );

    // Enviar correo de confirmación
    await emailService.sendConfirmationEmail(
      email,
      'Bienvenido a Hostreams - Confirmación de Registro',
      `Hola ${nombre},

Gracias por registrarte en Hostreams. Tu cuenta ha sido creada exitosamente.`, // Corrected newline escape
      `<p>Hola <strong>${nombre}</strong>,</p><p>Gracias por registrarte en Hostreams. Tu cuenta ha sido creada exitosamente.</p><p>¡Esperamos que disfrutes de nuestros servicios!</p>`
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};

exports.login = async (req, res) => {
  const { email, contrasena } = req.body;

  try {
    // Verificar si el usuario existe
    let user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    // Comparar contraseña
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    // Generar JWT
    const payload = {
      user: {
        id: user.id,
        rol: user.rol,
      },
    };

    // console.log('JWT_SECRET:', process.env.JWT_SECRET); // Eliminar este log

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) {
          console.error('Error al firmar JWT:', err);
          return res.status(500).send('Error del servidor al generar token');
        }
        // Excluir la contraseña del objeto de usuario antes de enviarlo
        const userResponse = user.toJSON();
        delete userResponse.contrasena;

        res.json({ token, user: userResponse });
      }
    );

  } catch (err) {
    console.error('Error en la función de login:', err.message);
    res.status(500).send('Error del servidor');
  }
};

exports.getMe = async (req, res) => {
  try {
    console.log('getMe Controller: Buscando usuario con payload:', req.user);
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['contrasena'] },
      include: [
        { model: Subscription, include: [{ model: Plan }] },
        { model: Payment },
      ],
    });

    if (!user) {
      console.error('getMe Controller: Usuario no encontrado en la BD con id:', req.user.id);
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    console.log('getMe Controller: Usuario encontrado, enviando datos.');
    res.json(user);
  } catch (err) {
    console.error('getMe Controller: Error al buscar usuario:', err.message);
    res.status(500).send('Error del servidor');
  }
};
