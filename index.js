const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const adRoutes = require('./routes/adRoutes');
const displayRoutes = require('./routes/displayRoutes');
const { authenticate } = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// API Routes
app.use("/user", userRoutes);
app.use("/display", displayRoutes);
app.use("/api", authenticate, adRoutes);

// MongoDB Connection
const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB connected successfully');
    } catch (err) {
      console.error('MongoDB connection error:', err);
      throw new Error('Failed to connect to MongoDB');
    }
  }
};

connectDB();

// Export for Serverless
module.exports = app;
