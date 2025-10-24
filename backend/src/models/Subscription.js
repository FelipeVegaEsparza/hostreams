const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Plan = require('./Plan');

const Subscription = sequelize.define('Subscription', {
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
  plan_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Plan,
      key: 'id',
    },
  },
  metodo_pago: {
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
    type: DataTypes.ENUM('activa', 'cancelada', 'pendiente'),
    allowNull: false,
    defaultValue: 'pendiente',
  },
  fecha_inicio: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  fecha_renovacion: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  nombre_proyecto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'suscripciones',
  timestamps: false,
});

// Definir asociaciones
User.hasMany(Subscription, { foreignKey: 'usuario_id' });
Subscription.belongsTo(User, { foreignKey: 'usuario_id' });

Plan.hasMany(Subscription, { foreignKey: 'plan_id' });
Subscription.belongsTo(Plan, { foreignKey: 'plan_id' });

module.exports = Subscription;
