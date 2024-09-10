// frontend/src/components/AutoLogin.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { autoLogin } from '../services/api';
import { Text } from '@radix-ui/themes';

const AutoLogin = ({ setUser }) => {
  const { uniqueUrl } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const performAutoLogin = async () => {
      try {
        const response = await autoLogin(uniqueUrl);
        const { token } = response.data;
        localStorage.setItem('token', token);
        
        const decodedToken = jwtDecode(token);
        setUser({
          token,
          id: decodedToken.id,
          type: decodedToken.type,
          isAdmin: decodedToken.isAdmin,
          username: decodedToken.username,
          email: decodedToken.email
        });

        // Redirect based on user type
        if (decodedToken.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Auto-login failed:', error);
        setError('Auto-login failed. Please try again or use regular login.');
        // Optionally, redirect to regular login page after a delay
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    performAutoLogin();
  }, [uniqueUrl, setUser, navigate]);

  if (error) {
    return <Text color="red">{error}</Text>;
  }

  return <Text>Logging in...</Text>;
};

export default AutoLogin;