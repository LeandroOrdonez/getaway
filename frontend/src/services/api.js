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

export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (username, email, password) => api.post('/auth/register', { username, email, password });
export const startGuestSession = (name) => api.post('/auth/guest', { name });
export const getRandomPair = () => api.get('/comparisons/random-pair');
export const submitComparison = (winnerAccommodationId, loserAccommodationId) => 
  api.post('/comparisons/submit', { winnerAccommodationId, loserAccommodationId });
export const getRankings = () => api.get('/comparisons/rankings');
export const getUserComparisons = () => api.get('/users/comparisons');
export const getAccommodationDetails = (id) => api.get(`/accommodations/${id}`);
export const searchRankings = (searchTerm) => api.get(`/comparisons/rankings?search=${searchTerm}`);
export const createAccommodation = (data) => api.post('/accommodations', data);
export const calculateDrivingDistance = (origin, destination) => 
  api.post('/accommodations/calculate-distance', { origin, destination });

export const getUserSettings = () => api.get('/users/settings');
export const updateUserSettings = (settings) => api.put('/users/settings', settings);

export default api;