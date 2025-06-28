const Withdrawal = require('../models/Withdrawal');
const Investment = require('../models/Investment');
const jwt = require('jsonwebtoken');

exports.createWithdrawal = async (req, res) => {
  try {
    const { investmentId, method } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const investment = await Investment.findOne({ _id: investmentId, user: userId });

    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    if (investment.status !== 'completed') {
      return res.status(400).json({ message: 'Investment is not matured for withdrawal' });
    }

    const withdrawal = await Withdrawal.create({
      user: userId,
      investment: investment._id,
      amount: investment.payoutAmount,
      method
    });

    res.status(201).json(withdrawal);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUserWithdrawals = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const withdrawals = await Withdrawal.find({ user: userId }).populate('investment');
    res.json(withdrawals);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
