import React, { useState } from "react";
import { Query, Mutation } from "react-apollo";
import Error from "./ErrorMessage";
import gql from "graphql-tag";
import Table from "./styles/Table";
import SickButton from "./styles/SickButton";
import PropTypes from "prop-types";

const ALL_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
      permissions
    }
  }
`;

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation updatePermissions($permissions: [Permission], $userId: ID!) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`;

const possiblePermissions = [
  "ADMIN",
  "USER",
  "ITEMCREATE",
  "ITEMUPDATE",
  "ITEMDELETE",
  "PERMISSIONUPDATE",
];

export default function Permissions() {
  const propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string,
      permissions: PropTypes.array,
    }).isRequired,
  };

  const UserPermissions = (props) => {
    const user = props.user;
    const [permissions, setPermission] = useState(user.permissions);

    const handlePermissionChange = (e) => {
      const checkbox = e.target;
      let updatedPermissions = [...permissions];
      if (checkbox.checked) {
        updatedPermissions.push(checkbox.value);
      } else {
        updatedPermissions = updatedPermissions.filter(
          (permission) => permission !== checkbox.value
        );
      }
      setPermission(updatedPermissions);
    };

    return (
      <Mutation
        mutation={UPDATE_PERMISSIONS_MUTATION}
        variables={{
          permissions,
          userId: props.user.id,
        }}
      >
        {(updatePermissions, { loading, error }) => (
          <>
            {error && (
              <tr>
                <td colSpan="8">
                  <Error error={error} />
                </td>
              </tr>
            )}
            <tr>
              <td>{user.name}</td>
              <td>{user.email}</td>
              {possiblePermissions.map((permission) => (
                <td key={permission}>
                  <label htmlFor={`${user.id}-permission-${permission}`}>
                    <input
                      type="checkbox"
                      checked={permissions.includes(permission)}
                      value={permission}
                      onChange={handlePermissionChange}
                    />
                  </label>
                </td>
              ))}
              <td>
                <SickButton
                  type="button"
                  disabled={loading}
                  onClick={updatePermissions}
                >
                  Update
                </SickButton>
              </td>
            </tr>
          </>
        )}
      </Mutation>
    );
  };

  return (
    <Query query={ALL_USERS_QUERY}>
      {({ data, loading, error }) => {
        return (
          <div>
            <Error error={error}></Error>
            <div>
              <h2>Manage Permissions</h2>
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    {possiblePermissions.map((permission) => (
                      <th key={permission}>{permission}</th>
                    ))}
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.map((user) => (
                    <UserPermissions user={user} key={user.id} />
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        );
      }}
    </Query>
  );
}
