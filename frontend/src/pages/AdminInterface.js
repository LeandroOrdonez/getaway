// frontend/src/pages/AdminInterface.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Heading, TextField, Button, Flex, Text, Card, Grid, Box, Table, Tabs, Badge } from '@radix-ui/themes';
import * as Collapsible from '@radix-ui/react-collapsible';
import * as Progress from '@radix-ui/react-progress';
import { PlusIcon, CopyIcon, Cross2Icon, ImageIcon, ReloadIcon, ChevronDownIcon, ChevronUpIcon, StarFilledIcon } from '@radix-ui/react-icons';
import { createAccommodation, registerUser, listUsers, listAccommodations } from '../services/api';
import { useToast } from '../contexts/ToastContext';
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
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [accommodations, setAccommodations] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    fetchUsers();
    fetchAccommodations();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await listUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      addToast('Error', 'Failed to fetch users.', 'error');
    }
  };

  const fetchAccommodations = async () => {
    try {
      const response = await listAccommodations();
      setAccommodations(response.data);
    } catch (error) {
      console.error('Error fetching accommodations:', error);
      addToast('Error', 'Failed to fetch accommodations.', 'error');
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
      addToast('Success', 'Accommodation created successfully!', 'success');
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
      fetchAccommodations();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating accommodation:', error);
      addToast('Error', 'Failed to create accommodation. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserRegistration = async (e) => {
    e.preventDefault();
    try {
      await registerUser(newUser);
      addToast('Success', 'User registered successfully!', 'success');
      setNewUser({ username: '', email: '', password: '' });
      fetchUsers();
    } catch (error) {
      console.error('Error registering user:', error);
      addToast('Error', 'Failed to register user. Please try again.', 'error');
    }
  };

  const copyLoginUrl = (uniqueUrl) => {
    navigator.clipboard.writeText(`${window.location.origin}/login/${uniqueUrl}`);
    addToast('Success', 'Login URL copied to clipboard!', 'success');
  };

  const AccommodationCard = ({ accommodation }) => (
    <Card style={{ height: '100%', overflow: 'hidden' }}>
      <Flex direction="column" style={{ height: '100%' }}>
        {accommodation.imageUrls && accommodation.imageUrls.length > 0 && (
          <Box style={{ position: 'relative', paddingTop: '56.25%' }}> {/* 16:9 aspect ratio */}
            <img 
              src={accommodation.imageUrls[0]} 
              alt={accommodation.name} 
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover' 
              }} 
            />
          </Box>
        )}
        <Box p="3" style={{ flex: 1 }}>
          <Flex direction="column" gap="2">
            <Flex justify="between" align="center">
              <Link to={`/accommodation/${accommodation.id}`} style={{textDecoration: 'none'}}>
                <Heading size="3">{accommodation.name}</Heading>
              </Link>
              <Flex align="center" gap="1">
                <StarFilledIcon color="gold" />
                <Text weight="bold">{accommodation.rating}</Text>
              </Flex>
            </Flex>
            <Text size="2" color="gray">{accommodation.location}</Text>
            <Flex justify="between" align="center">
              <Text size="2" weight="bold">€{accommodation.pricePerNight} per night</Text>
              <Badge size="1" variant="outline">{accommodation.numRooms} rooms</Badge>
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Card>
  );

  return (
    <Container size={{ initial: '1', sm: '2', md: '3' }} style={{padding: '20px'}}>
      <Heading size={{ initial: '5', sm: '6', md: '6' }} mb="4">Admin Interface</Heading>
      <Tabs.Root defaultValue="accommodations">
        <Tabs.List>
          <Tabs.Trigger value="accommodations">Accommodations</Tabs.Trigger>
          <Tabs.Trigger value="users">Users</Tabs.Trigger>        
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
                <Table.ColumnHeaderCell>Comparisons</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Login URL</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {users.map((user) => (
                <Table.Row key={user.id}>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    <Flex direction="column" gap="1">
                      <Progress.Root className="ProgressRoot" value={user.comparisonCount * 10}>
                        <Progress.Indicator
                          className="ProgressIndicator"
                          style={{ transform: `translateX(-${100 - (user.comparisonCount * 10)}%)` }}
                        />
                      </Progress.Root>
                      <Text size="1">{user.comparisonCount} / 10</Text>
                    </Flex>
                  </Table.Cell>
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
          <Flex direction="column" gap="4">
            <Collapsible.Root open={isFormOpen} onOpenChange={setIsFormOpen}>
              <Collapsible.Trigger asChild>
                <Button variant="soft" size="2" style={{ width: '100%' }}>
                  {isFormOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  {isFormOpen ? 'Hide Create Form' : 'Create New Accommodation'}
                </Button>
              </Collapsible.Trigger>
              <Collapsible.Content className="CollapsibleContent">
                <Card mt="2">
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
              </Collapsible.Content>
            </Collapsible.Root>

            <Collapsible.Root open={!isFormOpen}>
              <Collapsible.Content className="CollapsibleContent">
                <Grid columns={{ initial: '1', sm: '2', md: '3' }} gap="4">
                  {accommodations.map((acc) => (
                    <AccommodationCard key={acc.id} accommodation={acc} />
                  ))}
                </Grid>
              </Collapsible.Content>
            </Collapsible.Root>
          </Flex>
          </Tabs.Content>
      </Tabs.Root>
    </Container>
  );
};

export default AdminInterface;