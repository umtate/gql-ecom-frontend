import React, { useState } from "react";
import Downshift, { resetIdCounter } from "downshift";
import Router from "next/router";
import { PropTypes } from "prop-types";
import { ApolloConsumer, Mutation } from "react-apollo";
import gql from "graphql-tag";
import debounce from "lodash.debounce";
import { DropDown, DropDownItem, SearchStyles } from "./styles/DropDown";
import SickButton from "./styles/SickButton";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import styled from "styled-components";

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchTerm: String!) {
    items(
      where: {
        OR: [
          { title_contains: $searchTerm }
          { description_contains: $searchTerm }
        ]
      }
    ) {
      id
      price
      title
      description
      image
    }
  }
`;

const ITEMS_MUTATION = gql`
  mutation addItems($items: String) {
    addItems(items: $items) @client
  }
`;

const routeToItem = (item) => {
  Router.push({
    pathname: "/item",
    query: {
      id: item.id,
    },
  });
};

const Center = styled.div`
  text-align: center;
`;

const routeToResultsHandler = () => {
  Router.push({
    pathname: "/searchResult",
  });
};
const Search = (props) => {
  const [loading, _loading] = useState(false);
  const [items, _items] = useState([]);

  const onChangeHandler = debounce(async (e, client) => {
    console.log("searching");
    _loading(true);

    const res = await client.query({
      query: SEARCH_ITEMS_QUERY,
      variables: { searchTerm: e.target.value },
    });

    _items(res.data.items);
    _loading(false);
  }, 400);

  resetIdCounter();
  return (
    <SearchStyles>
      <Downshift
        onChange={routeToItem}
        itemToString={(item) => (item === null ? "" : item.title)}
      >
        {({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue,
          highlightedIndex,
        }) => (
          <div>
            <ApolloConsumer>
              {(client) => (
                <Center>
                  <Mutation
                    mutation={ITEMS_MUTATION}
                    variables={{ items: JSON.stringify(items) }}
                  >
                    {(addItems) => {
                      return (
                        <Input
                          endAdornment={
                            <InputAdornment position="end">
                              <Button
                                variant="contained"
                                disabled={!items.length}
                                color="secondary"
                                startIcon={<SearchIcon />}
                                onClick={() => {
                                  addItems();
                                  routeToResultsHandler();
                                }}
                              >
                                View
                              </Button>
                            </InputAdornment>
                          }
                          {...getInputProps({
                            className: props.loading ? "loading" : "",
                            type: "search",
                            placeholder: "Search",
                            id: "search",
                            onChange: (e) => {
                              e.persist();
                              onChangeHandler(e, client);
                            },
                          })}
                        />
                      );
                    }}
                  </Mutation>
                </Center>
              )}
            </ApolloConsumer>
            {isOpen && (
              <DropDown>
                {items.map((item, index) => (
                  <DropDownItem
                    {...getItemProps({ item })}
                    key={item.id}
                    highlighted={index === highlightedIndex}
                  >
                    <img width="50" src={item.image} alt={item.title} />
                    {item.title}
                  </DropDownItem>
                ))}
                {!items.length && !loading && (
                  <DropDownItem> Nothing found {inputValue}</DropDownItem>
                )}
              </DropDown>
            )}
          </div>
        )}
      </Downshift>
    </SearchStyles>
  );
};

const AutoComplete = () => {
  return <div></div>;
};

export default Search;
