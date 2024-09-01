const User = require('../models/user');
const Guest = require('../models/guest');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    const token = jwt.sign(
      { id: user.id, type: 'registered_user', isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.status(201).json({ token, userType: user.isAdmin ? 'admin' : 'registered_user' });
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
      { id: user.id, type: user.isAdmin ? 'admin' : 'registered_user', isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({ token, userType: user.isAdmin ? 'admin' : 'registered_user' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.guestSession = async (req, res) => {
  try {
    const { name } = req.body;
    const guest = await Guest.create({ name });
    const token = jwt.sign({ id: guest.id, type: 'guest' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, userType: 'guest' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};