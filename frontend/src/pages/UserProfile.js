// frontend/src/pages/UserProfile.js
import React, { useState, useEffect } from 'react';
import { Container, Heading, Text, Card, Flex, Avatar, Table, ScrollArea, Box, Separator } from '@radix-ui/themes';
import { PersonIcon, StarIcon } from '@radix-ui/react-icons';
import { getUserComparisons } from '../services/api';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const [comparisons, setComparisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserComparisons = async () => {
      try {
        const response = await getUserComparisons();
        console.log('User comparisons:', response.data);
        setComparisons(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user comparisons. Please try again later.');
        setLoading(false);
      }
    };

    fetchUserComparisons();
  }, []);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text color="red">{error}</Text>;

  const ComparisonItem = ({ comparison, index }) => (
    <Card mb="3">
      <Flex direction="column" gap="2">
        <Flex align="center" justify="between">
          <Text weight="bold">Comparison #{index + 1}</Text>
          <Text size="2" color="gray">{new Date(comparison.createdAt).toLocaleDateString()}</Text>
        </Flex>
        <Separator size="4" />
        <Flex direction="column" gap="2">
          <Flex align="center" gap="2">
            <StarIcon color="gold" />
            <Link to={`/accommodation/${comparison.winnerAccommodation.id}`} style={{textDecoration: 'none'}}>
              <Text>Winner: {comparison.winnerAccommodation.name}</Text>
            </Link>
          </Flex>
          <Text size="2" color="gray">vs</Text>
          <Link to={`/accommodation/${comparison.loserAccommodation.id}`} style={{textDecoration: 'none'}}>
            <Text>Runner-up: {comparison.loserAccommodation.name}</Text>
          </Link>
        </Flex>
      </Flex>
    </Card>
  );

  return (
    <Container size={{ initial: '1', sm: '2', md: '3' }} px="3">
      <Flex direction="column" gap="4" my="4">
        <Card>
          <Flex align="center" gap="4">
            <Avatar size="6" fallback={<PersonIcon width="24" height="24" />} />
            <Box>
              <Heading size="6">Your Profile</Heading>
              <Text size="2" color="gray">Welcome back! Here's a summary of your comparisons.</Text>
            </Box>
          </Flex>
        </Card>

        <Heading size="5">Your Comparison History</Heading>
        
        <Box display={{ initial: 'block', md: 'none' }}>
          {comparisons.map((comparison, index) => (
            <ComparisonItem key={comparison.id} comparison={comparison} index={index} />
          ))}
        </Box>

        <Box display={{ initial: 'none', md: 'block' }}>
          <ScrollArea>
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Comparison</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Winner</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Runner-up</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {comparisons.map((comparison, index) => (
                <Table.Row key={comparison.id}>
                  <Table.Cell>#{index + 1}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/accommodation/${comparison.winnerAccommodation.id}`} style={{textDecoration: 'none'}}>
                      {comparison.winnerAccommodation.name}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/accommodation/${comparison.loserAccommodation.id}`} style={{textDecoration: 'none'}}>
                      {comparison.loserAccommodation.name}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{new Date(comparison.createdAt).toLocaleDateString()}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
          </ScrollArea>
        </Box>

        {comparisons.length === 0 && (
          <Text color="gray" align="center" mt="4">
            You haven't made any comparisons yet. Start comparing accommodations to see your history!
          </Text>
        )}
      </Flex>
    </Container>
  );
};

export default UserProfile;