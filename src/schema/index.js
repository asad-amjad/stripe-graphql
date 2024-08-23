const { GraphQLSchema } = require('graphql');
const RootQuery = require('./query');
const Mutation = require('./mutation');

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
