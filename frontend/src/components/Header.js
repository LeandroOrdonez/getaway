// frontend/src/components/Header.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flex, Button, Text, Box, DropdownMenu } from '@radix-ui/themes';
import { Menu, X, LogOut, Home, BarChart, GitCompare, User } from 'lucide-react';

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
    setIsMenuOpen(false);
  };

  const menuItems = [
    { label: 'Home', icon: <Home size={16} />, path: '/' },
    { label: 'Rankings', icon: <BarChart size={16} />, path: '/rankings' },
    { label: 'Compare', icon: <GitCompare size={16} />, path: '/comparison' },
    { label: 'Profile', icon: <User size={16} />, path: '/profile' },
  ];

  if (user && user.isAdmin) {
    menuItems.push({ label: 'Admin', icon: <User size={16} />, path: '/admin' });
  }

  const renderMenuItems = () => (
    <>
      {menuItems.map((item) => (
        <DropdownMenu.Item key={item.path} onSelect={() => { navigate(item.path); setIsMenuOpen(false); }}>
          <Flex align="center" gap="2">
            {item.icon}
            {item.label}
          </Flex>
        </DropdownMenu.Item>
      ))}
      {user ? (
        <DropdownMenu.Item color="red" onSelect={handleLogout}>
          <Flex align="center" gap="2">
            <LogOut size={16} />
            Logout
          </Flex>
        </DropdownMenu.Item>
      ) : (
        <DropdownMenu.Item onSelect={() => { navigate('/login'); setIsMenuOpen(false); }}>
          <Flex align="center" gap="2">
            <LogOut size={16} />
            Login
          </Flex>
        </DropdownMenu.Item>
      )}
    </>
  );

  return (
    <Flex as="header" p="4" justify="between" align="center">
      <Text size="5" weight="bold">Getaway Match</Text>
      <Box display={{ initial: 'none', sm: 'block' }}>
        <Flex as="nav" align="center" gap="3">
          {menuItems.map((item) => (
            <Button key={item.path} variant="ghost" asChild>
              <Link to={item.path}>{item.label}</Link>
            </Button>
          ))}
          {user ? (
            <Button variant="soft" onClick={handleLogout}>Logout</Button>
          ) : (
            <Button variant="soft" asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}
        </Flex>
      </Box>
      <Box display={{ initial: 'block', sm: 'none' }}>
        <DropdownMenu.Root open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenu.Trigger asChild>
            <Button variant="ghost" size="3">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end">
            {renderMenuItems()}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Box>
    </Flex>
  );
};

export default Header;