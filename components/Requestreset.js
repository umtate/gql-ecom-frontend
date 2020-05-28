import React, { Component } from "react";
import { Mutation, Query } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import { CURRENT_USER_QUERY } from "./User";

const REQUEST_MUTATION = gql`
  mutation REQUEST_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

export default class RequestReset extends Component {
  saveToState = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  state = { email: "" };

  render() {
    return (
      <Mutation mutation={REQUEST_MUTATION} variables={this.state}>
        {(requestReset, { error, loading }) => {
          return (
            <Form
              method="post"
              onSubmit={async (e) => {
                e.preventDefault();
                await requestReset();
                this.setState({ email: "" });
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Forgot password</h2>
                <Error error={error} />
                <label htmlFor="email">
                  Email
                  <input
                    type="email"
                    name="email"
                    placeholder="email"
                    value={this.state.email}
                    onChange={this.saveToState}
                  />
                </label>

                <button type="submit">Request reset</button>
              </fieldset>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}
