// frontend/src/pages/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Heading, Text, Button, Flex, Card, Box, Grid } from '@radix-ui/themes';
import { Car, Globe, HomeIcon, Star, ArrowRight } from 'lucide-react';
import LocationInput from '../components/LocationInput';
import '../styles/Home.css';

const Home = ({ user }) => {
  const navigate = useNavigate();
  const isLoggedIn = !!user;
  console.log("user", user);

  const handleStartComparison = () => {
    navigate('/comparison');
  };

  const Feature = ({ icon, title, description }) => (
    <Card size="2">
      <Flex direction="column" align="center" gap="2">
        <Box className="feature-icon">{icon}</Box>
        <Text size="5" weight="bold">{title}</Text>
        <Text align="center">{description}</Text>
      </Flex>
    </Card>
  );

  return (
    <Container size={{ initial: '1', sm: '2', md: '3' }} px={{ initial: '2', sm: '4' }}>
      <Flex direction="column" gap={{ initial: '4', sm: '6' }} my={{ initial: '4', sm: '6' }}>
        {/* Hero Section */}
        <Box>
          <Heading size={{ initial: '6', sm: '7', md: '8' }} align="center" mb="2">
            Find Your Perfect Getaway
          </Heading>
          <Text size={{ initial: '3', sm: '4', md: '5' }} align="center" color="gray">
            Compare country house accommodations side by side and discover your ideal retreat.
          </Text>
        </Box>

        {/* Location Input */}
        <Card>
          <Heading size={{ initial: '3', sm: '4' }} mb="4">Set Your Location</Heading>
          <LocationInput />
        </Card>

        {/* Features Section */}
        <Box>
          <Heading size={{ initial: '5', sm: '6' }} mb="4">How It Works</Heading>
          <Grid columns={{ initial: '1', sm: '2', md: '3' }} gap="4">
            <Feature 
              icon={<HomeIcon size={32} />}
              title="Pairwise Comparison"
              description="Compare accommodations side by side to find your favorite."
            />
            <Feature 
              icon={<Star size={32} />}
              title="Smart Ranking"
              description="Our algorithm generates rankings based on your preferences."
            />
            <Feature 
              icon={<Car size={32} />}
              title="Distance Calculation"
              description="See driving distances from your location to each accommodation."
            />
          </Grid>
        </Box>

        {/* Call to Action */}
        {isLoggedIn ? (
          <Card>
            <Flex direction="column" align="center" gap="2">
              <Heading size={{ initial: '3', sm: '4' }}>Ready to start{user.username ? `, ${user.username}` : ''}?</Heading>
              <Text size="3" align="center" mb="4">
                Start comparing accommodations to find your perfect match.
              </Text>
              <Button size='3' onClick={handleStartComparison} style={{ width: '100%' }}>
                Start Comparing
                <ArrowRight size={16} />
              </Button>
            </Flex>
          </Card>
        ) : (
          <Feature 
            icon={<Globe size={32} />}
            title="Ready to find your perfect getaway?"
            description="To start comparing accommodations, please use the unique URL provided to you to log in."
          />
        )}
      </Flex>
    </Container>
  );
};

export default Home;