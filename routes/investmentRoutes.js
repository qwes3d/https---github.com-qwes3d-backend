// routes/investmentRoutes.js
const express = require('express');
const router = express.Router();
const { createInvestment, getUserInvestments } = require('../controllers/investmentController');

router.post('/', createInvestment);
router.get('/', getUserInvestments);

module.exports = router;
