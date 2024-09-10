// frontend/src/pages/AdminInterface.js
import React, { useState, useEffect } from 'react';
import { Container, Heading, TextField, Button, Flex, Text, Card, Grid, Box, Table } from '@radix-ui/themes';
import { PlusIcon, CopyIcon, Cross2Icon } from '@radix-ui/react-icons';
import { createAccommodation, registerUser, listUsers } from '../services/api';

const AdminInterface = () => {
  const [accommodation, setAccommodation] = useState({
    name: '',
    location: '',
    pricePerNight: '',
    numRooms: '',
    rating: '',
    facilities: [],
    imageUrls: [],
    originalListingUrl: '',
  });
  const [facility, setFacility] = useState('');
  const [newUser, setNewUser] = useState({ username: '', email: '' });
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState({ type: '', content: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await listUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage({ type: 'error', content: 'Failed to fetch users.' });
    }
  };

  const handleChange = (e) => {
    setAccommodation({ ...accommodation, [e.target.name]: e.target.value });
  };

  const handleNewUserChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddFacility = () => {
    if (facility.trim()) {
      setAccommodation({ 
        ...accommodation, 
        facilities: [...accommodation.facilities, facility.trim()] 
      });
      setFacility('');
    }
  };

  const handleRemoveFacility = (facilityToRemove) => {
    setAccommodation({
      ...accommodation,
      facilities: accommodation.facilities.filter(f => f !== facilityToRemove)
    });
  };

  const handleImageUpload = (e) => {
    // In a real application, you would upload these files to a server and get back URLs
    // For this example, we'll just use fake URLs
    const newImageUrls = Array.from(e.target.files).map((file, index) => 
      `http://fake-url.com/image${index + 1}.jpg`
    );
    setAccommodation({
      ...accommodation,
      imageUrls: [...accommodation.imageUrls, ...newImageUrls]
    });
  };

  const handleAccommodationSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAccommodation(accommodation);
      setMessage({ type: 'success', content: 'Accommodation created successfully!' });
      // Reset form
      setAccommodation({
        name: '',
        location: '',
        pricePerNight: '',
        numRooms: '',
        rating: '',
        facilities: [],
        imageUrls: [],
        originalListingUrl: '',
      });
    } catch (error) {
      console.error('Error creating accommodation:', error);
      setMessage({ type: 'error', content: 'Failed to create accommodation. Please try again.' });
    }
  };

  const handleUserRegistration = async (e) => {
    e.preventDefault();
    try {
      await registerUser(newUser);
      setMessage({ type: 'success', content: 'User registered successfully!' });
      setNewUser({ username: '', email: '' });
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error('Error registering user:', error);
      setMessage({ type: 'error', content: 'Failed to register user. Please try again.' });
    }
  };

  const copyLoginUrl = (uniqueUrl) => {
    navigator.clipboard.writeText(`${window.location.origin}/login/${uniqueUrl}`);
    setMessage({ type: 'success', content: 'Login URL copied to clipboard!' });
  };

  return (
    <Container size="2">
      <Heading size="8" mb="4">Admin Interface</Heading>
      
      {/* User Registration Form */}
      <Card mb="4">
        <Heading size="6" mb="2">Register New User</Heading>
        <form onSubmit={handleUserRegistration}>
          <Flex direction="column" gap="2">
            <TextField.Input
              placeholder="Username"
              name="username"
              value={newUser.username}
              onChange={handleNewUserChange}
              required
            />
            <TextField.Input
              type="email"
              placeholder="Email"
              name="email"
              value={newUser.email}
              onChange={handleNewUserChange}
              required
            />
            <Button type="submit">Register User</Button>
          </Flex>
        </form>
      </Card>

      {/* User List */}
      <Card mb="4">
        <Heading size="6" mb="2">Registered Users</Heading>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Username</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Login URL</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users.map((user) => (
              <Table.Row key={user.id}>
                <Table.Cell>{user.username}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>
                  <Button size="1" onClick={() => copyLoginUrl(user.uniqueUrl)}>
                    <CopyIcon /> Copy URL
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>

      {/* Accommodation Creation Form */}
      <Card>
        <Heading size="6" mb="2">Create New Accommodation</Heading>
        <form onSubmit={handleAccommodationSubmit}>
          <Flex direction="column" gap="4">
            <TextField.Root>
              <TextField.Input 
                placeholder="Accommodation Name" 
                name="name"
                value={accommodation.name}
                onChange={handleChange}
                required
              />
            </TextField.Root>

            <TextField.Root>
              <TextField.Input 
                placeholder="Location" 
                name="location"
                value={accommodation.location}
                onChange={handleChange}
                required
              />
            </TextField.Root>

            <Grid columns="2" gap="4">
              <TextField.Root>
                <TextField.Input 
                  type="number"
                  placeholder="Price per Night" 
                  name="pricePerNight"
                  value={accommodation.pricePerNight}
                  onChange={handleChange}
                  required
                />
              </TextField.Root>

              <TextField.Root>
                <TextField.Input 
                  type="number"
                  placeholder="Number of Rooms" 
                  name="numRooms"
                  value={accommodation.numRooms}
                  onChange={handleChange}
                  required
                />
              </TextField.Root>
            </Grid>

            <TextField.Root>
              <TextField.Input 
                type="number"
                placeholder="Rating (0-5)" 
                name="rating"
                value={accommodation.rating}
                onChange={handleChange}
                required
                step="0.1"
                min="0"
                max="5"
              />
            </TextField.Root>

            <TextField.Root>
              <TextField.Input 
                placeholder="Original Listing URL" 
                name="originalListingUrl"
                value={accommodation.originalListingUrl}
                onChange={handleChange}
                required
              />
            </TextField.Root>

            <Flex align="center" gap="2">
              <TextField.Root style={{ flex: 1 }}>
                <TextField.Input 
                  placeholder="Add Facility" 
                  value={facility}
                  onChange={(e) => setFacility(e.target.value)}
                />
              </TextField.Root>
              <Button onClick={handleAddFacility} type="button">
                <PlusIcon />
                Add
              </Button>
            </Flex>

            <Card>
              <Flex wrap="wrap" gap="2">
                {accommodation.facilities.map((f, index) => (
                  <Text key={index} size="2">
                    {f}
                    <Box as="span" ml="1" style={{ cursor: 'pointer' }} onClick={() => handleRemoveFacility(f)}>
                      <Cross2Icon />
                    </Box>
                  </Text>
                ))}
              </Flex>
            </Card>

            <Box>
              <Text as="label" size="2" mb="2" display="block">
                Upload Images
              </Text>
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'block', marginTop: '4px' }}
              />
            </Box>

            <Text size="2">Selected Images: {accommodation.imageUrls.length}</Text>

            <Button type="submit">Create Accommodation</Button>
          </Flex>
        </form>
      </Card>

      {message.content && (
        <Box mt="4">
          <Text color={message.type === 'success' ? 'green' : 'red'}>
            {message.content}
          </Text>
        </Box>
      )}
    </Container>
  );
};

export default AdminInterface;