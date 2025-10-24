const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Ticket = sequelize.define('Ticket', {
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
  asunto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('Abierto', 'En Progreso', 'Cerrado'),
    allowNull: false,
    defaultValue: 'Abierto',
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'tickets',
  timestamps: false,
});

User.hasMany(Ticket, { foreignKey: 'usuario_id' });
Ticket.belongsTo(User, { foreignKey: 'usuario_id' });

module.exports = Ticket;
