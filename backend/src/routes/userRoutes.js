const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

router.get('/settings', authenticate, userController.getUserSettings);
router.put('/settings', authenticate, userController.updateUserSettings);
router.get('/comparisons', authenticate, userController.getUserComparisons);

module.exports = router;