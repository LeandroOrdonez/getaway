// backend/src/models/distanceCache.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DistanceCache = sequelize.define('DistanceCache', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fromAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  toAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  distance: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  duration: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = DistanceCache;