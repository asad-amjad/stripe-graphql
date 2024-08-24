import { gql } from "@apollo/client";

export const GET_PROFILE = gql`
  query MyQuery {
    getUserProfile {
      user {
        dob
        firstName
        lastName
        phone
        timezone
      }
    }
  }
`;

export const UPDATE_PROFILE_MUTATION = gql`
  mutation MyMutation(
    $firstName: String
    $lastName: String
    $dob: String
    $timezone: String
  ) {
    updateUserProfile(
      request: {
        firstName: $firstName
        lastName: $lastName
        dob: $dob
        timezone: $timezone
      }
    ) {
      message
      statusCode
    }
  }
`;

export const CREATE_CHECKOUT_SESSION = gql`
  mutation CreateSubscriptionCheckoutSession(
    $priceId: String!
    $customerId: String!
  ) {
    createSubscriptionCheckoutSession(
      priceId: $priceId
      customerId: $customerId
    ) {
      id
      url
    }
  }
`;

export const VALIDATE_CHECKOUT_SESSION = gql`
  mutation ValidateSession($id: String!) {
    validateSession(id: $id) {
      id
      valid
      message
    }
  }
`;

export const GET_MY_SUBSCRIPTIONS = gql`
  query getMySubscriptions($customerId: String!) {
    getMySubscriptions(customerId: $customerId) {
      id
      status
      current_period_start
      current_period_end
      plan_price_id
      sub_item_id
    }
  }
`;

export const SUBSCRIPTION_CANCEL_MUTATION = gql`
  mutation cancelSubscriptionPlan($subscriptionId: String!) {
    cancelSubscriptionPlan(subscriptionId: $subscriptionId) {
      id
    }
  }
`;

export const SUBSCRIPTION_UPDATE_MUTATION = gql`
  mutation changeSubscriptionPlan(
    $customerId: String!
    $subscriptionId: String!
    $subItemId: String!
    $newPriceId: String!
  ) {
    changeSubscriptionPlan(
      customerId: $customerId
      subscriptionId: $subscriptionId
      subItemId: $subItemId
      newPriceId: $newPriceId
    ) {
      id
      status
      current_period_start
      current_period_end
      plan_price_id
      sub_item_id
    }
  }
`;
