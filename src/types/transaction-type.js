const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
} = require("graphql");

const TransactionType = new GraphQLObjectType({
  name: "TransactionType",
  fields: () => ({
    id: { type: GraphQLString },
    amount: { type: GraphQLFloat },
    currency: { type: GraphQLString },
    status: { type: GraphQLString },
    created: { type: GraphQLString },
    description: { type: GraphQLString },
  }),
});

module.exports = TransactionType;
