const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList } = require('graphql');
// const SubscriptionItemType = require('./subscription-item-type');

const SubscriptionType = new GraphQLObjectType({
  name: 'Subscription',
  fields: () => ({
    id: { type: GraphQLString },
    customer: { type: GraphQLString },
    status: { type: GraphQLString },
    // items: { type: GraphQLString },
    current_period_start: { type: GraphQLInt },
    current_period_end: { type: GraphQLInt },
    plan_price_id: { type: GraphQLString },
    sub_item_id: { type: GraphQLString },
    default_payment_method: { type: GraphQLString },
    cancel_at: { type: GraphQLString },
    // items: { type: new GraphQLList(SubscriptionItemType) }, // Update to use SubscriptionItemType
  }),
});

module.exports = SubscriptionType;
