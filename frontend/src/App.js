import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { LocationProvider } from './contexts/LocationContext';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Comparison from './pages/Comparison';
import Login from './pages/Login';
import Register from './pages/Register';
import GuestSession from './pages/GuestSession';
import Rankings from './pages/Rankings';
import UserProfile from './pages/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import AccommodationDetail from './pages/AccommodationDetail';
import UserSettings from './pages/UserSettings';
import AdminInterface from './pages/AdminInterface';

const ProtectedAdminRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const isAdmin = localStorage.getItem('userType') === 'admin';

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Theme appearance="light" accentColor="blue" grayColor="slate" radius="medium" scaling="100%">
      <LocationProvider>
        <Router>
          <div className="App">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/comparison" element={
                <ProtectedRoute>
                  <Comparison />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/guest" element={<GuestSession />} />
              <Route path="/rankings" element={<Rankings />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } />
              <Route path="/accommodation/:id" element={<AccommodationDetail />} />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <UserSettings />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedAdminRoute>
                  <AdminInterface />
                </ProtectedAdminRoute>
              } />
            </Routes>
            <Footer />
          </div>
        </Router>
      </LocationProvider>
    </Theme>
  );
}

export default App;