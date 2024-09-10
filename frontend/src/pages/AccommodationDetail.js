// frontend/src/pages/AccommodationDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Heading, Text, Card, Flex, Button, Badge, AspectRatio, Inset } from '@radix-ui/themes';
import { StarFilledIcon } from '@radix-ui/react-icons';
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

  if (loading) return <Text>Loading...</Text>;
  if (!accommodation) return <Text>Accommodation not found</Text>;

  return (
    <Container size="3">
      <Card size="3">
        <Inset clip="padding-box" side="top" pb="current">
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
        </Inset>
        <Flex direction="column" gap="3">
          <Heading size="6">{accommodation.name}</Heading>
          <Text size="3" color="gray">Location: {accommodation.location}</Text>
          <Text size="4">Price per night: ${accommodation.pricePerNight}</Text>
          <Text size="4">Number of rooms: {accommodation.numRooms}</Text>
          <Flex align="center" gap="1">
            <StarFilledIcon />
            <Text size="3">{accommodation.rating}</Text>
          </Flex>
          <Flex wrap="wrap" gap="2">
            {accommodation.facilities.map((facility, index) => (
              <Badge key={index} size="1">{facility}</Badge>
            ))}
          </Flex>
          <Button asChild>
            <a href={accommodation.originalListingUrl} target="_blank" rel="noopener noreferrer">
              View Original Listing
            </a>
          </Button>
        </Flex>
      </Card>
    </Container>
  );
};

export default AccommodationDetail;