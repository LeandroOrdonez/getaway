import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TextField, Rating, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { getRankings, searchRankings } from '../services/api';
import ErrorAlert from '../components/ErrorAlert';

const Rankings = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRankings = async (search = '') => {
    setLoading(true);
    try {
      const response = search ? await searchRankings(search) : await getRankings();
      setRankings(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch rankings. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = () => {
    fetchRankings(searchTerm);
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Accommodation Rankings
      </Typography>
      <TextField
        fullWidth
        label="Search accommodations"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '1rem' }}
      />
      <Button variant="contained" color="primary" onClick={handleSearch} style={{ marginBottom: '1rem' }}>
        Search
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Score</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rankings
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((accommodation, index) => (
                <TableRow key={accommodation.id}>
                  <TableCell component="th" scope="row">
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell>{accommodation.name}</TableCell>
                  <TableCell align="right">
                    <Rating value={accommodation.rating} readOnly precision={0.1} />
                    {accommodation.rating}
                  </TableCell>
                  <TableCell>
                    <Button component={Link} to={`/accommodation/${accommodation.id}`} variant="outlined" size="small">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rankings.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <ErrorAlert
        open={!!error}
        message={error}
        onClose={() => setError(null)}
      />
    </Container>
  );
};

export default Rankings;