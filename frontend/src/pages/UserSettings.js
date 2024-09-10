// frontend/src/pages/UserSettings.js
import React, { useState, useEffect } from 'react';
import { Container, Heading, Text, TextField, Button, Flex, Card, Box } from '@radix-ui/themes';
import { PersonIcon, EnvelopeClosedIcon, CheckIcon } from '@radix-ui/react-icons';
import { getUserSettings, updateUserSettings } from '../services/api';

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
    setError(null);
    setSuccess(false);
    try {
      await updateUserSettings(settings);
      setSuccess(true);
    } catch (err) {
      setError('Failed to update settings. Please try again.');
    }
  };

  if (loading) return <Text>Loading...</Text>;

  return (
    <Container size="1">
      <Card>
        <Flex direction="column" gap="4" style={{ maxWidth: 400, margin: '0 auto' }}>
          <Heading size="6" align="center">User Settings</Heading>
          <Text size="2" color="gray" align="center">
            Update your account information below.
          </Text>
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="3">
              <TextField.Root>
                <TextField.Slot>
                  <PersonIcon height="16" width="16" />
                </TextField.Slot>
                <TextField.Input 
                  placeholder="Username"
                  name="username"
                  value={settings.username}
                  onChange={handleChange}
                  required
                />
              </TextField.Root>
              <TextField.Root>
                <TextField.Slot>
                  <EnvelopeClosedIcon height="16" width="16" />
                </TextField.Slot>
                <TextField.Input 
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={settings.email}
                  onChange={handleChange}
                  required
                />
              </TextField.Root>
              <Button type="submit">Save Changes</Button>
            </Flex>
          </form>
          {success && (
            <Flex align="center" gap="2">
              <CheckIcon color="green" />
              <Text color="green" size="2">Settings updated successfully!</Text>
            </Flex>
          )}
          {error && (
            <Text color="red" size="2">
              {error}
            </Text>
          )}
        </Flex>
      </Card>
    </Container>
  );
};

export default UserSettings;