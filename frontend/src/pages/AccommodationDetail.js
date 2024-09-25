// frontend/src/pages/AccommodationDetail.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Heading, Text, Card, Flex, Button, Badge, AspectRatio, Grid, Box, Separator } from '@radix-ui/themes';
import { Star, DollarSign, Bed, Car, ExternalLink, MapPin } from 'lucide-react';
import { getAccommodationDetails, calculateDrivingDistance } from '../services/api';
import { LocationContext } from '../contexts/LocationContext';
import Carousel from '../components/Carousel';

const AccommodationDetail = () => {
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCarousel, setShowCarousel] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [drivingInfo, setDrivingInfo] = useState(null);
  const { id } = useParams();
  const { location } = useContext(LocationContext);

  useEffect(() => {
    const fetchAccommodationDetails = async () => {
      try {
        const response = await getAccommodationDetails(id);
        const data = response.data;
        console.log('Accommodation data:', data);
        data.facilities = Array.isArray(data.facilities) 
          ? data.facilities 
          : (typeof data.facilities === 'string' ? JSON.parse(data.facilities) : []);
        setAccommodation(data);
        setLoading(false);

        // Fetch driving distance and duration
        if (location && location.place_name) {
          const distanceResponse = await calculateDrivingDistance(location.place_name, data.location);
          setDrivingInfo({
            distance: `${distanceResponse.data.distance.toFixed(1)} km`,
            duration: `${distanceResponse.data.duration.toFixed(0)} mins`
          });
        }
      } catch (error) {
        console.error('Error fetching accommodation details:', error);
        setLoading(false);
      }
    };

    fetchAccommodationDetails();
  }, [id, location]);

  if (loading) return <Text>Loading...</Text>;
  if (!accommodation) return <Text>Accommodation not found</Text>;

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setShowCarousel(true);
  };

  const handleCloseCarousel = () => setShowCarousel(false);
  const handlePrevImage = () => setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? accommodation.imageUrls.length - 1 : prevIndex - 1));
  const handleNextImage = () => setCurrentImageIndex((prevIndex) => (prevIndex === accommodation.imageUrls.length - 1 ? 0 : prevIndex + 1));

  const ImageGallery = () => (
    <Box>
      <AspectRatio ratio={16/9}>
        <img
          src={accommodation.imageUrls[0]}
          alt={accommodation.name}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            cursor: 'pointer',
          }}
          onClick={() => handleImageClick(0)}
        />
      </AspectRatio>
      <Grid columns="4" gap="2" mt="2">
        {accommodation.imageUrls.slice(1, 5).map((imageUrl, index) => (
          <AspectRatio key={index} ratio={1/1}>
            <Box style={{ position: 'relative' }}>
              <img
                src={imageUrl}
                alt={`${accommodation.name} ${index + 2}`}
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%',
                  cursor: 'pointer',
                }}
                onClick={() => handleImageClick(index + 1)}
              />
              {index === 3 && accommodation.imageUrls.length > 5 && (
                <Box
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleImageClick(4)}
                >
                  <Text style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    +{accommodation.imageUrls.length - 5}
                  </Text>
                </Box>
              )}
            </Box>
          </AspectRatio>
        ))}
      </Grid>
    </Box>
  );

  const AccommodationInfo = () => (
    <Box>
      <Heading size="6" mb="2">{accommodation.name}</Heading>
      <Flex align="center" mb="3">
        <MapPin size={24} />
        <Text size="3" ml="2">{accommodation.location}</Text>
      </Flex>
      <Separator size="4" mb="3" />
      <Grid columns="3" gap="4" mb="3">
        <Flex direction="column" align="center">
          <DollarSign size={24} />
          <Text weight="bold" size="5">${accommodation.pricePerNight}</Text>
          <Text size="2">per night</Text>
        </Flex>
        <Flex direction="column" align="center">
          <Bed size={24} />
          <Text weight="bold" size="5">{accommodation.numRooms}</Text>
          <Text size="2">rooms</Text>
        </Flex>
        <Flex direction="column" align="center">
          <Star size={24} />
          <Text weight="bold" size="5">{accommodation.rating}</Text>
          <Text size="2">rating</Text>
        </Flex>
      </Grid>
      <Separator size="4" mb="3" />
      {drivingInfo && (
        <Box mb="3">
          <Heading size="4" mb="2">Distance from Your Location</Heading>
          <Flex align="center">
            <Car size={16} />
            <Text size="3" ml="2">
              {drivingInfo.distance} ({drivingInfo.duration} drive)
            </Text>
          </Flex>
        </Box>
      )}
      <Box mb="3">
        <Heading size="4" mb="2">Facilities</Heading>
        <Flex wrap="wrap" gap="2">
          {accommodation.facilities.map((facility, index) => (
            <Badge key={index} size="2">{facility}</Badge>
          ))}
        </Flex>
      </Box>
      
      <Button size="3" asChild>
        <a href={accommodation.originalListingUrl} target="_blank" rel="noopener noreferrer">
          View Original Listing
          <ExternalLink size={16} style={{ marginLeft: '8px' }} />
        </a>
      </Button>
    </Box>
  );

  return (
    <Flex 
      justify="center" 
      align="top" 
      style={{ 
        padding: '20px',
      }}
    >
      <Card 
        size="3" 
        style={{ 
          width: '100%',
          maxWidth: '1200px',
        }}
      >
        <Flex
          direction={{ initial: 'column', md: 'row' }}
          gap="4"
        >
          <Box style={{ flex: 3.5 }}>
            <ImageGallery />
          </Box>
          <Box style={{ flex: 1.5 }}>
            <AccommodationInfo />
          </Box>
        </Flex>
      </Card>
      {showCarousel && (
        <Carousel
          images={accommodation.imageUrls}
          currentIndex={currentImageIndex}
          onClose={handleCloseCarousel}
          onPrev={handlePrevImage}
          onNext={handleNextImage}
        />
      )}
    </Flex>
  );
};

export default AccommodationDetail;