const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Accommodation = require('./accommodation');

const Comparison = sequelize.define('Comparison', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userType: {
    type: DataTypes.ENUM('admin', 'registered_user', 'guest'),
    allowNull: false,
  },
  winnerAccommodationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Accommodation,
      key: 'id',
    },
  },
  loserAccommodationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Accommodation,
      key: 'id',
    },
  },
});

module.exports = Comparison;