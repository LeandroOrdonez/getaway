// frontend/src/pages/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Heading, Text, Button, Flex, Card, Box } from '@radix-ui/themes';
import { Globe } from 'lucide-react';
import LocationInput from '../components/LocationInput';

const Home = ({ user }) => {
  const navigate = useNavigate();
  const isLoggedIn = !!user;
  console.log("user", user);

  const handleStartComparison = () => {
    navigate('/comparison');
  };

  return (
    <Container size={{ initial: '1', sm: '2', md: '3' }} px={{ initial: '2', sm: '4' }}>
      <Flex direction="column" gap={{ initial: '4', sm: '6' }} my={{ initial: '4', sm: '6' }}>
        <Box>
          <Heading size={{ initial: '6', sm: '7', md: '8' }} align="center" mb="2">
            {isLoggedIn 
              ? `Welcome to Getaway Match${user.username ? `, ${user.username}` : ''}!`
              : 'Welcome to Getaway Match'}
          </Heading>
          <Text size={{ initial: '3', sm: '4', md: '5' }} align="center" color="gray">
            Find your perfect accommodation by comparing options side by side.
          </Text>
        </Box>

        <Card>
          <Heading size={{ initial: '3', sm: '4' }} mb="4">Set Your Location</Heading>
          <LocationInput />
        </Card>

        {isLoggedIn ? (
          <Card>
            <Flex direction="column" align="center" gap="2">
              <Heading size={{ initial: '3', sm: '4' }}>Ready to start{user.username ? `, ${user.username}` : ''}?</Heading>
              <Text size="3" align="center" mb="4">
                Start comparing accommodations to find your perfect match.
              </Text>
              <Button size='3' onClick={handleStartComparison} style={{ width: '100%' }}>
                Start Comparing
              </Button>
            </Flex>
          </Card>
        ) : (
          <Card>
            <Flex direction="column" align="center" gap="2">
              <Box mb="2">
                <Globe size={32} />
              </Box>
              <Heading size={{ initial: '3', sm: '4' }}>Welcome to Getaway Match</Heading>
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