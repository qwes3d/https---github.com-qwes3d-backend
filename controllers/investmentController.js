// controllers/investmentController.js
const Investment = require('../models/Investment');
const jwt = require('jsonwebtoken');

const planDetails = {
  Bronze: 10,
  Silver: 20,
  Gold: 35,
  Platinum: 50,
};

exports.createInvestment = async (req, res) => {
  try {
    const { plan, amount } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    if (!planDetails[plan]) {
      return res.status(400).json({ message: 'Invalid plan' });
    }

    const roi = planDetails[plan];
    const payoutAmount = amount + (amount * roi) / 100;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // payout after 30 days

    const investment = await Investment.create({
      user: userId,
      plan,
      amount,
      roiPercentage: roi,
      endDate,
      payoutAmount,
    });

    res.status(201).json(investment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUserInvestments = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const investments = await Investment.find({ user: userId });
    res.json(investments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
