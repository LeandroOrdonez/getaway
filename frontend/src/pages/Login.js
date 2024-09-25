// frontend/src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Heading, Text, TextField, Button, Flex, Card, Box } from '@radix-ui/themes';
import { EnvelopeClosedIcon, LockClosedIcon } from '@radix-ui/react-icons';
import { login } from '../services/api';
import { jwtDecode } from 'jwt-decode';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
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
      
      if (decodedToken.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Login failed. Please check your credentials.');
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
            {error && (
              <Text color="red" size="2" align="center">
                {error}
              </Text>
            )}
            <Box>
              <Text size="2" align="center">
                Don't know your password?{' '}
                <Text as="span" style={{ fontStyle: 'italic' }}>
                  Login with the unique link porovided by your host
                </Text>
              </Text>
            </Box>
          </Flex>
        </Card>
      </Flex>
    </Container>
  );
};

export default Login;