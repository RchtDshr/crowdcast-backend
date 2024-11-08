const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,  // Ensures that each email is unique
    match: [/.+\@.+\..+/, 'Please enter a valid email address'],  // Email format validation
  },
  password: {
    type: String,
    required: true,
  },
  totalCredits: {
    type: Number,
    default: 0,  
    min: 0, 
  },
  adsPosted: [{
    type: Schema.Types.ObjectId,
    ref: 'Advertisement'  
  }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
