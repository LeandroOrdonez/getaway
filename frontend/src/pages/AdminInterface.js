import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Grid, Chip, Input } from '@mui/material';
import { createAccommodation } from '../services/api';

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

  const handleChange = (e) => {
    setAccommodation({ ...accommodation, [e.target.name]: e.target.value });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAccommodation(accommodation);
      alert('Accommodation created successfully!');
      // Reset form
      setAccommodation({
        name: '',
        location: '',
        pricePerNight: '',
        numRooms: '',
        facilities: [],
        imageUrls: [],
        originalListingUrl: '',
      });
    } catch (error) {
      console.error('Error creating accommodation:', error);
      alert('Failed to create accommodation. Please try again.');
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Interface - Create Accommodation
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={accommodation.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={accommodation.location}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Price per Night"
              name="pricePerNight"
              type="number"
              value={accommodation.pricePerNight}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Number of Rooms"
              name="numRooms"
              type="number"
              value={accommodation.numRooms}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Original Listing URL"
              name="originalListingUrl"
              value={accommodation.originalListingUrl}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Rating"
              name="rating"
              type="number"
              inputProps={{ step: 0.1, min: 0, max: 5 }}
              value={accommodation.rating}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Add Facility"
              value={facility}
              onChange={(e) => setFacility(e.target.value)}
            />
            <Button onClick={handleAddFacility}>Add Facility</Button>
            <div style={{ marginTop: '10px' }}>
              {accommodation.facilities.map((f, index) => (
                <Chip
                  key={index}
                  label={f}
                  onDelete={() => handleRemoveFacility(f)}
                  style={{ margin: '0 5px 5px 0' }}
                />
              ))}
            </div>
          </Grid>
          <Grid item xs={12}>
            <Input
              type="file"
              inputProps={{ multiple: true }}
              onChange={handleImageUpload}
            />
            <Typography variant="caption" display="block" gutterBottom>
              Selected Images: {accommodation.imageUrls.length}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Create Accommodation
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default AdminInterface;