import React from 'react';
import { Container, Flex, Text, Heading, Box } from '@radix-ui/themes';
import { ReloadIcon } from '@radix-ui/react-icons';
import '../styles/ResultsCalculation.css';

const ResultsCalculation = () => (
  <Container size="2">
    <Flex direction="column" align="center" justify="center" style={{ minHeight: '60vh' }}>
      <Box mb="4">
        <ReloadIcon height="48" width="48" className="spinning" />
      </Box>
      <Heading size="6" mb="2">
        Calculating Your Results
      </Heading>
      <Text size="3" align="center" color="gray">
        Please wait while we process your comparisons...
      </Text>
      <Text size="2" align="center" color="gray" mt="2">
        You will be redirected to the rankings page shortly.
      </Text>
    </Flex>
  </Container>
);

export default ResultsCalculation;