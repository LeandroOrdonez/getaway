// frontend/src/pages/Rankings.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Heading, Text, TextField, Button, Flex, Table, ScrollArea, Card, Box } from '@radix-ui/themes';
import { MagnifyingGlassIcon, StarFilledIcon } from '@radix-ui/react-icons';
import { getRankings, searchRankings } from '../services/api';

const Rankings = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRankings = async (search = '') => {
    setLoading(true);
    try {
      const response = search 
        ? await searchRankings(search)
        : await getRankings();
      setRankings(response.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching rankings:', err);
      setError('Failed to fetch rankings. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRankings(searchTerm);
  };

  const formatRating = (rating) => {
    const ratingNumber = parseFloat(rating);
    return ratingNumber.toFixed(1);
  };

  const RankingItem = ({ accommodation, index }) => (
    <Card mb="3">
      <Flex align="center" justify="between">
        <Flex align="center" gap="3">
          <Text size="5" weight="bold">{index + 1}</Text>
          <Box>
            <Text weight="bold">{accommodation.name}</Text>
            <Flex align="center" gap="1">
              <StarFilledIcon />
              <Text>{formatRating(accommodation.rating)}</Text>
            </Flex>
          </Box>
        </Flex>
        <Button asChild variant="soft" size="2">
          <Link to={`/accommodation/${accommodation.id}`}>View Details</Link>
        </Button>
      </Flex>
    </Card>
  );

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text color="red">{error}</Text>;

  return (
    <Container size={{ initial: '1', sm: '2', md: '3' }}>
      <Heading size={{ initial: '6', sm: '7', md: '8' }} align="center" mb="4">Accommodation Rankings</Heading>
      
      <Card mb="4">
        <form onSubmit={handleSearch}>
          <Flex gap="3" direction={{ initial: 'column', sm: 'row' }}>
            <TextField.Root flex="1">
              <TextField.Slot>
                <MagnifyingGlassIcon height="16" width="16" />
              </TextField.Slot>
              <TextField.Input 
                placeholder="Search accommodations"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </TextField.Root>
            <Button type="submit">Search</Button>
          </Flex>
        </form>
      </Card>

      <Box display={{ initial: 'block', md: 'none' }}>
        {rankings.map((accommodation, index) => (
          <RankingItem key={accommodation.id} accommodation={accommodation} index={index} />
        ))}
      </Box>

      <Box display={{ initial: 'none', md: 'block' }}>
        <ScrollArea>
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Rank</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Score</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {rankings.map((accommodation, index) => (
                <Table.Row key={accommodation.id}>
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>{accommodation.name}</Table.Cell>
                  <Table.Cell>
                    <Flex align="center" gap="1">
                      <StarFilledIcon />
                      <Text>{formatRating(accommodation.rating)}</Text>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Button asChild variant="soft" size="1">
                      <Link to={`/accommodation/${accommodation.id}`}>View Details</Link>
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </ScrollArea>
      </Box>
    </Container>
  );
};

export default Rankings;