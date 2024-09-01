import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Link } from '@mui/material';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', response.data.userType);
      navigate('/comparison');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
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
          Login
        </Button>
      </form>
      <Typography variant="body2" style={{ marginTop: '1rem' }}>
        Don't have an account? <Link href="/register">Register</Link>
      </Typography>
    </Container>
  );
};

export default Login;