const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const unverifiedUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },
  otpExpiry: { type: Date },
});

module.exports = mongoose.model("UnverifiedUser", unverifiedUserSchema);