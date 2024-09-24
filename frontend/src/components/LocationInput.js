// frontend/src/components/LocationInput.js
import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, Flex, Text, ScrollArea } from '@radix-ui/themes';
import { MagnifyingGlassIcon, GlobeIcon } from '@radix-ui/react-icons';
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
    <Flex direction="column" gap="3">
      <TextField.Root>
        <TextField.Slot>
          <MagnifyingGlassIcon height="16" width="16" />
        </TextField.Slot>
        <TextField.Input 
          placeholder="Enter location" 
          value={address}
          onChange={handleAddressChange}
          disabled={isLoading}
        />
      </TextField.Root>
      <Button size='3' onClick={detectLocation} disabled={isLoading}>
        <GlobeIcon />
        {isLoading ? 'Detecting...' : 'Detect My Location'}
      </Button>
      {suggestions.length > 0 && (
        <ScrollArea style={{ maxHeight: '200px' }}>
          <Flex direction="column" gap="1">
            {suggestions.map((suggestion, index) => (
              <Button 
                key={index} 
                variant="soft" 
                onClick={() => handleSuggestionSelect(suggestion)}
              >
                <Text size="2">{suggestion.place_name}</Text>
              </Button>
            ))}
          </Flex>
        </ScrollArea>
      )}
    </Flex>
  );
};

export default LocationInput;