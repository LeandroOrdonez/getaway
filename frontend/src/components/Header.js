import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flex, Button, Text } from '@radix-ui/themes';

const Header = () => {
  const isLoggedIn = !!localStorage.getItem('token');
  const isAdmin = localStorage.getItem('userType') === 'admin';
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
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
          <Link to="/comparison">Compare</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/rankings">Rankings</Link>
        </Button>
        {isLoggedIn ? (
          <>
            <Button variant="ghost" asChild>
              <Link to="/profile">Profile</Link>
            </Button>
            {isAdmin && (
              <Button variant="ghost" asChild>
                <Link to="/admin">Admin</Link>
              </Button>
            )}
            <Button variant="soft" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Button variant="soft" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button variant="soft" asChild>
              <Link to="/register">Register</Link>
            </Button>
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default Header;