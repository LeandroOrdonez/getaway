// src/pages/Comparison.js
import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Button, Card, CardContent, CardMedia, Grid, Chip, Rating } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getComparisonCount, getRandomPair, submitComparison, calculateDrivingDistance } from '../services/api';
import { LocationContext } from '../contexts/LocationContext';

const Comparison = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comparisonCount, setComparisonCount] = useState(0);
  const [maxComparisons, setMaxComparisons] = useState(10);
  const navigate = useNavigate();
  const { location } = useContext(LocationContext);

  useEffect(() => {
    fetchComparisonCount();
    fetchRandomPair();
  }, [location]);

  const fetchComparisonCount = async () => {
    try {
      const response = await getComparisonCount();
      setComparisonCount(response.data.count);
      setMaxComparisons(response.data.maxComparisons);
    } catch (error) {
      console.error('Error fetching comparison count:', error);
    }
  };

  const fetchRandomPair = async () => {
    setLoading(true);
    try {
      const response = await getRandomPair();
      const accommodationsWithDistance = await Promise.all(response.data.map(async (acc) => {
        if (location) {
          const distanceResponse = await calculateDrivingDistance(location, acc.location);
          return { ...acc, drivingDistance: distanceResponse.data.distance };
        }
        return acc;
      }));
      setAccommodations(accommodationsWithDistance);
    } catch (error) {
      console.error('Error fetching random pair:', error);
    }
    setLoading(false);
  };

  const handleChoice = async (winnerAccommodationId, loserAccommodationId) => {
    try {
      const response = await submitComparison(winnerAccommodationId, loserAccommodationId);
      if (response.data.isLastComparison) {
        navigate('/rankings');
      } else {
        fetchRandomPair();
        setComparisonCount(prevCount => prevCount + 1);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        navigate('/rankings');
      } else {
        console.error('Error submitting comparison:', error);
      }
    }
  };

  if (comparisonCount >= maxComparisons) {
    return (
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Done! Thank you very much for your participation!
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/rankings')}>
          View Rankings
        </Button>
      </Container>
    );
  }

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Which accommodation do you prefer? ({comparisonCount}/{maxComparisons})
      </Typography>
      <Grid container spacing={3}>
        {accommodations.map((accommodation) => (
          <Grid item xs={12} sm={6} key={accommodation.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={accommodation.imageUrls[0]}
                alt={accommodation.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {accommodation.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Location: {accommodation.location}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Price per night: ${accommodation.pricePerNight}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Number of rooms: {accommodation.numRooms}
                </Typography>
                {accommodation.drivingDistance && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Driving distance: {accommodation.drivingDistance}
                  </Typography>
                )}
                <Rating name="read-only" value={accommodation.rating} readOnly precision={0.1} />
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Rating: {accommodation.rating}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Facilities:
                </Typography>
                <div>
                  {accommodation.facilities.map((facility, index) => (
                    <Chip key={index} label={facility} size="small" style={{ margin: '0 2px 2px 0' }} />
                  ))}
                </div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleChoice(accommodation.id, accommodations.find(a => a.id !== accommodation.id).id)}
                  style={{ marginTop: '10px' }}
                >
                  Choose this one
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  href={accommodation.originalListingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginTop: '10px', marginLeft: '10px' }}
                >
                  View Original Listing
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Comparison;