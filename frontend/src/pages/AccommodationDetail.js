// frontend/src/pages/AccommodationDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Heading, Text, Card, Flex, Button, Badge, AspectRatio, Grid, Box, Separator, Dialog } from '@radix-ui/themes';
import { Star, DollarSign, Bed, Car, ExternalLink, MapPin, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getAccommodationDetails } from '../services/api';

const Carousel = ({ images, currentIndex, onClose, onPrev, onNext }) => (
  <Dialog.Root open={true} onOpenChange={onClose}>
    <Dialog.Content style={{ maxWidth: '90vw', height: '90vh' }}>
      <Flex direction="column" style={{ height: '100%' }}>
        <Flex justify="between" align="center" mb="4">
          <Text size="5">Image Gallery</Text>
          <Dialog.Close>
            <Button variant="ghost" size="1">
              <X size={24} />
            </Button>
          </Dialog.Close>
        </Flex>
        <Flex grow="1" align="center" justify="center">
          <Button variant="ghost" size="3" onClick={onPrev}>
            <ChevronLeft size={24} />
          </Button>
          <Box style={{ maxHeight: '100%', maxWidth: 'calc(100% - 120px)' }}>
            <img 
              src={images[currentIndex]} 
              alt={`Accommodation ${currentIndex + 1}`}
              style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
            />
          </Box>
          <Button variant="ghost" size="3" onClick={onNext}>
            <ChevronRight size={24} />
          </Button>
        </Flex>
        <Text align="center" mt="4">{currentIndex + 1} / {images.length}</Text>
      </Flex>
    </Dialog.Content>
  </Dialog.Root>
);

const AccommodationDetail = () => {
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCarousel, setShowCarousel] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

  if (loading) return <Text>Loading...</Text>;
  if (!accommodation) return <Text>Accommodation not found</Text>;

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setShowCarousel(true);
  };

  const handleCloseCarousel = () => setShowCarousel(false);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? accommodation.imageUrls.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === accommodation.imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <Container size="3">
      <Card size="3">
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
            </AspectRatio>
          ))}
        </Grid>
        <Box p="4">
          <Heading size="6" mb="2">{accommodation.name}</Heading>
          <Flex align="center" mb="3">
            <MapPin size={16} />
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
          <Box mb="3">
            <Heading size="4" mb="2">Facilities</Heading>
            <Flex wrap="wrap" gap="2">
              {accommodation.facilities.map((facility, index) => (
                <Badge key={index} size="2">{facility}</Badge>
              ))}
            </Flex>
          </Box>
          {accommodation.drivingDistance && (
            <Box mb="3">
              <Heading size="4" mb="2">Distance</Heading>
              <Flex align="center">
                <Car size={16} />
                <Text size="3" ml="2">
                  {accommodation.drivingDistance} ({accommodation.drivingDuration} drive)
                </Text>
              </Flex>
            </Box>
          )}
          <Button size="3" asChild>
            <a href={accommodation.originalListingUrl} target="_blank" rel="noopener noreferrer">
              View Original Listing
              <ExternalLink size={16} style={{ marginLeft: '8px' }} />
            </a>
          </Button>
        </Box>
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
    </Container>
  );
};

export default AccommodationDetail;