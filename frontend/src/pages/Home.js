import React, { useContext, useState } from 'react';
import { Container, Typography, Button, Grid, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { LocationContext } from '../contexts/LocationContext';

const Home = () => {
  const { location, error, detectLocation, setManualLocation } = useContext(LocationContext);
  const [manualAddress, setManualAddress] = useState('');

  const handleManualLocation = () => {
    setManualLocation(manualAddress);
  };

  return (
    <Container>
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to Country House Accommodation Comparison
      </Typography>
      <Typography variant="h5" gutterBottom>
        Your Location: {location ? (typeof location === 'string' ? location : `${location.lat}, ${location.lng}`) : 'Not set'}
      </Typography>
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <Button onClick={detectLocation} variant="contained" color="primary" style={{ marginBottom: '1rem' }}>
        Detect My Location
      </Button>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            label="Enter your address manually"
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button onClick={handleManualLocation} variant="contained" color="secondary">
            Set Manual Location
          </Button>
        </Grid>
      </Grid>
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