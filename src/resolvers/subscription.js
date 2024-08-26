const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createSubscriptionCheckoutSession = async (args) => {
  // const customer = await stripe.customers.create({
  //   email: args.email,
  //   name: args.name,
  // }); if user
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: args.priceId,
        quantity: 1,
      },
    ],
    customer: args.customerId,
    success_url:
      "http://localhost:3000/shop/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "http://localhost:3000/shop/cancel",
  });

  return {
    url: session.url,
  };
};

const changeSubscriptionPlan = async (args) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(
      args.subscriptionId
    );

    const currentPlanAmount = await subscription.items.data[0].price
      .unit_amount;
    const newPlanAmount = await stripe.prices
      .retrieve(args.newPriceId)
      .then((price) => price.unit_amount);

    const isDownGrade = currentPlanAmount > newPlanAmount;

    if (isDownGrade) {
      const current_period_end = subscription.current_period_end;
      // Cancelling the current subscription
      await stripe.subscriptions.update(args.subscriptionId, {
        cancel_at: current_period_end,
      });

      // create a new subscription as requuested by the customer
      // it will start at the end of the current active subscription period
      const nextRequestedSubscription = await stripe.subscriptions.create({
        customer: args.customerId,
        items: [
          {
            price: args.newPriceId,
          },
        ],
        trial_end: current_period_end,
        billing_cycle_anchor: current_period_end,
      });

      return {
        id: nextRequestedSubscription?.id,
        status: nextRequestedSubscription?.status,
        current_period_start: nextRequestedSubscription?.current_period_start,
        current_period_end: nextRequestedSubscription?.current_period_end,
        plan_price_id: nextRequestedSubscription?.plan?.id,
      };
    } else {
      const session = await stripe.subscriptions.update(args.subscriptionId, {
        items: [
          {
            id: args.subItemId,
            deleted: true,
          },
          {
            price: args.newPriceId,
          },
        ],
        proration_behavior: "always_invoice",
      });
      return {
        id: session?.id,
        status: session?.status,
        current_period_start: session?.current_period_start,
        current_period_end: session?.current_period_end,
        plan_price_id: session?.plan?.id,
      };
    }
  } catch (error) {
    console.error("Error creating checkout session for upgrade:", error);
    throw error;
  }
};

const getMySubscriptions = async (customerId) => {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
    });

    const subscriptionDetails = await Promise.all(
      subscriptions.data.map(async (subscription) => {
        const items = await stripe.subscriptionItems.list({
          subscription: subscription.id,
        });
        return {
          id: subscription.id,
          status: subscription.status,
          items: items.data,
          sub_item_id: items?.data?.[0]?.id,
          current_period_start: subscription.current_period_start,
          current_period_end: subscription.current_period_end,
          plan_price_id: subscription.plan?.id,
        };
      })
    );

    return subscriptionDetails;
  } catch (error) {
    throw new Error(`Error fetching subscriptions: ${error.message}`);
  }
};

const getPriceDetails = async (priceId) => {
  try {
    const price = await stripe.prices.retrieve(priceId);
    
    // Fetch additional product details if needed
    const product = await stripe.products.retrieve(price.product);
// console.log(product)
    return {
      id: price.id,
      active: price.active,
      currency: price.currency,
      unit_amount: price.unit_amount,
      recurring: price.recurring,
      product_name: product.name,
      product_description: product.description,
      product_metadata: product.metadata,
      metadata: price.metadata,
    };
  } catch (error) {
    throw new Error(`Error fetching price details: ${error.message}`);
  }
};


const cancelSubscriptionPlan = async (subscriptionId) => {
  try {
    // Set the subscription to cancel at the end of the current billing cycle
    const updatedSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        cancel_at_period_end: true,
      }
    );

    return {
      id: updatedSubscription.id,
      status: updatedSubscription.status,
      cancel_at_period_end: updatedSubscription.cancel_at_period_end,
      current_period_end: updatedSubscription.current_period_end,
    };
  } catch (error) {
    console.error(
      `Error setting subscription to cancel at the end of the period: ${error.message}`
    );
    throw error;
  }
};

// Function to preview proration
const previewProration = async (subscriptionId, newPriceId) => {
  try {
    // Retrieve the current subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Preview the upcoming invoice with proration
    const upcomingInvoice = await stripe.invoices.retrieveUpcoming({
      customer: subscription.customer,
      subscription: subscriptionId,
      subscription_items: [
        {
          id: subscription.items.data[0].id,
          price: newPriceId,
        },
      ],
    });

    // Extract relevant proration data
    const prorationAmount = upcomingInvoice.total;
    const invoiceItems = upcomingInvoice.lines.data.map(
      (item) => item.description
    );

    return {
      prorationAmount,
      invoiceItems,
      upcomingInvoice: JSON.stringify(upcomingInvoice), // or return the needed part
    };
    // console.log("Upcoming invoice with proration:", upcomingInvoice);
    // return {data:""}; // Return the proration details if needed
  } catch (error) {
    console.error("Error previewing proration:", error);
    throw error; // Re-throw the error if needed
  }
};

module.exports = {
  createSubscriptionCheckoutSession,
  getMySubscriptions,
  changeSubscriptionPlan,
  cancelSubscriptionPlan,
  previewProration,
  getPriceDetails,
};
