// src/components/Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

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
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Country House Comparison
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/comparison">
          Compare
        </Button>
        <Button color="inherit" component={Link} to="/rankings">
          Rankings
        </Button>
        {isLoggedIn ? (
          <>
            <Button color="inherit" component={Link} to="/profile">
              Profile
            </Button>
            {isAdmin && (
              <Button color="inherit" component={Link} to="/admin">
                Admin
              </Button>
            )}
            <Button 
              color="inherit" 
              onClick={handleLogout}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;