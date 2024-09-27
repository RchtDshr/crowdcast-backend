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
    if (userwithOTP){
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
   
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ 
      message: 'User verified successfully', 
      token,
      userId: newUser._id,
      userEmail: newUser.email
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

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ 
      message: 'Signed in successfully', 
      token,
      userId: user._id,
      userEmail: user.email
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
    signup,
    verifyOtp,
    signin
};