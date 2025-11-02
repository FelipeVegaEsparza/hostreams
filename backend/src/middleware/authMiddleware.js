const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');
  console.log('Auth Middleware: Cabecera de autorización recibida:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Auth Middleware: Error - No hay token o el formato no es Bearer.');
    return res.status(401).json({ msg: 'No hay token, autorización denegada' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Auth Middleware: Token extraído:', token);

  if (!process.env.JWT_SECRET) {
    console.error('Auth Middleware: Error Crítico - JWT_SECRET no está definido en las variables de entorno.');
    return res.status(500).json({ msg: 'Error de configuración del servidor.' });
  }
  // console.log('Auth Middleware: Usando JWT_SECRET:', process.env.JWT_SECRET); // Descomentar solo para debugging extremo

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth Middleware: Token verificado exitosamente. Payload decodificado:', decoded);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Auth Middleware: Error al verificar token:', err.message);
    res.status(401).json({ msg: 'Token no válido' });
  }
};
