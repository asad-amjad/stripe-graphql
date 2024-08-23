const { GraphQLObjectType, GraphQLString } = require('graphql');

// Define the CustomerType
const CustomerType = new GraphQLObjectType({
  name: 'Customer',
  fields: () => ({
    id: { type: GraphQLString },
    email: { type: GraphQLString },
    name: { type: GraphQLString },
  })
});

module.exports = CustomerType;
