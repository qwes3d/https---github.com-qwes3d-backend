const Withdrawal = require('../models/Withdrawal');

exports.approveWithdrawal = async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) return res.status(404).json({ message: 'Withdrawal not found' });

    withdrawal.status = 'approved';
    await withdrawal.save();

    res.json({ message: 'Withdrawal approved' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
  
};

exports.markWithdrawalPaid = async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) return res.status(404).json({ message: 'Withdrawal not found' });

    withdrawal.status = 'paid';
    await withdrawal.save();

    res.json({ message: 'Withdrawal marked as paid' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }

};
