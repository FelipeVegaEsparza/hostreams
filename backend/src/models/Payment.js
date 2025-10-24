const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Subscription = require('./Subscription');
const Plan = require('./Plan'); // Importar el modelo Plan

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  suscripcion_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Permitir nulos para pagos manuales pendientes
    references: {
      model: Subscription,
      key: 'id',
    },
  },
  plan_id: { // Nuevo campo para asociar el pago a un plan
    type: DataTypes.INTEGER,
    allowNull: true, // Permitir nulos si el pago no está directamente ligado a un plan (ej. recargas)
    references: {
      model: Plan,
      key: 'id',
    },
  },
  metodo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  moneda: {
    type: DataTypes.ENUM('CLP', 'USD'),
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  comprobante: {
    type: DataTypes.STRING, // URL opcional del comprobante
    allowNull: true,
  },
  fecha_pago: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  nombre_proyecto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'pagos',
  timestamps: false,
});

// Definir asociaciones
User.hasMany(Payment, { foreignKey: 'usuario_id' });
Payment.belongsTo(User, { foreignKey: 'usuario_id' });

Subscription.hasMany(Payment, { foreignKey: 'suscripcion_id' });
Payment.belongsTo(Subscription, { foreignKey: 'suscripcion_id' });

// Asociación de Payment con Plan
Plan.hasMany(Payment, { foreignKey: 'plan_id' });
Payment.belongsTo(Plan, { foreignKey: 'plan_id' });

module.exports = Payment;
