const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Obtener el token del header Authorization
  const authHeader = req.header('Authorization');

  // Verificar si no hay encabezado Authorization o no tiene el formato Bearer
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No hay token, autorización denegada' });
  }

  // Extraer el token
  const token = authHeader.split(' ')[1];

  // Verificar token
  try {
    console.log('DEBUG: JWT_SECRET in authMiddleware:', process.env.JWT_SECRET); // TEMPORARY DEBUG LOG
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Error al verificar token en authMiddleware:', err.message);
    res.status(401).json({ msg: 'Token no válido' });
  }
};
