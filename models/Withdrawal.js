const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  investment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investment',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  method: {
    type: String,
    enum: ['bank', 'card', 'crypto'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processed'],
    default: 'pending',
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
