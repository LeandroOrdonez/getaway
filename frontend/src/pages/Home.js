import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Heading, Text, Button, Flex, Card, Grid, Box } from '@radix-ui/themes';
import { PersonIcon, LockClosedIcon, GlobeIcon } from '@radix-ui/react-icons';
import LocationInput from '../components/LocationInput';

const Home = () => {
  const isLoggedIn = !!localStorage.getItem('token');
  const userType = localStorage.getItem('userType');
  const navigate = useNavigate();

  const handleStartComparison = () => {
    if (userType === 'admin') {
      navigate('/admin');
    } else {
      navigate('/comparison');
    }
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

        {isLoggedIn && userType !== 'admin' && (
          <Card>
            <Heading size="6" mb="4">Set Your Location</Heading>
            <LocationInput />
          </Card>
        )}

        {isLoggedIn ? (
          <Card>
            <Flex direction="column" align="center" gap="2">
              <Heading size="4">Ready to start?</Heading>
              <Text size="2" align="center" mb="4">
                {userType === 'admin' 
                  ? "Access the admin interface to manage accommodations." 
                  : "Start comparing accommodations to find your perfect match."}
              </Text>
              <Button onClick={handleStartComparison}>
                {userType === 'admin' ? 'Go to Admin Interface' : 'Start Comparing'}
              </Button>
            </Flex>
          </Card>
        ) : (
          <Grid columns={{ initial: '1', sm: '3' }} gap="4">
            <Card>
              <Flex direction="column" align="center" gap="2">
                <Box mb="2">
                  <PersonIcon height="32" width="32" />
                </Box>
                <Heading size="4">Continue as Guest</Heading>
                <Text size="2" align="center" mb="4">
                  Start comparing accommodations without creating an account.
                </Text>
                <Button asChild>
                  <Link to="/guest">Start as Guest</Link>
                </Button>
              </Flex>
            </Card>

            <Card>
              <Flex direction="column" align="center" gap="2">
                <Box mb="2">
                  <LockClosedIcon height="32" width="32" />
                </Box>
                <Heading size="4">Login</Heading>
                <Text size="2" align="center" mb="4">
                  Access your account to continue your comparisons.
                </Text>
                <Button asChild>
                  <Link to="/login">Login</Link>
                </Button>
              </Flex>
            </Card>

            <Card>
              <Flex direction="column" align="center" gap="2">
                <Box mb="2">
                  <GlobeIcon height="32" width="32" />
                </Box>
                <Heading size="4">Register</Heading>
                <Text size="2" align="center" mb="4">
                  Create an account to save your preferences and comparisons.
                </Text>
                <Button asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </Flex>
            </Card>
          </Grid>
        )}

        {!isLoggedIn && (
          <Card>
            <Heading size="6" mb="4">Set Your Location</Heading>
            <LocationInput />
          </Card>
        )}
      </Flex>
    </Container>
  );
};

export default Home;