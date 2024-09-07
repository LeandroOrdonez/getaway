import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Heading, Text, Card, Flex, Button, Badge, AspectRatio, Grid, Box } from '@radix-ui/themes';
import { StarFilledIcon, ExternalLinkIcon } from '@radix-ui/react-icons';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { styled } from '@stitches/react';
import { getComparisonCount, getRandomPair, submitComparison, calculateDrivingDistance } from '../services/api';
import { LocationContext } from '../contexts/LocationContext';
import ResultsCalculation from '../components/ResultsCalculation';

// Styled Progress component
const StyledProgress = styled(ProgressPrimitive.Root, {
  position: 'relative',
  overflow: 'hidden',
  background: 'var(--gray-4)',
  borderRadius: '99999px',
  width: '100%',
  height: '10px',
});

const StyledIndicator = styled(ProgressPrimitive.Indicator, {
  backgroundColor: 'var(--accent-9)',
  width: '100%',
  height: '100%',
  transition: 'transform 660ms cubic-bezier(0.65, 0, 0.35, 1)',
});

const Progress = ({ value }) => {
  return (
    <StyledProgress value={value}>
      <StyledIndicator style={{ transform: `translateX(-${100 - value}%)` }} />
    </StyledProgress>
  );
};

const Comparison = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comparisonCount, setComparisonCount] = useState(0);
  const [maxComparisons, setMaxComparisons] = useState(10);
  const [isCalculatingResults, setIsCalculatingResults] = useState(false);
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
        if (location && location.place_name) {
          const distanceResponse = await calculateDrivingDistance(location.place_name, acc.location);
          return { 
            ...acc, 
            drivingDistance: `${distanceResponse.data.distance.toFixed(1)} km`,
            drivingDuration: `${distanceResponse.data.duration.toFixed(0)} mins`
          };
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
        setIsCalculatingResults(true);
        setTimeout(() => {
          navigate('/rankings');
        }, 1500);
      } else {
        fetchRandomPair();
        setComparisonCount(prevCount => prevCount + 1);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setIsCalculatingResults(true);
        setTimeout(() => {
          navigate('/rankings');
        }, 1500);
      } else {
        console.error('Error submitting comparison:', error);
      }
    }
  };

  if (comparisonCount >= maxComparisons) {
    return (
      <Container size="2">
        <Heading size="6" mb="4">Done! Thank you very much for your participation!</Heading>
        <Button onClick={() => navigate('/rankings')}>View Rankings</Button>
      </Container>
    );
  }

  if (isCalculatingResults) {
    return <ResultsCalculation />;
  }

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Container size="3">
      <Heading size="6" mb="4">Which accommodation do you prefer?</Heading>
      <Text size="3" mb="4">Comparison {comparisonCount + 1} of {maxComparisons}</Text>
      <Progress value={(comparisonCount / maxComparisons) * 100} />
      <Box mb="4" /> {/* Added for spacing */}
      <Grid columns="2" gap="4">
        {accommodations.map((accommodation) => (
          <Card key={accommodation.id}>
            <AspectRatio ratio={16/9}>
              <img
                src={accommodation.imageUrls[0]}
                alt={accommodation.name}
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%',
                }}
              />
            </AspectRatio>
            <Box p="3">
              <Heading size="4" mb="2">{accommodation.name}</Heading>
              <Text size="2" color="gray" mb="2">Location: {accommodation.location}</Text>
              <Text size="3" mb="2">Price per night: ${accommodation.pricePerNight}</Text>
              <Text size="3" mb="2">Number of rooms: {accommodation.numRooms}</Text>
              {accommodation.drivingDistance && (
                <Text size="2" color="gray" mb="2">
                  Driving distance: {accommodation.drivingDistance} ({accommodation.drivingDuration})
                </Text>
              )}
              <Flex align="center" gap="1" mb="2">
                <StarFilledIcon />
                <Text size="2">{accommodation.rating}</Text>
              </Flex>
              <Flex wrap="wrap" gap="1" mb="3">
                {accommodation.facilities.map((facility, index) => (
                  <Badge key={index} size="1">{facility}</Badge>
                ))}
              </Flex>
              <Flex direction="column" gap="2">
                <Button 
                  onClick={() => handleChoice(accommodation.id, accommodations.find(a => a.id !== accommodation.id).id)}
                >
                  Choose this one
                </Button>
                <Button variant="outline" asChild>
                  <a href={accommodation.originalListingUrl} target="_blank" rel="noopener noreferrer">
                    View Original Listing
                    <ExternalLinkIcon />
                  </a>
                </Button>
              </Flex>
            </Box>
          </Card>
        ))}
      </Grid>
    </Container>
  );
};

export default Comparison;