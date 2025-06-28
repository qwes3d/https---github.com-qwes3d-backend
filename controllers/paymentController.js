const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.createStripePayment = async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amount in cents
      currency: 'usd',
      payment_method_types: ['card'],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Payment failed' });
  }
};

exports.createCryptoPayment = async (req, res) => {
  const { amount, userId } = req.body;

  try {
    // Simulate crypto payment success
    console.log(`Simulated crypto payment for user ${userId} with amount $${amount}`);
    res.json({ message: 'Crypto payment simulated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Crypto simulation failed' });
  }
};

