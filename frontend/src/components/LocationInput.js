// src/components/LocationInput.js
import React, { useState, useEffect, useContext } from 'react';
import { TextField, List, ListItem, ListItemText, Button, CircularProgress } from '@mui/material';
import { forwardGeocode, reverseGeocode } from '../services/api';
import { LocationContext } from '../contexts/LocationContext';

const LocationInput = () => {
  const { location, setLocation } = useContext(LocationContext);
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const detectLocation = async () => {
    setIsLoading(true);
    if ("geolocation" in navigator) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        const { latitude, longitude } = position.coords;
        const response = await reverseGeocode(longitude, latitude);
        if (response.data && response.data.features && response.data.features.length > 0) {
          const detectedAddress = response.data.features[0].place_name;
          setAddress(detectedAddress);
          setLocation({
            center: [longitude, latitude],
            place_name: detectedAddress
          });
        }
      } catch (error) {
        console.error('Error detecting location:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.error('Geolocation is not supported by this browser.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (location && location.place_name) {
      setAddress(location.place_name);
    } else {
      detectLocation();
    }
  }, [location]);

  const handleAddressChange = async (event) => {
    const value = event.target.value;
    setAddress(value);

    if (value.length > 2) {
      try {
        const response = await forwardGeocode(value);
        const features = response.data.features || [];
        setSuggestions(features);
      } catch (error) {
        console.error('Error fetching geocoding suggestions:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setAddress(suggestion.place_name);
    setSuggestions([]);
    setLocation({
      center: suggestion.center,
      place_name: suggestion.place_name
    });
  };

  return (
    <div>
      <TextField
        fullWidth
        label="Enter location"
        value={address}
        onChange={handleAddressChange}
        disabled={isLoading}
      />
      <Button onClick={detectLocation} disabled={isLoading}>
        {isLoading ? <CircularProgress size={24} /> : 'Detect My Location'}
      </Button>
      <List>
        {suggestions.map((suggestion, index) => (
          <ListItem 
            button 
            key={index} 
            onClick={() => handleSuggestionSelect(suggestion)}
          >
            <ListItemText primary={suggestion.place_name} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default LocationInput;