import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { getUserComparisons } from '../services/api';
import ErrorAlert from '../components/ErrorAlert';

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

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Comparison History
      </Typography>
      <List>
        {comparisons.map((comparison, index) => (
          <React.Fragment key={comparison.id}>
            <ListItem>
              <ListItemText
                primary={`Comparison #${index + 1}`}
                secondary={`You preferred ${comparison.winnerAccommodation.name} over ${comparison.loserAccommodation.name}`}
              />
            </ListItem>
            {index < comparisons.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
      <ErrorAlert
        open={!!error}
        message={error}
        onClose={() => setError(null)}
      />
    </Container>
  );
};

export default UserProfile;