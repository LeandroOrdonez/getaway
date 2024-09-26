// frontend/src/pages/AdminInterface.js
import React, { useState, useEffect } from 'react';
import { Container, Heading, TextField, Button, Flex, Text, Card, Grid, Box, Table, Tabs } from '@radix-ui/themes';
import { PlusIcon, CopyIcon, Cross2Icon, ImageIcon, ReloadIcon } from '@radix-ui/react-icons';
import { createAccommodation, registerUser, listUsers } from '../services/api';
import '../styles/AdminInterface.css';

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
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '' });
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
    const files = Array.from(e.target.files);
    setImageFiles(files);

    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleRemoveImage = (index) => {
    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);
    setImageFiles(newFiles);

    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleAccommodationSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.keys(accommodation).forEach(key => {
        if (key === 'facilities') {
          formData.append(key, JSON.stringify(accommodation[key]));
        } else {
          formData.append(key, accommodation[key]);
        }
      });
      imageFiles.forEach(file => {
        formData.append('images', file);
      });

      await createAccommodation(formData);
      setMessage({ type: 'success', content: 'Accommodation created successfully!' });
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
      setImageFiles([]);
      setImagePreviews([]);
    } catch (error) {
      if (error.response) {
        console.error('Upload error:', error.response.data.error);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error', error.message);
      }
      setMessage({ type: 'error', content: 'Failed to create accommodation. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserRegistration = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(newUser);
      setMessage({ type: 'success', content: 'User registered successfully!' });
      setNewUser({ username: '', email: '' });
      fetchUsers();
      
      // Display the unique login URL
      const uniqueLoginUrl = `${window.location.origin}/login/${response.data.uniqueUrl}`;
      setMessage({ type: 'success', content: 'User registered successfully!' });
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
    <Container size="3">
      <Heading size="8" mb="4">Admin Interface</Heading>
      <Tabs.Root defaultValue="users">
        <Tabs.List>
          <Tabs.Trigger value="users">Users</Tabs.Trigger>
          <Tabs.Trigger value="accommodations">Accommodations</Tabs.Trigger>
        </Tabs.List>
        
        <Tabs.Content value="users">
          <Card mt="4">
            <Heading size="6" mb="4">Register New User</Heading>
            <form onSubmit={handleUserRegistration}>
              <Flex direction="column" gap="3">
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

          <Card mt="4">
            <Heading size="6" mb="4">Registered Users</Heading>
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
        </Tabs.Content>
        
        <Tabs.Content value="accommodations">
          <Card mt="4">
            <Heading size="6" mb="4">Create New Accommodation</Heading>
            <form onSubmit={handleAccommodationSubmit}>
              <Flex direction="column" gap="4">
                <TextField.Input 
                  placeholder="Accommodation Name" 
                  name="name"
                  value={accommodation.name}
                  onChange={handleChange}
                  required
                />
                <TextField.Input 
                  placeholder="Location" 
                  name="location"
                  value={accommodation.location}
                  onChange={handleChange}
                  required
                />
                <Grid columns="2" gap="4">
                  <TextField.Input 
                    type="number"
                    placeholder="Price per Night" 
                    name="pricePerNight"
                    value={accommodation.pricePerNight}
                    onChange={handleChange}
                    required
                  />
                  <TextField.Input 
                    type="number"
                    placeholder="Number of Rooms" 
                    name="numRooms"
                    value={accommodation.numRooms}
                    onChange={handleChange}
                    required
                  />
                </Grid>
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
                <TextField.Input 
                  placeholder="Original Listing URL" 
                  name="originalListingUrl"
                  value={accommodation.originalListingUrl}
                  onChange={handleChange}
                  required
                />
                <Flex align="center" gap="2">
                  <TextField.Input 
                    placeholder="Add Facility" 
                    value={facility}
                    onChange={(e) => setFacility(e.target.value)}
                  />
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
                  <Flex align="center" mb="2">
                    <ImageIcon />
                    <Text as="label" size="2" ml="2">
                      Upload Images
                    </Text>
                  </Flex>
                  <input
                    type="file"
                    multiple
                    onChange={handleImageUpload}
                    accept="image/*"
                    style={{ display: 'block', marginTop: '4px' }}
                    disabled={isLoading}
                  />
                </Box>
                <Grid columns="4" gap="2">
                  {imagePreviews.map((preview, index) => (
                    <Box key={index} position="relative">
                      <img src={preview} alt={`Preview ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
                      <Button 
                        size="1" 
                        color="red" 
                        position="absolute" 
                        top="0" 
                        right="0" 
                        onClick={() => handleRemoveImage(index)}
                        disabled={isLoading}
                      >
                        <Cross2Icon />
                      </Button>
                    </Box>
                  ))}
                </Grid>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Flex align="center" justify="center">
                      <ReloadIcon className="spinning" />
                      <Text ml="2">Creating...</Text>
                    </Flex>
                  ) : (
                    'Create Accommodation'
                  )}
                </Button>
              </Flex>
            </form>
          </Card>
        </Tabs.Content>
      </Tabs.Root>

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