// frontend/src/components/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flex, Button, Text } from '@radix-ui/themes';

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <Flex as="header" p="4" justify="between" align="center">
      <Text size="5" weight="bold">Getaway Match</Text>
      <Flex as="nav" gap="3">
        <Button variant="ghost" asChild>
          <Link to="/">Home</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/rankings">Rankings</Link>
        </Button>
        {user ? (
          <>
            <Button variant="ghost" asChild>
              <Link to="/comparison">Compare</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/profile">Profile</Link>
            </Button>
            {user.role === 'admin' && (
              <Button variant="ghost" asChild>
                <Link to="/admin">Admin</Link>
              </Button>
            )}
            <Button variant="soft" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <Text size="2">Please use your unique URL to log in</Text>
        )}
      </Flex>
    </Flex>
  );
};

export default Header;