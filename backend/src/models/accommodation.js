// backend/src/models/accommodation.js
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
    get() {
      const rawValue = this.getDataValue('facilities');
      return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
    },
    set(value) {
      this.setDataValue('facilities', Array.isArray(value) ? value : JSON.parse(value));
    }
  },
  imageUrls: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
    get() {
      const rawValue = this.getDataValue('imageUrls');
      const baseUrl = process.env.SERVER_URL || 'http://localhost:3000';
      return rawValue.map(path => `${baseUrl}${path}`);
    },
    set(value) {
      // Remove base URL if present
      const cleanedPaths = value.map(url => url.replace(/^https?:\/\/[^\/]+/, ''));
      this.setDataValue('imageUrls', cleanedPaths);
    }
  },
  originalListingUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Accommodation;