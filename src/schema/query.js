const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
} = require("graphql");
const { getCustomer } = require("../resolvers/customer");
const {
  getMySubscriptions,
  previewProration,
  getPriceDetails,
  getTransactionHistory,
} = require("../resolvers/subscription");

const CustomerType = require("../types/customer-type");
const SubscriptionType = require("../types/subscription-type");
const TransactionType = require("../types/transaction-type");
// const { TransactionType } = require("../types/transaction-type");
// Add a custom type to return proration data
const ProrationType = new GraphQLObjectType({
  name: "ProrationType",
  fields: () => ({
    prorationAmount: { type: GraphQLFloat },
    invoiceItems: { type: new GraphQLList(GraphQLString) }, // Adjust according to your actual structure
    upcomingInvoice: { type: GraphQLString }, // Adjust according to your actual structure
  }),
});

const PriceType = new GraphQLObjectType({
  name: "PriceType",
  fields: () => ({
    id: { type: GraphQLString },
    unit_amount: { type: GraphQLFloat },
    currency: { type: GraphQLString },
    active: { type: GraphQLString },
    product_name: { type: GraphQLString },
    product_description: { type: GraphQLString },
    product_metadata: { type: GraphQLString },
    recurring: {
      type: new GraphQLObjectType({
        name: "RecurringDetails",
        fields: {
          interval: { type: GraphQLString },
          interval_count: { type: GraphQLFloat },
        },
      }),
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    getCustomer: {
      type: CustomerType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return getCustomer(args);
      },
    },

    getPriceDetails: {
      type: PriceType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return getPriceDetails(args.id);
      },
    },

    getMySubscriptions: {
      type: new GraphQLList(SubscriptionType),
      args: { customerId: { type: GraphQLString } },
      resolve(parent, args) {
        return getMySubscriptions(args.customerId);
      },
    },

    previewProration: {
      type: ProrationType,
      args: {
        subscriptionId: { type: GraphQLString },
        newPriceId: { type: GraphQLString },
      },
      resolve(parent, args) {
        return previewProration(args.subscriptionId, args.newPriceId);
      },
    },

    getTransactionHistory: {
      type: new GraphQLList(TransactionType),
      args: { customerId: { type: GraphQLString } },
      resolve(parent, args) {
        return getTransactionHistory(args.customerId);
      },
    },
  },
});

module.exports = RootQuery;
