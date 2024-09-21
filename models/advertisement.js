const mongoose = require('mongoose');

const advertisementSchema = new mongoose.Schema({
  adName: {
    type: String,
    required: true,
  },
  fileUpload: {
    type: String,  // Assuming you'll store the file path or URL as a string
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'], 
    required: true,
  },
  locationName: {
    type: String,
    required: true,
  },
  ageGroup: {
    type: String,
    enum: ['3-9', '10-19', '20-29', '30-39', '40-49', '50-59', '60-70'],
    required: true,
  },
  creditsDeducted: {
    type: Number,
    min: 0,  
    default: 0
  },
});

const Advertisement = mongoose.model('Advertisement', advertisementSchema);

module.exports = Advertisement;