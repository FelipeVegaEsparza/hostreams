const { check, validationResult } = require('express-validator');

exports.validateRegister = [
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('email', 'Por favor, incluye un email válido').isEmail(),
  check('contrasena', 'La contraseña debe tener 6 o más caracteres').isLength({ min: 6 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.validateLogin = [
  check('email', 'Por favor, incluye un email válido').isEmail(),
  check('contrasena', 'La contraseña es obligatoria').exists(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
