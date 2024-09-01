const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_ACCESS_TOKEN });

exports.forwardGeocode = async (address) => {
  try {
    const response = await geocodingClient
      .forwardGeocode({
        query: address,
        limit: 3  // Increased limit for more suggestions
      })
      .send();

    return response.body;  // Return the entire response body
  } catch (error) {
    console.error('Mapbox forward geocoding error:', error);
    throw error;
  }
};

exports.reverseGeocode = async (lng, lat) => {
  try {
    const response = await geocodingClient
      .reverseGeocode({
        query: [lng, lat],
        limit: 1
      })
      .send();

    if (response.body.features.length > 0) {
      return response.body.features[0].place_name;
    }
    return null;
  } catch (error) {
    console.error('Mapbox reverse geocoding error:', error);
    throw error;
  }
};