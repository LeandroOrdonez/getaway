import React, { useState } from 'react';
import { TextField, List, ListItem, ListItemText } from '@mui/material';
import { forwardGeocode } from '../services/api';

const LocationInput = ({ onLocationSelect }) => {
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleAddressChange = async (event) => {
    const value = event.target.value;
    setAddress(value);

    if (value.length > 2) {
      try {
        const response = await forwardGeocode(value);
        // Ensure we're working with an array of features
        // console.log(JSON.stringify(response));
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
    onLocationSelect(suggestion);
  };

  return (
    <div>
      <TextField
        fullWidth
        label="Enter location"
        value={address}
        onChange={handleAddressChange}
      />
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