// backend/src/controllers/authController.js
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Only admins can register new users' });
    }
    const user = await User.create({ username, email, password });
    res.status(201).json({ message: 'User created successfully', uniqueUrl: user.uniqueUrl });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user.id, type: user.isAdmin ? 'admin' : 'registered_user', isAdmin: user.isAdmin, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({ token, userType: user.isAdmin ? 'admin' : 'registered_user' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.autoLogin = async (req, res) => {
  try {
    const { uniqueUrl } = req.params;
    const user = await User.findOne({ where: { uniqueUrl } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const token = jwt.sign(
      { id: user.id, type: 'registered_user', isAdmin: user.isAdmin, username: user.username, email: user.email  },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({ token, userType: 'registered_user' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};