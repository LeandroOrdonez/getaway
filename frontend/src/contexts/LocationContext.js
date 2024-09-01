import React, { createContext, useState, useEffect } from 'react';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const detectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          setError("Unable to retrieve your location");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  };

  const setManualLocation = (address) => {
    // Here you would typically use a geocoding service to convert address to coordinates
    // For simplicity, we'll just store the address string
    setLocation(address);
  };

  useEffect(() => {
    detectLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ location, error, detectLocation, setManualLocation }}>
      {children}
    </LocationContext.Provider>
  );
};