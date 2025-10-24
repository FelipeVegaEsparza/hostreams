const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Ticket = require('./Ticket');

const TicketMensaje = sequelize.define('TicketMensaje', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ticket_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Ticket,
      key: 'id',
    },
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fecha_envio: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'ticket_mensajes',
  timestamps: false,
});

Ticket.hasMany(TicketMensaje, { foreignKey: 'ticket_id' });
TicketMensaje.belongsTo(Ticket, { foreignKey: 'ticket_id' });

User.hasMany(TicketMensaje, { foreignKey: 'usuario_id' });
TicketMensaje.belongsTo(User, { foreignKey: 'usuario_id' });

module.exports = TicketMensaje;
