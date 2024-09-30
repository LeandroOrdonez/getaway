//backend/src/controllers/userController.js
const User = require('../models/user');
const Comparison = require('../models/comparison');
const Accommodation = require('../models/accommodation');
const sequelize = require('../config/database');

exports.getUserSettings = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['username', 'email']
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUserSettings = async (req, res) => {
  try {
    const [updated] = await User.update(req.body, {
      where: { id: req.user.id }
    });
    if (updated) {
      const updatedUser = await User.findByPk(req.user.id, {
        attributes: ['username', 'email']
      });
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserComparisons = async (req, res) => {
  try {
    const comparisons = await Comparison.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Accommodation, as: 'winnerAccommodation' },
        { model: Accommodation, as: 'loserAccommodation' }
      ]
    });
    res.json(comparisons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listRegisteredUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { isAdmin: false },
      attributes: ['id', 'username', 'email', 'uniqueUrl']
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listRegisteredUsersWithComparisonCount = async (req, res) => {
  try {
    const [users, metadata] = await sequelize.query(`
      SELECT 
        u.id, 
        u.username, 
        u.email, 
        u."uniqueUrl",
        COUNT(c.id) as "comparisonCount"
      FROM 
        "Users" u
      LEFT JOIN 
        "Comparisons" c ON u.id = c."userId"
      WHERE 
        u."isAdmin" = false
      GROUP BY 
        u.id
      ORDER BY 
        u.username
    `);

    res.json(users);
  } catch (error) {
    console.error('Error in listRegisteredUsersWithComparisonCount:', error);
    res.status(500).json({ error: error.message });
  }
};