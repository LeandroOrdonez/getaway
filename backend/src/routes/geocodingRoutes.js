const express = require('express');
const router = express.Router();
const geocodingController = require('../controllers/geocodingController');

router.get('/forward', geocodingController.forwardGeocode);
router.get('/reverse', geocodingController.reverseGeocode);

module.exports = router;