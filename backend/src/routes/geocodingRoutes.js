const express = require('express');
const router = express.Router();
const geocodingController = require('../controllers/geocodingController');
const { authenticate } = require('../middleware/auth');

router.get('/forward', authenticate, geocodingController.forwardGeocode);
router.get('/reverse', authenticate, geocodingController.reverseGeocode);
router.get('/driving-distance', authenticate, geocodingController.calculateDrivingDistance);

module.exports = router;