const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define valid age groups and gender values based on your provided structure
const validAgeGroups = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
];

const validGenders = [
  "M", // Male
  "F", // Female
];

// Sub-schema to store age group, gender, and advertisement IDs
const adGroupingSchema = new Schema(
  {
    ageGroup: {
      type: String,
      enum: validAgeGroups, // Restrict ageGroup to predefined values
      required: true,
    },
    gender: {
      type: String,
      enum: validGenders, // Restrict gender to predefined values
      required: true,
    },
    adIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Advertisement", // References the Advertisement model
      },
    ],
  },
  {
    _id: false, // We don't need a separate _id for each grouping entry
  }
);

// Main Location schema
const locationSchema = new Schema({
  locationName: {
    type: String,
    required: true,
  },
  adGroupings: [adGroupingSchema], // Array of ageGroup + gender + adIds
});

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
