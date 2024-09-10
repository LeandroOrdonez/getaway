// frontend/src/pages/UserProfile.js
import React, { useState, useEffect } from 'react';
import { Container, Heading, Text, Card, Flex, Avatar, Table, ScrollArea } from '@radix-ui/themes';
import { PersonIcon } from '@radix-ui/react-icons';
import { getUserComparisons } from '../services/api';

const UserProfile = () => {
  const [comparisons, setComparisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserComparisons = async () => {
      try {
        const response = await getUserComparisons();
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

  return (
    <Container size="2">
      <Card mb="4">
        <Flex align="center" gap="4">
          <Avatar size="5" fallback={<PersonIcon />} />
          <Flex direction="column">
            <Heading size="6">Your Profile</Heading>
            <Text size="2" color="gray">Welcome back! Here's a summary of your comparisons.</Text>
          </Flex>
        </Flex>
      </Card>

      <Heading size="5" mb="2">Your Comparison History</Heading>
      <ScrollArea>
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Comparison</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Winner</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Loser</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {comparisons.map((comparison, index) => (
              <Table.Row key={comparison.id}>
                <Table.Cell>#{index + 1}</Table.Cell>
                <Table.Cell>{comparison.winnerAccommodation.name}</Table.Cell>
                <Table.Cell>{comparison.loserAccommodation.name}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </ScrollArea>
      {comparisons.length === 0 && (
        <Text color="gray" align="center" mt="4">
          You haven't made any comparisons yet. Start comparing accommodations to see your history!
        </Text>
      )}
    </Container>
  );
};

export default UserProfile;