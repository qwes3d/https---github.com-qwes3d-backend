const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Investment = require('../models/Investment');
const Withdrawal = require('../models/Withdrawal');
const { protect } = require('../middleware/authMiddleware');

// ✅ Admin - Get All Users
router.get('/users', protect, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Admin - Promote User to Admin
router.put('/users/:id/promote', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: 'admin' },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Admin - Get All Investments
router.get('/investments', protect, async (req, res) => {
  try {
    const investments = await Investment.find().populate('user');
    res.json(investments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Admin - Get All Withdrawals
router.get('/withdrawals', protect, async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find()
      .populate('user')
      .populate('investment');
    res.json(withdrawals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Admin - Delete User
router.delete('/users/:id', protect, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Admin - Approve Withdrawal
router.put('/withdrawals/:id/approve', protect, async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    res.json(withdrawal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark withdrawal as paid
router.put('/withdrawals/:id/mark-paid', protect, adminOnly, async (req, res) => {
  await Withdrawal.findByIdAndUpdate(req.params.id, { status: 'paid' });
  res.json({ message: 'Withdrawal marked as paid' });
});

// ✅ Admin - Reject Withdrawal
router.put('/withdrawals/:id/reject', protect, async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    res.json(withdrawal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Admin - Delete Investment
router.delete('/investments/:id', protect, async (req, res) => {
  try {
    await Investment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Investment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Promote user to admin
router.put('/users/:id/promote', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = 'admin';
    await user.save();
    res.json({ message: 'User promoted to admin' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/withdrawals/:id/approve', protect, admin, approveWithdrawal);
router.put('/withdrawals/:id/mark-paid', protect, admin, markWithdrawalPaid);




module.exports = router;
