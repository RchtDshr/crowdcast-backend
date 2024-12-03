const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const adRoutes = require('./routes/adRoutes');
const displayRoutes = require('./routes/displayRoutes');
const { authenticate } = require('./middleware/auth');

// Middleware for CORS
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://your-frontend-domain.vercel.app'], // Replace with your frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
    credentials: true, // Enable cookies or Authorization headers if needed
  })
);

// Explicitly handle preflight requests for all routes
app.options('*', cors());

// Middleware for parsing requests
app.use(bodyParser.json());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// API routes
app.use('/user', userRoutes);
app.use('/display', displayRoutes);
app.use('/api', authenticate, adRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
