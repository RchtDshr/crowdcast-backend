const UnverifiedUser = require('../models/unverifiedUser');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { sendOtpToEmail } = require('../config/nodemailer');

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create unverified user
    const unverifiedUser = new UnverifiedUser({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry
    });

    await unverifiedUser.save();

    // Send OTP to email
    await sendOtpToEmail(email, otp);

    res.status(201).json({ message: 'User registered. Please verify your email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const unverifiedUser = await UnverifiedUser.findOne({ email });

    if (!unverifiedUser) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (unverifiedUser.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (unverifiedUser.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Create verified user
    const newUser = new User({
      name: unverifiedUser.name,
      email: unverifiedUser.email,
      password: unverifiedUser.password
    });

    await newUser.save();

    // Delete unverified user
    await UnverifiedUser.findByIdAndDelete(unverifiedUser._id);

    res.status(200).json({ message: 'User verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports={
    signup,
    verifyOtp
}