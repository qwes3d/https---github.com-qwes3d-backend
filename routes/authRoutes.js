// routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { changePassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const crypto = require('crypto');
const sendEmail = require('../utils/emailService');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.put('/change-password', authMiddleware, changePassword);



// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'No user with this email.' });

  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetToken = resetToken;
  user.resetTokenExpire = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetURL = `http://localhost:3000/reset-password/${resetToken}`;
  await sendEmail(email, 'Password Reset', `Reset your password here: ${resetURL}`);
  res.json({ message: 'Reset link sent' });
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
  const user = await User.findOne({
    resetToken: req.params.token,
    resetTokenExpire: { $gt: Date.now() },
  });
  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

  user.password = req.body.password;
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;
  await user.save();
  res.json({ message: 'Password reset successfully' });
});


module.exports = router;
