const mongoose = require('mongoose');

const advertisementSchema = new mongoose.Schema({
  advertisementName: {
    type: String,
    required: true,
  },
  fileUpload: {
    type: String,  // Assuming you'll store the file path or URL as a string
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],  // Optional: restrict to specific values
    required: true,
  },
  ageGroup: {
    type: String,
    enum: ['Child', 'Teen', 'Adult', 'Senior'],  // You can modify these values based on the age groups
    required: true,
  },
  creditsDeducted: {
    type: Number,
    required: true,
    min: 0,  // Ensuring that credits deducted can't be negative
  },
});

const Advertisement = mongoose.model('Advertisement', advertisementSchema);

module.exports = Advertisement;