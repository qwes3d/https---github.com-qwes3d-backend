// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/investments', require('./routes/investmentRoutes'));
app.use('/api/withdrawals', require('./routes/withdrawalRoute'));
app.use('/api/admin', adminRoutes);


app.get('/', (req, res) => {
  res.send('Tucker API running...');
});

const runDailyROICron = require('./utils/roiCron');
runDailyROICron();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const withdrawalRoutes = require('./routes/withdrawalRoutes');
app.use('/api/withdrawals', withdrawalRoutes);
