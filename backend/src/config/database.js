const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('hostreams_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // Desactiva el log de SQL en consola
});

module.exports = sequelize;
