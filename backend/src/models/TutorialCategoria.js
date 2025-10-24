const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TutorialCategoria = sequelize.define('TutorialCategoria', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'tutorial_categorias',
  timestamps: false,
});

module.exports = TutorialCategoria;
