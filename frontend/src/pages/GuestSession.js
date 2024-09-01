import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { startGuestSession } from '../services/api';
import { useNavigate } from 'react-router-dom';

const GuestSession = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await startGuestSession(name);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', 'guest');
      navigate('/comparison');
    } catch (error) {
      console.error('Error starting guest session:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Start as Guest
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Start Session
        </Button>
      </form>
    </Container>
  );
};

export default GuestSession;