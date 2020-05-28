import React from "react";
import StripeCheckout from "react-stripe-checkout";
import { Mutation } from "react-apollo";
import Router from "next/router";
import NProgress from "nprogress";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import calcTotalPrice from "../lib/calcTotalPrice";
import Error from "./ErrorMessage";
import User, { CURRENT_USER_QUERY } from "./User";

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

const totalItems = (cart) => {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
};

const MakePayment = (props) => {
  const onToken = async (res, createOrder) => {
    NProgress.start();
    console.log("On Token Called");
    //  manually call the mutation once we have the stripe token
    const order = await createOrder({
      variables: {
        token: res.id,
      },
    }).catch((err) => {
      alert(err.message);
    });
    Router.push({
      pathname: "/order",
      query: { id: order.data.createOrder.id },
    });
  };

  return (
    <User>
      {({ data: { me } }) =>
        me && (
          <Mutation
            mutation={CREATE_ORDER_MUTATION}
            refetchQueries={[{ query: CURRENT_USER_QUERY }]}
          >
            {(createOrder) => (
              <StripeCheckout
                amount={calcTotalPrice(me.cart)}
                name="Sick Fits"
                description={`Order of ${totalItems(me.cart)} items`}
                stripeKey="pk_test_RyK0ggEUuDvLmqpXFlL4yCEU00tFqhThIi"
                email={me.email}
                token={(res) => onToken(res, createOrder)}
              >
                {" "}
                {props.children}
              </StripeCheckout>
            )}
          </Mutation>
        )
      }
    </User>
  );
};

export default MakePayment;
