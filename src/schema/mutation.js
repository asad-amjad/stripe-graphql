const { GraphQLObjectType, GraphQLString } = require("graphql");

const {
  createSubscriptionCheckoutSession,
  changeSubscriptionPlan,
  cancelSubscriptionPlan,
} = require("../resolvers/subscription");
const { createCustomer } = require("../resolvers/customer");
const { validateCheckoutSession } = require("../resolvers/validation");

const CustomerType = require("../types/customer-type");
const SubscriptionType = require("../types/subscription-type");
const CheckoutSessionType = require("../types/checkout-session-type");
const CheckoutValidationType = require("../types/checkout-validation-type");

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // create customer
    createCustomer: {
      type: CustomerType,
      args: {
        email: { type: GraphQLString },
        name: { type: GraphQLString },
      },
      resolve(parent, args) {
        return createCustomer(args);
      },
    },

    // create subscription checkout session
    createSubscriptionCheckoutSession: {
      type: CheckoutSessionType,
      args: {
        priceId: { type: GraphQLString },
        customerId: { type: GraphQLString },
      },
      resolve(parent, args) {
        return createSubscriptionCheckoutSession(args);
      },
    },

    changeSubscriptionPlan: {
      type: SubscriptionType,
      args: {
        customerId: { type: GraphQLString },
        subscriptionId: { type: GraphQLString },
        subItemId: { type: GraphQLString },
        newPriceId: { type: GraphQLString },
      },
      resolve(parent, args) {
        return changeSubscriptionPlan(args);
      },
    },

    // cancel subscription plan
    cancelSubscriptionPlan: {
      type: SubscriptionType,
      args: {
        subscriptionId: { type: GraphQLString },
      },
      resolve(parent, args) {
        return cancelSubscriptionPlan(args.subscriptionId);
      },
    },
    //
    validateSession: {
      type: CheckoutValidationType,
      args: {
        id: { type: GraphQLString },
      },
      resolve(parent, args) {
        return validateCheckoutSession(args);
      },
    },
  },
});

module.exports = Mutation;
