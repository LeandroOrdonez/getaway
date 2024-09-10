// backend/src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// Route to create a new accommodation
router.post('/create-accommodation', authenticate, authorizeAdmin, adminController.createAccommodation);

// Route to get all accommodations (for admin view)
router.get('/accommodations', authenticate, authorizeAdmin, adminController.getAllAccommodations);

// Route to update an accommodation
router.put('/accommodation/:id', authenticate, authorizeAdmin, adminController.updateAccommodation);

// Route to delete an accommodation
router.delete('/accommodation/:id', authenticate, authorizeAdmin, adminController.deleteAccommodation);

module.exports = router;