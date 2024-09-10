// backend/src/routes/geocodingRoutes.js
const express = require('express');
const router = express.Router();
const geocodingController = require('../controllers/geocodingController');
const { authenticate } = require('../middleware/auth');

router.get('/forward', geocodingController.forwardGeocode);
router.get('/reverse', geocodingController.reverseGeocode);
router.get('/driving-distance', authenticate, geocodingController.calculateDrivingDistance);

module.exports = router;