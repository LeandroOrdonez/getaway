import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Heading, Text, TextField, Button, Flex, Card, Box } from '@radix-ui/themes';
import { PersonIcon, EnvelopeClosedIcon, LockClosedIcon } from '@radix-ui/react-icons';
import { register } from '../services/api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await register(username, email, password);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', 'registered_user');
      navigate('/comparison');
    } catch (error) {
      console.error('Error registering:', error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Container size="1">
      <Card>
        <Flex direction="column" gap="4" style={{ maxWidth: 400, margin: '0 auto' }}>
          <Heading size="6" align="center">Create an Account</Heading>
          <Text size="2" color="gray" align="center">
            Join Getaway Match to start comparing and finding your perfect accommodation.
          </Text>
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="3">
              <TextField.Root>
                <TextField.Slot>
                  <PersonIcon height="16" width="16" />
                </TextField.Slot>
                <TextField.Input 
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </TextField.Root>
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
              <Button type="submit">Register</Button>
            </Flex>
          </form>
          {error && (
            <Text color="red" size="2">
              {error}
            </Text>
          )}
          <Box>
            <Text size="2" align="center">
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--accent-9)', textDecoration: 'none' }}>
                Login here
              </Link>
            </Text>
          </Box>
        </Flex>
      </Card>
    </Container>
  );
};

export default Register;