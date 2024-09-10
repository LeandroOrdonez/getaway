// frontend/src/pages/GuestSession.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Heading, Text, TextField, Button, Flex, Card } from '@radix-ui/themes';
import { PersonIcon } from '@radix-ui/react-icons';
import { startGuestSession } from '../services/api';

const GuestSession = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await startGuestSession(name);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', 'guest');
      navigate('/comparison');
    } catch (error) {
      console.error('Error starting guest session:', error);
      setError('Failed to start guest session. Please try again.');
    }
  };

  return (
    <Container size="1">
      <Card>
        <Flex direction="column" gap="4" style={{ maxWidth: 400, margin: '0 auto' }}>
          <Heading size="6" align="center">Start as Guest</Heading>
          <Text size="2" color="gray" align="center">
            Enter your name to begin a guest session and start comparing accommodations!
          </Text>
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="3">
              <TextField.Root>
                <TextField.Slot>
                  <PersonIcon height="16" width="16" />
                </TextField.Slot>
                <TextField.Input 
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </TextField.Root>
              <Button type="submit">Start Session</Button>
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

export default GuestSession;