import React from 'react';
import { Container, Typography, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import LocationInput from '../components/LocationInput';

const Home = () => {
  return (
    <Container>
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to Getaway Match
      </Typography>
      <LocationInput />
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