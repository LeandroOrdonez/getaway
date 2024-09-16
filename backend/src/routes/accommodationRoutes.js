// backend/src/routes/accommodationRoutes.js
const express = require('express');
const router = express.Router();
const accommodationController = require('../controllers/accommodationController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', authenticate, authorizeAdmin, upload.array('images', 5), accommodationController.createAccommodation);
router.get('/', accommodationController.getAllAccommodations);
router.get('/:id', accommodationController.getAccommodation);
router.put('/:id', authenticate, authorizeAdmin, upload.array('images', 5), accommodationController.updateAccommodation);
router.delete('/:id', authenticate, authorizeAdmin, accommodationController.deleteAccommodation);

module.exports = router;