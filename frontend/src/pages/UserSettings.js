import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Grid } from '@mui/material';
import { getUserSettings, updateUserSettings } from '../services/api';
import ErrorAlert from '../components/ErrorAlert';

const UserSettings = () => {
  const [settings, setSettings] = useState({
    username: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getUserSettings();
        setSettings(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user settings. Please try again later.');
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserSettings(settings);
      setSuccess(true);
    } catch (err) {
      setError('Failed to update settings. Please try again.');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        User Settings
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={settings.username}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={settings.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </form>
      {success && (
        <Typography color="success" style={{ marginTop: '1rem' }}>
          Settings updated successfully!
        </Typography>
      )}
      <ErrorAlert
        open={!!error}
        message={error}
        onClose={() => setError(null)}
      />
    </Container>
  );
};

export default UserSettings;