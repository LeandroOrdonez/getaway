// frontend/src/pages/Comparison.js
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Heading, Text, Card, Flex, Button, Badge, Box } from '@radix-ui/themes';
import * as Progress from '@radix-ui/react-progress';
import { Star, ExternalLink, Bed, Car, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { getComparisonCount, getRandomPair, submitComparison, calculateDrivingDistance } from '../services/api';
import { LocationContext } from '../contexts/LocationContext';
import { useToast } from '../contexts/ToastContext';
import ResultsCalculation from '../components/ResultsCalculation';
import Carousel from '../components/Carousel';

const Comparison = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comparisonCount, setComparisonCount] = useState(0);
  const [maxComparisons, setMaxComparisons] = useState(10);
  const [isCalculatingResults, setIsCalculatingResults] = useState(false);
  const [showCarousel, setShowCarousel] = useState([false, false]);
  const [currentImageIndexes, setCurrentImageIndexes] = useState([0, 0]);
  const [justCompletedAllComparisons, setJustCompletedAllComparisons] = useState(false);
  const navigate = useNavigate();
  const { location } = useContext(LocationContext);
  const { addToast } = useToast();

  const fetchComparisonCount = useCallback(async () => {
    try {
      const response = await getComparisonCount();
      setComparisonCount(response.data.count);
      setMaxComparisons(response.data.maxComparisons);
      return response.data.count;
    } catch (error) {
      console.error('Error fetching comparison count:', error);
      addToast('Error', 'Failed to fetch comparison count.', 'error');
      return 0;
    }
  }, [addToast]);

  const fetchRandomPair = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getRandomPair();
      const accommodationsWithDistance = await Promise.all(response.data.map(async (acc) => {
        if (location && location.place_name) {
          try {
            const distanceResponse = await calculateDrivingDistance(location.place_name, acc.location);
            return { 
              ...acc, 
              drivingDistance: `${distanceResponse.data.distance.toFixed(1)} km`,
              drivingDuration: `${distanceResponse.data.duration.toFixed(0)} mins`
            };
          } catch (error) {
            console.error('Error calculating driving distance:', error);
            return acc;
          }
        }
        return acc;
      }));
      setAccommodations(accommodationsWithDistance);
      setCurrentImageIndexes([0, 0]);
    } catch (error) {
      console.error('Error fetching random pair:', error);
      addToast('Error', 'Failed to fetch accommodations for comparison.', 'error');
    } finally {
      setLoading(false);
    }
  }, [location, addToast]);

  useEffect(() => {
    const initComparison = async () => {
      const count = await fetchComparisonCount();
      if (count < maxComparisons) {
        fetchRandomPair();
      }
      setLoading(false);
    };

    initComparison();
  }, [fetchComparisonCount, fetchRandomPair, maxComparisons]);

  const handleChoice = async (winnerAccommodationId, loserAccommodationId) => {
    try {
      const response = await submitComparison(winnerAccommodationId, loserAccommodationId);
      const newCount = await fetchComparisonCount();
      
      if (newCount >= maxComparisons || response.data.isLastComparison) {
        setJustCompletedAllComparisons(true);
        setIsCalculatingResults(true);
        addToast('Success', 'All comparisons completed. Calculating final results...', 'success');
        setTimeout(() => {
          navigate('/rankings');
        }, 1500);
      } else {
        fetchRandomPair();
      }
    } catch (error) {
      console.error('Error submitting comparison:', error);
      addToast('Error', 'Failed to submit comparison. Please try again.', 'error');
    }
  };

  const handleImageClick = (accommodationIndex, imageIndex) => {
    setCurrentImageIndexes(prev => {
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
    setCurrentImageIndexes(prev => {
      const newIndexes = [...prev];
      newIndexes[accommodationIndex] = (newIndexes[accommodationIndex] - 1 + accommodations[accommodationIndex].imageUrls.length) % accommodations[accommodationIndex].imageUrls.length;
      return newIndexes;
    });
  };

  const handleNextImage = (accommodationIndex) => {
    setCurrentImageIndexes(prev => {
      const newIndexes = [...prev];
      newIndexes[accommodationIndex] = (newIndexes[accommodationIndex] + 1) % accommodations[accommodationIndex].imageUrls.length;
      return newIndexes;
    });
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (isCalculatingResults && justCompletedAllComparisons) {
    return <ResultsCalculation />;
  }

  if (comparisonCount >= maxComparisons) {
    return (
      <Container size="2">
        <Heading size="6" mb="4">Done! Thank you very much for your participation!</Heading>
        <Button onClick={() => navigate('/rankings')}>View Rankings</Button>
      </Container>
    );
  }

  const truncate = (str, n) => {
    return str.length > n ? str.substr(0, n-1) + '...' : str;
  };

  const ImageIndicator = ({ current, total }) => (
    <Box
      style={{
        position: 'absolute',
        bottom: '8px',
        right: '8px',
        background: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
      }}
    >
      {current + 1} / {total}
    </Box>
  );

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
              <Flex direction="column" style={{ height: '100%' }}>
                <Box style={{ position: 'relative', paddingTop: '56.25%' }}>
                  <Box style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    overflow: 'hidden'
                  }}>
                    <img
                      src={accommodation.imageUrls[currentImageIndexes[index]]}
                      alt={accommodation.name || 'Accommodation'}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleImageClick(index, currentImageIndexes[index])}
                    />
                    <ImageIndicator 
                      current={currentImageIndexes[index]} 
                      total={accommodation.imageUrls.length} 
                    />
                    <Button 
                      variant="ghost" 
                      style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }}
                      onClick={(e) => { e.stopPropagation(); handlePrevImage(index); }}
                    >
                      <ChevronLeft />
                    </Button>
                    <Button 
                      variant="ghost" 
                      style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
                      onClick={(e) => { e.stopPropagation(); handleNextImage(index); }}
                    >
                      <ChevronRight />
                    </Button>
                  </Box>
                </Box>
                <Flex direction="column" style={{ flex: 1, padding: 'var(--space-4)' }}>
                  <Box p="3">
                    <Heading aria-description={accommodation.name} size="3" mb="2">{truncate(accommodation.name, 50)}</Heading>
                    <Flex align="center" mb="2">
                      <MapPin size={16} />
                      <Text aria-description={accommodation.location} size="2" ml="1">{truncate(accommodation.location, 40)}</Text>
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
              </Flex>
            </Card>
            {showCarousel[index] && (
              <Carousel
                images={accommodation.imageUrls}
                currentIndex={currentImageIndexes[index]}
                onClose={() => handleCloseCarousel(index)}
                onPrev={() => handlePrevImage(index)}
                onNext={() => handleNextImage(index)}
              />
            )}
          </Box>
        ))}
      </Flex>
    </Container>
  );
};

export default Comparison;