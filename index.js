const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
require('dotenv').config();
const userRoutes=require('./routes/userRoutes')
const adRoutes = require('./routes/adRoutes') 
const displayRoutes = require('./routes/displayRoutes') 
const { authenticate } = require('./middleware/auth');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

//Api
app.use("/user", userRoutes);
app.use("/display", displayRoutes);
app.use("/api", authenticate, adRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error:', err));


// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});