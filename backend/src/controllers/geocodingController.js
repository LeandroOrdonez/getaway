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
    const result = await mapboxService.reverseGeocode(lng, lat);
    if (result) {
      res.json({ features: [{ place_name: result }] });  // Wrap the result in a features array
    } else {
      res.status(404).json({ message: 'Address not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};