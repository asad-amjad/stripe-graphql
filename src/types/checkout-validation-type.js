const { GraphQLObjectType, GraphQLString } = require('graphql');

const CheckoutValidationType = new GraphQLObjectType({
  name: 'ValidationResponse',
  fields: () => ({
    id: { type: GraphQLString },
    valid: { type: GraphQLString }, // e.g., 'valid' or 'invalid'
    message: { type: GraphQLString }, // Optional message
  }),
});

module.exports = CheckoutValidationType;
