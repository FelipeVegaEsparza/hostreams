const EmailLog = require('../models/EmailLog');
const { Op } = require('sequelize');

// Obtener todos los registros de correos (solo admin)
exports.getEmailLogs = async (req, res) => {
  try {
    const logs = await EmailLog.findAll({
      order: [['sent_at', 'DESC']], // Ordenar por más reciente
    });
    res.json(logs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};
