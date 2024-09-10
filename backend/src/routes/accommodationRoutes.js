// backend/src/routes/accommodationRoutes.js
const express = require('express');
const router = express.Router();
const accommodationController = require('../controllers/accommodationController');
const { authenticate } = require('../middleware/auth');

router.post('/', accommodationController.createAccommodation);
router.get('/', accommodationController.getAllAccommodations);
router.get('/:id', accommodationController.getAccommodation);
router.put('/:id', accommodationController.updateAccommodation);
router.delete('/:id', accommodationController.deleteAccommodation);
router.post('/calculate-distance', authenticate, accommodationController.calculateDrivingDistance);

module.exports = router;