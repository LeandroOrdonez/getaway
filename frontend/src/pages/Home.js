import React, { useContext, useState } from 'react';
import { Container, Typography, Button, Grid, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { LocationContext } from '../contexts/LocationContext';
import LocationInput from '../components/LocationInput';

const Home = () => {
  const { setLocation } = useContext(LocationContext);

  const handleLocationSelect = (selectedLocation) => {
    setLocation({
      lat: selectedLocation.center[1],
      lng: selectedLocation.center[0],
      address: selectedLocation.place_name
    });
  };

  return (
    <Container>
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to Country House Accommodation Comparison
      </Typography>
      <LocationInput onLocationSelect={handleLocationSelect} />
      <Grid container spacing={3} style={{ marginTop: '2rem' }}>
        <Grid item xs={12} sm={4}>
          <Button
            component={Link}
            to="/guest"
            variant="contained"
            color="primary"
            fullWidth
          >
            Continue as Guest
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            color="secondary"
            fullWidth
          >
            Login
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            component={Link}
            to="/register"
            variant="outlined"
            color="primary"
            fullWidth
          >
            Register
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;