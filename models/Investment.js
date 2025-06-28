// models/Investment.js
const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  plan: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  roiPercentage: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: Date,
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active',
  },
  payoutAmount: Number,
});

module.exports = mongoose.model('Investment', investmentSchema);
