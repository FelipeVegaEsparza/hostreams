const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Plan = sequelize.define('Plan', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  precio_clp: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  precio_usd: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  periodo: {
    type: DataTypes.ENUM('mensual', 'anual'),
    allowNull: false,
    defaultValue: 'mensual',
  },
  caracteristicas: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo'),
    allowNull: false,
    defaultValue: 'activo',
  },
  categoria: {
    type: DataTypes.ENUM('Radio', 'TV'),
    allowNull: false,
  },
  example_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'planes',
  timestamps: false,
});

module.exports = Plan;