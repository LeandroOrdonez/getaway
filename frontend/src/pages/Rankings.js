// frontend/src/pages/Rankings.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Heading, Text, TextField, Button, Flex, Table, ScrollArea, Card } from '@radix-ui/themes';
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

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text color="red">{error}</Text>;

  return (
    <Container size="3">
      <Heading size="8" mb="4">Accommodation Rankings</Heading>
      <Card mb="4">
        <form onSubmit={handleSearch}>
          <Flex gap="3" align="center">
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
                    <Text>{accommodation.rating ? accommodation.rating : 'N/A'}</Text>
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
    </Container>
  );
};

export default Rankings;