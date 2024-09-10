// backend/src/controllers/geocodingController.js
const mapboxService = require('../services/mapboxService');

exports.forwardGeocode = async (req, res) => {
  try {
    const { address } = req.query;
    const result = await mapboxService.forwardGeocode(address);
    if (result && result.features && result.features.length > 0) {
      res.json(result);  // Return the entire result object
    } else {
      res.status(404).json({ message: 'Location not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.reverseGeocode = async (req, res) => {
  try {
    const { lng, lat } = req.query;
    const parsedLng = parseFloat(lng);
    const parsedLat = parseFloat(lat);

    if (isNaN(parsedLng) || isNaN(parsedLat)) {
      return res.status(400).json({ message: 'Invalid longitude or latitude' });
    }

    const result = await mapboxService.reverseGeocode(parsedLng, parsedLat);
    if (result) {
      res.json({ features: [{ place_name: result }] });  // Wrap the result in a features array
    } else {
      res.status(404).json({ message: 'Address not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.calculateDrivingDistance = async (req, res) => {
  try {
    const { from, to } = req.query;
    const result = await mapboxService.calculateDrivingDistance(from, to);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};