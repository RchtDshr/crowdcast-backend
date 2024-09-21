const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define valid age groups and gender values based on your provided structure
const validAgeGroups = [
  '3-9', '10-19', '20-29', '30-39', '40-49', '50-59', '60-70'
];

const validGenders = [
  'Male',  // Male
  'Female',  // Female
  'Other'   // Other
];

// Sub-schema to store age group, gender, and advertisement IDs
const adGroupingSchema = new Schema({
  ageGroup: {
    type: String,
    enum: validAgeGroups,  // Restrict ageGroup to predefined values
    required: true,
  },
  gender: {
    type: String,
    enum: validGenders,  // Restrict gender to predefined values
    required: true,
  },
  adIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Advertisement',  // References the Advertisement model
  }]
}, {
  _id: false  // We don't need a separate _id for each grouping entry
});

// Main Location schema
const locationSchema = new Schema({
  locationName: {
    type: String,
    required: true,
  },
  adGroupings: [adGroupingSchema],  // Array of ageGroup + gender + adIds
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt fields
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
