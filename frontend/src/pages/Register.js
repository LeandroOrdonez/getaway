import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Link } from '@mui/material';
import { register } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register(username, email, password);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', 'registered_user');
      navigate('/comparison');
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Register
        </Button>
      </form>
      <Typography variant="body2" style={{ marginTop: '1rem' }}>
        Already have an account? <Link href="/login">Login</Link>
      </Typography>
    </Container>
  );
};

export default Register;