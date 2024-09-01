const express = require('express');
const router = express.Router();
const comparisonController = require('../controllers/comparisonController');
const { authenticate } = require('../middleware/auth');

router.get('/random-pair', authenticate, comparisonController.getRandomPair);
router.post('/submit', authenticate, comparisonController.submitComparison);
router.get('/rankings', comparisonController.getRankings);

module.exports = router;