import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Heading, Text, Button, Flex, Card, Grid, Box } from '@radix-ui/themes';
import { PersonIcon, LockClosedIcon, GlobeIcon } from '@radix-ui/react-icons';
import LocationInput from '../components/LocationInput';

const Home = () => {
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
      </Flex>
    </Container>
  );
};

export default Home;