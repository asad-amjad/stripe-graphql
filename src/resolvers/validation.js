const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const validateCheckoutSession = async (args) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(args.id);

    // Check if the session is valid
    if (session && session.id) {
      return {
        id: session.id,
        valid: 'valid',
        message: 'Session is valid',
      };
    } else {
      return {
        id: args.id,
        valid: 'invalid',
        message: 'Session not found',
      };
    }
  } catch (error) {
    return {
      id: args.id,
      valid: 'invalid',
      message: error.message,
    };
  }
};

module.exports = { validateCheckoutSession };
