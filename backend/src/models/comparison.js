// backend/src/models/comparison.js
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
    type: DataTypes.UUID,
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

// Define associations
Comparison.belongsTo(Accommodation, { as: 'winnerAccommodation', foreignKey: 'winnerAccommodationId' });
Comparison.belongsTo(Accommodation, { as: 'loserAccommodation', foreignKey: 'loserAccommodationId' });

module.exports = Comparison;