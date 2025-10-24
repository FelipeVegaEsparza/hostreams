const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const TutorialCategoria = require('./TutorialCategoria');

const Tutorial = sequelize.define('Tutorial', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  video_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoria_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: TutorialCategoria,
      key: 'id',
    },
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'tutoriales',
  timestamps: false,
});

TutorialCategoria.hasMany(Tutorial, { foreignKey: 'categoria_id' });
Tutorial.belongsTo(TutorialCategoria, { foreignKey: 'categoria_id' });

module.exports = Tutorial;
