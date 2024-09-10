import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Heading, Text, TextField, Button, Flex, Card } from '@radix-ui/themes';
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
    <Container size="1">
      <Card>
        <Flex direction="column" gap="4" style={{ maxWidth: 400, margin: '0 auto' }}>
          <Heading size="6" align="center">Login</Heading>
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="3">
              <TextField.Root>
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
              <TextField.Root>
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
              <Button type="submit">Login</Button>
            </Flex>
          </form>
          {error && (
            <Text color="red" size="2">
              {error}
            </Text>
          )}
        </Flex>
      </Card>
    </Container>
  );
};

export default Login;