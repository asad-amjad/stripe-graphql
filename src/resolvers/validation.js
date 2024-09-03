const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const validateCheckoutSession = async (args) => {
  try {
    // Retrieve the session using the session ID
    const session = await stripe.checkout.sessions.retrieve(args.id);

    // Check if the session is valid
    if (session && session.id && session.status === 'complete') {
      const customerId = session.customer;
      const subscriptionId = session.subscription;

      if (subscriptionId) {
        // Retrieve the subscription to get the payment method
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        const paymentMethodId = subscription.default_payment_method;

        if (paymentMethodId) {
          // Attach the payment method to the customer if not already attached
          await stripe.paymentMethods.attach(paymentMethodId, {
            customer: customerId,
          });

          // Set the payment method as the default for the customer
          await stripe.customers.update(customerId, {
            invoice_settings: {
              default_payment_method: paymentMethodId,
            },
          });
        }
      }

      return {
        id: session.id,
        valid: 'valid',
        message: 'Session is valid',
      };
    } else {
      return {
        id: args.id,
        valid: 'invalid',
        message: 'Session not found or incomplete',
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
