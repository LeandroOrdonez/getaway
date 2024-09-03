import React from 'react';
import { Container, Typography, CircularProgress, Box } from '@mui/material';

const ResultsCalculation = () => (
  <Container>
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
      <CircularProgress size={60} thickness={4} />
      <Typography variant="h5" style={{ marginTop: '20px' }}>
        Please wait while we calculate your results...
      </Typography>
      <Typography variant="body1" style={{ marginTop: '10px' }}>
        You will be redirected to the rankings page shortly.
      </Typography>
    </Box>
  </Container>
);

export default ResultsCalculation;