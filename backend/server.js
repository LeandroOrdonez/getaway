const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./src/config/database');
const accommodationRoutes = require('./src/routes/accommodationRoutes');
const comparisonRoutes = require('./src/routes/comparisonRoutes');
const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const userRoutes = require('./src/routes/userRoutes'); 

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

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
  });
}).catch(err => {
  console.error('Unable to sync database:', err);
});

module.exports = app;