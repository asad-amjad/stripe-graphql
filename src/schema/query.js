const { GraphQLObjectType, GraphQLString, GraphQLList } = require("graphql");
const { getCustomer } = require("../resolvers/customer");
const { getMySubscriptions } = require("../resolvers/subscription");

const CustomerType = require("../types/customer-type");
const SubscriptionType = require("../types/subscription-type");

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

    getMySubscriptions: {
      type: new GraphQLList(SubscriptionType), 
      args: { customerId: { type: GraphQLString } }, 
      resolve(parent, args) {
        return getMySubscriptions(args.customerId);
      },
    },
  },
});

module.exports = RootQuery;
