const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  contrasena: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pais: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  moneda_preferida: {
    type: DataTypes.ENUM('CLP', 'USD'),
    allowNull: false,
    defaultValue: 'CLP',
  },
  rol: {
    type: DataTypes.ENUM('cliente', 'admin'),
    allowNull: false,
    defaultValue: 'cliente',
  },
  fecha_registro: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'usuarios',
  timestamps: false,
});

module.exports = User;
