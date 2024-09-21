const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Timeline schema
const timelineSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',  // References the User model
    required: true,
  },
  adId: {
    type: Schema.Types.ObjectId,
    ref: 'Advertisement',  // References the Advertisement model
    required: true,
  },
  locationName: {
    type: String,
    required: true,
  },
  timeOfDisplay: {
    type: Date,
    default: Date.now,  // Automatically sets the current time when an entry is created
    required: true,
  },
  deductedAmount: {
    type: Number,
    required: true,
    min: 0  // Ensures deducted amount cannot be negative
  }
});

const Timeline = mongoose.model('Timeline', timelineSchema);

module.exports = Timeline;
