import { Query } from "react-apollo";
import gql from "graphql-tag";
import PropType from "prop-types";

const CURRENT_USER_QUERY = gql`
  query {
    me {
      id
      email
      name
      permissions
      cart {
        id
        quantity
        item {
          id
          price
          image
          title
          description
        }
      }
    }
  }
`;

const User = (props) => (
  <Query {...props} query={CURRENT_USER_QUERY}>
    {(payload) => props.children(payload)}
  </Query>
);

User.propType = {
  children: PropType.func.isRequired,
};

export default User;
export { CURRENT_USER_QUERY };
