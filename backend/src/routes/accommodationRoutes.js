// backend/src/routes/accommodationRoutes.js
const express = require('express');
const router = express.Router();
const accommodationController = require('../controllers/accommodationController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const { upload, handleUploadErrors } = require('../middleware/upload');

router.post('/', 
  authenticate, 
  authorizeAdmin, 
  upload.array('images', 20), 
  handleUploadErrors,
  accommodationController.createAccommodation
);

router.put('/:id', 
  authenticate, 
  authorizeAdmin, 
  upload.array('images', 20), 
  handleUploadErrors,
  accommodationController.updateAccommodation
);

// The rest of your routes remain the same
router.get('/', accommodationController.getAllAccommodations);
router.get('/:id', accommodationController.getAccommodation);
router.delete('/:id', authenticate, authorizeAdmin, accommodationController.deleteAccommodation);

module.exports = router;