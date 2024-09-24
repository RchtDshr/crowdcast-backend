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
    default: Date.now, 
    required: true,
  },
  ageGroup: {
    type: String,
    enum: ['1', '2', '3', '4', '5', '6', '7'],
    required: true,
  },
  deductedAmount: {
    type: Number,
    min: 0 
  }
});

const Timeline = mongoose.model('Timeline', timelineSchema);

module.exports = Timeline;
