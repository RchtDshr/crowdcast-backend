const mongoose = require('mongoose');

const advertisementSchema = new mongoose.Schema({
  adName: {
    type: String,
    required: true,
  },
  fileUpload: {
    type: String,  // Assuming you'll store the file path or URL as a string
    // required: true,
  },
  gender: {
    type: String,
    enum: ['M', 'F'],
    required: true,
  },
  locationName: {
    type: String,
    required: true,
  },
  ageGroup: {
    type: String,
    enum: ['1', '2', '3', '4', '5', '6', '7'],
    required: true,
  },
  creditsDeducted: {
    type: Number,
    min: 0,
    default: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

const Advertisement = mongoose.model('Advertisement', advertisementSchema);

module.exports = Advertisement;