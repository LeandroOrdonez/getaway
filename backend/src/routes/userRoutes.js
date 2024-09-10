// backend/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

router.get('/settings', authenticate, userController.getUserSettings);
router.put('/settings', authenticate, userController.updateUserSettings);
router.get('/comparisons', authenticate, userController.getUserComparisons);
router.get('/list', authenticate, authorizeAdmin, userController.listRegisteredUsers);

module.exports = router;