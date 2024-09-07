const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mbxDirections = require('@mapbox/mapbox-sdk/services/directions');
const DistanceCache = require('../models/distanceCache');

const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_ACCESS_TOKEN });
const directionsClient = mbxDirections({ accessToken: process.env.MAPBOX_ACCESS_TOKEN });

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

exports.calculateDrivingDistance = async (fromAddress, toAddress) => {
  try {
    // Check cache first
    const cachedResult = await DistanceCache.findOne({
      where: { fromAddress, toAddress }
    });

    if (cachedResult) {
      return {
        distance: cachedResult.distance,
        duration: cachedResult.duration
      };
    }

    // If not in cache, calculate using Mapbox
    const fromCoords = await exports.forwardGeocode(fromAddress);
    const toCoords = await exports.forwardGeocode(toAddress);

    fromCoords.lng = fromCoords.features[0].center[0];
    fromCoords.lat = fromCoords.features[0].center[1];
    toCoords.lng = toCoords.features[0].center[0];
    toCoords.lat = toCoords.features[0].center[1];

    console.log('From coordinates:', fromCoords);
    console.log('To coordinates:', toCoords);

    if (!fromCoords || !toCoords || !fromCoords.lng || !fromCoords.lat || !toCoords.lng || !toCoords.lat) {
      throw new Error('Invalid coordinates');
    }

    const response = await directionsClient.getDirections({
      profile: 'driving',
      waypoints: [
        { coordinates: [fromCoords.lng, fromCoords.lat] },
        { coordinates: [toCoords.lng, toCoords.lat] }
      ]
    }).send();

    if (response.body.routes.length > 0) {
      const route = response.body.routes[0];
      const distance = route.distance / 1000; // Convert to km
      const duration = route.duration / 60; // Convert to minutes

      // Cache the result
      await DistanceCache.create({
        fromAddress,
        toAddress,
        distance,
        duration
      });

      return { distance, duration };
    }

    throw new Error('No route found');
  } catch (error) {
    console.error('Error calculating driving distance:', error);
    console.error('From address:', fromAddress);
    console.error('To address:', toAddress);
    throw error;
  }
};