const { GraphQLObjectType, GraphQLString, GraphQLBoolean } = require("graphql");

const CardDetailsType = new GraphQLObjectType({
  name: "CardDetails",
  fields: {
    brand: { type: GraphQLString },
    last4: { type: GraphQLString },
    exp_month: { type: GraphQLString },
    exp_year: { type: GraphQLString },
  },
});

const BillingDetailsType = new GraphQLObjectType({
  name: "BillingDetails",
  fields: {
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    address: {
      type: new GraphQLObjectType({
        name: "Address",
        fields: {
          city: { type: GraphQLString },
          country: { type: GraphQLString },
          line1: { type: GraphQLString },
          line2: { type: GraphQLString },
          postal_code: { type: GraphQLString },
          state: { type: GraphQLString },
        },
      }),
    },
  },
});

const PaymentMethodType = new GraphQLObjectType({
  name: "PaymentMethodType",
  fields: () => ({
    id: { type: GraphQLString },
    type: { type: GraphQLString },
    card: { type: CardDetailsType },
    billing_details: { type: BillingDetailsType },
    created: { type: GraphQLString },
    is_default: { type: GraphQLBoolean },
  }),
});

module.exports = PaymentMethodType;
