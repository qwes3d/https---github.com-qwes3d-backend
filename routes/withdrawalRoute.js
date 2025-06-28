const express = require('express');
const { createWithdrawal, getUserWithdrawals } = require('../controllers/withdrawalController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createWithdrawal);
router.get('/', protect, getUserWithdrawals);

module.exports = router;
