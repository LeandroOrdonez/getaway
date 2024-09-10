// frontend/src/pages/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Heading, Text, Button, Flex, Card, Box } from '@radix-ui/themes';
import { GlobeIcon } from '@radix-ui/react-icons';
import LocationInput from '../components/LocationInput';

const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleStartComparison = () => {
    navigate('/comparison');
  };

  return (
    <Container size="3">
      <Flex direction="column" gap="6" my="6">
        <Box>
          <Heading size="9" align="center" mb="2">Welcome to Getaway Match</Heading>
          <Text size="5" align="center" color="gray">
            Find your perfect accommodation by comparing options side by side.
          </Text>
        </Box>

        <Card>
          <Heading size="6" mb="4">Set Your Location</Heading>
          <LocationInput />
        </Card>

        {isLoggedIn ? (
          <Card>
            <Flex direction="column" align="center" gap="2">
              <Heading size="4">Ready to start?</Heading>
              <Text size="2" align="center" mb="4">
                Start comparing accommodations to find your perfect match.
              </Text>
              <Button onClick={handleStartComparison}>Start Comparing</Button>
            </Flex>
          </Card>
        ) : (
          <Card>
            <Flex direction="column" align="center" gap="2">
              <Box mb="2">
                <GlobeIcon height="32" width="32" />
              </Box>
              <Heading size="4">Welcome to Getaway Match</Heading>
              <Text size="2" align="center" mb="4">
                To start comparing accommodations, please use the unique URL provided to you to log in.
              </Text>
            </Flex>
          </Card>
        )}
      </Flex>
    </Container>
  );
};

export default Home;