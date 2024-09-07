import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Heading, TextField, Button, Text, Flex, AlertDialog } from '@radix-ui/themes';
import { login } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', response.data.userType);
      navigate('/comparison');
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <Container size="2" py="9">
      <Heading size="8" mb="6">Login</Heading>
      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap="3">
          <TextField.Root>
            <TextField.Input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </TextField.Root>
          <TextField.Root>
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
      <AlertDialog.Root open={!!error}>
        <AlertDialog.Content>
          <AlertDialog.Title>Error</AlertDialog.Title>
          <AlertDialog.Description>{error}</AlertDialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray" onClick={() => setError('')}>
                Close
              </Button>
            </AlertDialog.Cancel>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Container>
  );
};

export default Login;