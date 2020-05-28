import withApollo from "next-with-apollo";
import ApolloClient from "apollo-boost";
import { endpoint } from "../config";
import { LOCAL_STATE_QUERY } from "../components/Cart";
import { GET_ITEMS_QUERY } from "../components/SearchResults";

function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === "development" ? endpoint : endpoint,
    request: (operation) => {
      operation.setContext({
        fetchOptions: {
          credentials: "include",
        },
        headers,
      });
    },
    // local state

    clientState: {
      resolvers: {
        Mutation: {
          toggleCart(_, variables, { cache }) {
            // read the cartOPen

            const { cartOpen } = cache.readQuery({
              query: LOCAL_STATE_QUERY,
            });
            const data = {
              data: { cartOpen: !cartOpen },
            };
            cache.writeData(data);
            return data;
          },
          addItems(_, variables, { cache }) {
            const { items } = cache.readQuery({
              query: GET_ITEMS_QUERY,
            });
            const newItems = JSON.parse(variables.items);
            return items.push(...newItems);
          },
        },
      },
      defaults: {
        cartOpen: false,
        items: [],
      },
    },
  });
}

export default withApollo(createClient);
