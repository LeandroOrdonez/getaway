// frontend/src/pages/Comparison.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Heading, Text, Card, Flex, Button, Badge, AspectRatio, Box } from '@radix-ui/themes';
import * as Progress from '@radix-ui/react-progress';
import { Star, ExternalLink, Bed, Car, MapPin } from 'lucide-react';
import { getComparisonCount, getRandomPair, submitComparison, calculateDrivingDistance } from '../services/api';
import { LocationContext } from '../contexts/LocationContext';
import ResultsCalculation from '../components/ResultsCalculation';
import Carousel from '../components/Carousel';

const Comparison = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comparisonCount, setComparisonCount] = useState(0);
  const [maxComparisons, setMaxComparisons] = useState(10);
  const [isCalculatingResults, setIsCalculatingResults] = useState(false);
  const [showCarousel, setShowCarousel] = useState([false, false]);
  const [currentImageIndex, setCurrentImageIndex] = useState([0, 0]);
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

  const handleImageClick = (accommodationIndex, imageIndex) => {
    setCurrentImageIndex(prev => {
      const newIndexes = [...prev];
      newIndexes[accommodationIndex] = imageIndex;
      return newIndexes;
    });
    setShowCarousel(prev => {
      const newShow = [...prev];
      newShow[accommodationIndex] = true;
      return newShow;
    });
  };

  const handleCloseCarousel = (accommodationIndex) => {
    setShowCarousel(prev => {
      const newShow = [...prev];
      newShow[accommodationIndex] = false;
      return newShow;
    });
  };

  const handlePrevImage = (accommodationIndex) => {
    setCurrentImageIndex(prev => {
      const newIndexes = [...prev];
      newIndexes[accommodationIndex] = newIndexes[accommodationIndex] === 0 
        ? accommodations[accommodationIndex].imageUrls.length - 1 
        : newIndexes[accommodationIndex] - 1;
      return newIndexes;
    });
  };

  const handleNextImage = (accommodationIndex) => {
    setCurrentImageIndex(prev => {
      const newIndexes = [...prev];
      newIndexes[accommodationIndex] = (newIndexes[accommodationIndex] + 1) % accommodations[accommodationIndex].imageUrls.length;
      return newIndexes;
    });
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

  const truncate = (str, n) => {
    return str.length > n ? str.substr(0, n-1) + '...' : str;
  };

  return (
    <Container size={{ initial: '1', sm: '2', md: '3' }} px={{ initial: '2', sm: '4' }}>
      <Heading size={{ initial: '4', sm: '5' }} mb="2">Which accommodation do you prefer?</Heading>
      <Text size="2" mb="2">Comparison {comparisonCount + 1} of {maxComparisons}</Text>
      <Progress.Root value={(comparisonCount / maxComparisons) * 100} style={{ height: 10, backgroundColor: 'var(--gray-4)', borderRadius: 5, overflow: 'hidden', marginBottom: 16 }}>
        <Progress.Indicator style={{ width: `${(comparisonCount / maxComparisons) * 100}%`, backgroundColor: 'var(--accent-9)', height: '100%', transition: 'width 660ms cubic-bezier(0.65, 0, 0.35, 1)' }} />
      </Progress.Root>
      <Flex direction={{ initial: 'column', sm: 'row' }} gap="4" style={{ alignItems: 'stretch' }}>
        {accommodations.map((accommodation, index) => (
          <Box key={accommodation.id} style={{ flex: '1', minWidth: 0, width: '100%' }}>
            <Card mb="4">
              <AspectRatio ratio={16/9}>
                <img
                  src={accommodation.imageUrls[0]}
                  alt={accommodation.name || 'Accommodation'}
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleImageClick(index, 0)}
                />
              </AspectRatio>
              <Flex direction="column" style={{ flex: 1, padding: 'var(--space-4)' }}>
                <Box p="3">
                  <Heading aria-description={accommodation.name} size="3" mb="2">{truncate(accommodation.name, 50)}</Heading>
                  <Flex align="center" mb="2">
                    <MapPin size={16} />
                    <Text aria-description={accommodation.location} size="2" ml="1">{truncate(accommodation.location, 60)}</Text>
                  </Flex>
                  <Flex justify="between" mb="2">
                    <Text weight="bold">€{accommodation.pricePerNight} per night</Text>
                    <Flex align="center">
                      <Bed size={16} />
                      <Text size="2" ml="1">{accommodation.numRooms} rooms</Text>
                    </Flex>
                  </Flex>
                  {accommodation.drivingDistance && (
                    <Flex align="center" mb="2">
                      <Car size={16} />
                      <Text size="2" ml="1">
                        {accommodation.drivingDistance} ({accommodation.drivingDuration} drive)
                      </Text>
                    </Flex>
                  )}
                  <Flex align="center" mb="2">
                    <Star size={16} />
                    <Text size="2" ml="1">{accommodation.rating}</Text>
                  </Flex>
                  <Flex wrap="wrap" gap="1" mb="3">
                    {accommodation.facilities.map((facility, facilityIndex) => (
                      <Badge key={facilityIndex} size="1">{facility}</Badge>
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
                        <ExternalLink size={16} style={{ marginLeft: '4px' }} />
                      </a>
                    </Button>
                  </Flex>
                </Box>
              </Flex>
              {showCarousel[index] && (
                <Carousel
                  images={accommodation.imageUrls}
                  currentIndex={currentImageIndex[index]}
                  onClose={() => handleCloseCarousel(index)}
                  onPrev={() => handlePrevImage(index)}
                  onNext={() => handleNextImage(index)}
                />
              )}
            </Card>
          </Box>
        ))}
      </Flex>
    </Container>
  );
};

export default Comparison;