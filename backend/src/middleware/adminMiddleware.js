module.exports = function (req, res, next) {
  // Verificar si el usuario está autenticado y tiene rol de admin
  if (!req.user || req.user.rol !== 'admin') {
    return res.status(403).json({ msg: 'Acceso denegado: Se requiere rol de administrador' });
  }
  next();
};
