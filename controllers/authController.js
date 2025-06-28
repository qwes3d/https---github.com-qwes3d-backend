// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ msg: 'User already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ fullName, email, password: hashed });

  res.status(201).json({
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    token: generateToken(user._id),
  });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: 'Invalid credentials' });

  res.json({
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    token: generateToken(user._id),
  });
};

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};

// === FORGOT PASSWORD ===
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    // Send email (Using Nodemailer for example)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Link',
      text: `Click here to reset your password: ${resetLink}`,
    });

    res.json({ message: 'Password reset link sent to your email' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// === CHANGE PASSWORD (Logged-in User) ===
exports.changePassword = async (req, res) => {
  const userId = req.user.id;  // This comes from JWT Auth Middleware
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

    user.password = newPassword;  // bcrypt will hash it before save
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
