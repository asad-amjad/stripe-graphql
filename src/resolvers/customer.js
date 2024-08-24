const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const customerResolvers = {
  getCustomer: async (args) => {
    return await stripe.customers.retrieve(args.id);
  },
  createCustomer: async (args) => {
    return await stripe.customers.create({
      email: args.email,
      name: args.name,
    });
  },
};

module.exports = customerResolvers;
