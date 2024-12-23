// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const sequelize = require('./src/config/database');
const accommodationRoutes = require('./src/routes/accommodationRoutes');
const comparisonRoutes = require('./src/routes/comparisonRoutes');
const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const userRoutes = require('./src/routes/userRoutes');
const geocodingRoutes = require('./src/routes/geocodingRoutes');

dotenv.config();

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

const uploadDir = process.env.UPLOAD_DIRECTORY || 'uploads';
app.use('/uploads', cors(corsOptions), express.static(path.join(__dirname, uploadDir)));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  next();
});

// Routes
app.use('/api/accommodations', accommodationRoutes);
app.use('/api/comparisons', comparisonRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/geocoding', geocodingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Serving uploads from: ${path.join(__dirname, uploadDir)}`);
  });
}).catch(err => {
  console.error('Unable to sync database:', err);
});

module.exports = app;