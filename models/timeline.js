const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const timelineSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  adId: {
    type: Schema.Types.ObjectId,
    ref: 'Advertisement',
    required: true,
  },
  adName: {
    type: String,
    required: true,
  },
  locationName: {
    type: String,
    required: true,
  },
  timeOfDisplay: {
    type: Date,
    default: Date.now,  
  },
  deductedAmount: {
    type: Number,
    required: true,
    min: 0,
  },
});

const Timeline = mongoose.model('Timeline', timelineSchema);

module.exports = Timeline;
