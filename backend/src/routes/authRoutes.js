// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

router.post('/register', authenticate, authorizeAdmin, authController.register);
router.post('/login', authController.login);
router.get('/auto-login/:uniqueUrl', authController.autoLogin);

module.exports = router;