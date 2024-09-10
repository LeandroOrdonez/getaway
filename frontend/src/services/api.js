// frontend/src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Remove login, register, and startGuestSession functions

export const autoLogin = (uniqueUrl) => api.get(`/auth/auto-login/${uniqueUrl}`);
export const registerUser = (userData) => api.post('/auth/register', userData);
export const listUsers = () => api.get('/users/list');

// Keep other existing functions

export const getRandomPair = () => api.get('/comparisons/random-pair');
export const submitComparison = (winnerAccommodationId, loserAccommodationId) => 
  api.post('/comparisons/submit', { winnerAccommodationId, loserAccommodationId });
export const getComparisonCount = () => api.get('/comparisons/count');
export const getRankings = () => api.get('/comparisons/rankings');
export const getUserComparisons = () => api.get('/users/comparisons');
export const getAccommodationDetails = (id) => api.get(`/accommodations/${id}`);
export const searchRankings = (searchTerm) => api.get(`/comparisons/rankings?search=${searchTerm}`);
export const createAccommodation = (data) => api.post('/accommodations', data);

export const getUserSettings = () => api.get('/users/settings');
export const updateUserSettings = (settings) => api.put('/users/settings', settings);

export const forwardGeocode = (address) => api.get(`/geocoding/forward?address=${encodeURIComponent(address)}`);
export const reverseGeocode = (lng, lat) => api.get(`/geocoding/reverse?lng=${lng}&lat=${lat}`);
export const calculateDrivingDistance = (from, to) => 
  api.get(`/geocoding/driving-distance?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);

export default api;