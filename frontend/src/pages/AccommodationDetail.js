import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Card, CardContent, CardMedia, Grid, Chip, Rating, Button } from '@mui/material';
import { getAccommodationDetails } from '../services/api';

const AccommodationDetail = () => {
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchAccommodationDetails = async () => {
      try {
        const response = await getAccommodationDetails(id);
        setAccommodation(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching accommodation details:', error);
        setLoading(false);
      }
    };

    fetchAccommodationDetails();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (!accommodation) return <Typography>Accommodation not found</Typography>;

  return (
    <Container>
      <Card>
        <CardMedia
          component="img"
          height="300"
          image={accommodation.imageUrls[0]}
          alt={accommodation.name}
        />
        <CardContent>
          <Typography variant="h4" gutterBottom>{accommodation.name}</Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Location: {accommodation.location}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Price per night: ${accommodation.pricePerNight}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Number of rooms: {accommodation.numRooms}
          </Typography>
          <Rating name="read-only" value={accommodation.rating} readOnly />
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Rating: {accommodation.rating}
          </Typography>
          <Typography variant="body1" gutterBottom>Facilities:</Typography>
          <Grid container spacing={1} style={{ marginBottom: '16px' }}>
            {accommodation.facilities.map((facility, index) => (
              <Grid item key={index}>
                <Chip label={facility} />
              </Grid>
            ))}
          </Grid>
          <Button variant="contained" color="primary" href={accommodation.originalListingUrl} target="_blank">
            View Original Listing
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AccommodationDetail;