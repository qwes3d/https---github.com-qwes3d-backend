const sendEmail = require('./emailService');
const cron = require('node-cron');
const Investment = require('../models/Investment');
const User = require('../models/User');

const runDailyROICron = () => {
  // This cron runs every day at midnight (00:00)
  cron.schedule('0 0 * * *', async () => {
    console.log('Running Daily ROI Calculation...');

    try {
      const activeInvestments = await Investment.find({ status: 'active' });

      for (let investment of activeInvestments) {
        const roiPercent = getROIPercentage(investment.level);
        const roiAmount = (investment.amount * roiPercent) / 100;

        investment.earned += roiAmount;
        await investment.save();
        await sendEmail(investment.user.email, 'Daily ROI Credit', `You earned $${roiAmount} from your ${investment.level} plan.`);


        console.log(`Paid $${roiAmount} ROI for investment ${investment._id}`);
      }

      console.log('Daily ROI Completed.');
    } catch (error) {
      console.error('ROI Cron Error:', error);
    }
  });
};

const getROIPercentage = (level) => {
  switch (level) {
    case 'bronze':
      return 3;
    case 'silver':
      return 5;
    case 'gold':
      return 7;
    case 'platinum':
      return 10;
    default:
      return 3;
  }
};

module.exports = runDailyROICron;
