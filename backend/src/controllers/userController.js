const User = require('../models/user');

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