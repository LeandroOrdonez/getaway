const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Accommodation = sequelize.define('Accommodation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pricePerNight: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  numRooms: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: false,
    validate: {
      min: 0,
      max: 5
    }
  },
  eloScore: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 1500 // Starting ELO score
  },
  facilities: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
  },
  imageUrls: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
  },
  originalListingUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Accommodation;