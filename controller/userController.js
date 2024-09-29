const UnverifiedUser = require('../models/unverifiedUser');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendOtpToEmail } = require('../config/nodemailer');

const JWT_SECRET = process.env.JWT_SECRET;

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const userwithOTP = await UnverifiedUser.findOne({ email });
    if (userwithOTP) {
      return res.status(400).json({ message: 'Check email to verify OTP' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const unverifiedUser = new UnverifiedUser({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry
    });

    await unverifiedUser.save();
    await sendOtpToEmail(email, otp);

    res.status(201).json({ message: 'User registered. Please verify your email.' });
  } catch (error) {
    // console.error(error);
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

    const newUser = new User({
      name: unverifiedUser.name,
      email: unverifiedUser.email,
      password: unverifiedUser.password
    });

    await newUser.save();
    await UnverifiedUser.findByIdAndDelete(unverifiedUser._id);
    const data = {
      user: {
        id: newUser.id,
        // name: newUser.name,
        // email: newUser.email,
        // totalCredits: newUser.totalCredits
      }
    };
    const token = jwt.sign(data, JWT_SECRET);

      res.status(200).json({
        message: 'User verified successfully',
        token
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

const signin = async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
      const data = {
        user: {
          id: user.id,
          // name: user.name,
          // email: user.email,
          // totalCredits: user.totalCredits
        }
      };
      const token = jwt.sign(data, JWT_SECRET);

      res.status(200).json({
        message: 'Signed in successfully',
        token
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  // API endpoint to get current user data
const getUserData = async (req, res) => {
    try {
      // Extract token from Authorization header
      const token = req.header('Authorization')?.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
      }

      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Find the user in the database
      const user = await User.findById(decoded.user.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Return the user data
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        totalCredits: user.totalCredits,
      });

    } catch (error) {
      console.error('Error in getUserData:', error.message);
      res.status(401).json({ message: 'Invalid token' });
    }
  };


  module.exports = {
    signup,
    verifyOtp,
    signin,
    getUserData
  };