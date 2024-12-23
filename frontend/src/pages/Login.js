// frontend/src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Heading, Text, TextField, Button, Flex, Card, Box } from '@radix-ui/themes';
import { EnvelopeClosedIcon, LockClosedIcon } from '@radix-ui/react-icons';
import { login } from '../services/api';
import { jwtDecode } from 'jwt-decode';
import { useToast } from '../contexts/ToastContext';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      const { token } = response.data;
      localStorage.setItem('token', token);
      
      const decodedToken = jwtDecode(token);
      setUser({
        token,
        id: decodedToken.id,
        type: decodedToken.type,
        isAdmin: decodedToken.isAdmin,
        username: decodedToken.username,
        email: decodedToken.email
      });
      
      addToast('Success', 'You have successfully logged in.', 'success');
      
      // Redirect to the intended page or default to home
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Error logging in:', error);
      addToast('Error', 'Login failed. Please check your credentials.', 'error');
    }
  };

  return (
    <Container size={{ initial: '1', sm: '2', md: '3' }}>
      <Flex
        align="top" 
        justify="center" 
        style={{ padding: '20px' }}
      >
        <Card style={{ width: '100%', maxWidth: '400px' }}>
          <Flex direction="column" gap="4">
            <Heading size={{ initial: '5', sm: '6' }} align="center">Welcome Back</Heading>
            <Text size="2" color="gray" align="center">
              Log in to your Getaway Match account
            </Text>
            <form onSubmit={handleSubmit}>
              <Flex direction="column" gap="3">
                <TextField.Root size={{ initial: '2', sm: '3' }}>
                  <TextField.Slot>
                    <EnvelopeClosedIcon height="16" width="16" />
                  </TextField.Slot>
                  <TextField.Input 
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </TextField.Root>
                <TextField.Root size={{ initial: '2', sm: '3' }}>
                  <TextField.Slot>
                    <LockClosedIcon height="16" width="16" />
                  </TextField.Slot>
                  <TextField.Input 
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </TextField.Root>
                <Button type="submit" size={{ initial: '3', sm: '4' }}>
                  Log In
                </Button>
              </Flex>
            </form>
          </Flex>
        </Card>
      </Flex>
    </Container>
  );
};

export default Login;