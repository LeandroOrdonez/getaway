// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { LocationProvider } from './contexts/LocationContext';
import { ToastProvider } from './contexts/ToastContext';
import { jwtDecode } from 'jwt-decode';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Comparison from './pages/Comparison';
import Rankings from './pages/Rankings';
import AdminInterface from './pages/AdminInterface';
import AccommodationDetail from './pages/AccommodationDetail';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import AutoLogin from './components/AutoLogin';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp > currentTime) {
            setUser({
              token,
              id: decodedToken.id,
              type: decodedToken.type,
              isAdmin: decodedToken.isAdmin,
              username: decodedToken.username,
              email: decodedToken.email
            });
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a more sophisticated loading component
  }

  return (
    <Router>
      <Theme appearance="light" accentColor="blue" grayColor="slate" radius="medium" scaling="100%">
        <ToastProvider>
          <LocationProvider>
            <Header user={user} setUser={setUser} />
            <Routes>
              <Route path="/" element={<Home user={user} />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/login/:uniqueUrl" element={<AutoLogin setUser={setUser} />} />
              <Route 
                path="/comparison" 
                element={user ? <Comparison /> : <Navigate to="/login" state={{ from: '/comparison' }} replace />} 
              />
              <Route path="/rankings" element={<Rankings />} />
              <Route 
                path="/admin" 
                element={user && user.isAdmin ? <AdminInterface /> : <Navigate to="/login" state={{ from: '/admin' }} replace />} 
              />
              <Route path="/accommodation/:id" element={<AccommodationDetail />} />
              <Route 
                path="/profile" 
                element={user ? <UserProfile /> : <Navigate to="/login" state={{ from: '/profile' }} replace />} 
              />
            </Routes>
            <Footer />
          </LocationProvider>
        </ToastProvider>
      </Theme>
    </Router>
  );
};

export default App;