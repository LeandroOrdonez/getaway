const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Guest = require('../models/guest');

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    console.log(JSON.stringify(decoded));
    
    if (decoded.type === 'registered_user' || decoded.type === 'admin') {
      const user = await User.findByPk(decoded.id);
      if (!user) {
        throw new Error();
      }
      req.user = user;
      req.userType = user.isAdmin ? 'admin' : 'registered_user';
    } else if (decoded.type === 'guest') {
      const guest = await Guest.findByPk(decoded.id);
      if (!guest) {
        throw new Error();
      }
      req.user = guest;
      req.userType = 'guest';
    } else {
      throw new Error();
    }
    req.token = token;
    next();
  } catch (error) {
    console.log(JSON.stringify(error));
    res.status(401).json({ error: 'Please authenticate' });
  }
};

exports.authorizeAdmin = (req, res, next) => {
  if (req.userType !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};