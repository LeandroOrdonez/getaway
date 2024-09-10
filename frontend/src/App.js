// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from 'react-router-dom';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { LocationProvider } from './contexts/LocationContext';
import { jwtDecode } from 'jwt-decode'; // Corrected import
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Comparison from './pages/Comparison';
import Rankings from './pages/Rankings';
import AdminInterface from './pages/AdminInterface';
import AccommodationDetail from './pages/AccommodationDetail';
import UserProfile from './pages/UserProfile';
import { autoLogin } from './services/api';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Use jwtDecode instead of jwt_decode
        const currentTime = Date.now() / 1000; // Convert to seconds
        if (decodedToken.exp > currentTime) {
          // Token is still valid
          setUser({
            token,
            id: decodedToken.id,
            type: decodedToken.type,
            isAdmin: decodedToken.isAdmin
          });
        } else {
          // Token has expired
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleAutoLogin = async (uniqueUrl) => {
    try {
      const response = await autoLogin(uniqueUrl);
      localStorage.setItem('token', response.data.token);
      const decodedToken = jwtDecode(response.data.token); // Use jwtDecode here as well
      setUser({
        token: response.data.token,
        id: decodedToken.id,
        type: decodedToken.type,
        isAdmin: decodedToken.isAdmin
      });
    } catch (error) {
      console.error('Auto-login failed:', error);
    }
  };

  return (
    <Router>
      <Theme appearance="light" accentColor="blue" grayColor="slate" radius="medium" scaling="100%">
        <LocationProvider>
          <Header user={user} setUser={setUser} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login/:uniqueUrl" element={<AutoLogin handleAutoLogin={handleAutoLogin} />} />
            <Route 
              path="/comparison" 
              element={user ? <Comparison /> : <Navigate to="/" replace />} 
            />
            <Route path="/rankings" element={<Rankings />} />
            <Route 
              path="/admin" 
              element={user && user.isAdmin ? <AdminInterface /> : <Navigate to="/" replace />} 
            />
            <Route path="/accommodation/:id" element={<AccommodationDetail />} />
            <Route 
              path="/profile" 
              element={user ? <UserProfile /> : <Navigate to="/" replace />} 
            />
          </Routes>
          <Footer />
        </LocationProvider>
      </Theme>
    </Router>
  );
};

const AutoLogin = ({ handleAutoLogin }) => {
  const { uniqueUrl } = useParams();
  
  useEffect(() => {
    handleAutoLogin(uniqueUrl);
  }, [uniqueUrl, handleAutoLogin]);

  return <div>Logging in...</div>;
};

export default App;