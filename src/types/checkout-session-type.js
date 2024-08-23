const { GraphQLObjectType, GraphQLString } = require('graphql');

const CheckoutSessionType = new GraphQLObjectType({
  name: 'CheckoutSession',
  fields: () => ({
    id: { type: GraphQLString },
    url: { type: GraphQLString },
  }),
});

module.exports = CheckoutSessionType;
