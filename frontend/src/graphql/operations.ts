import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      id
      firstname
      lastname
      email
      role
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

export const WHO_AM_I = gql`
  query WhoAmI {
    whoAmI {
      id
      firstname
      lastname
      email
      address
      postalCode
      city
      avatar
      role {
        roleName
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($data: CreateUserDto!) {
    createUser(data: $data) {
      id
      firstname
      lastname
      email
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($getUserByIdId: Float!) {
    getUserById(id: $getUserByIdId) {
      id
      firstname
      lastname
      email
      address
      postalCode
      city
      avatar
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $data: UpdateUserDto!) {
    updateUser(id: $id, data: $data) {
      id
      firstname
      lastname
      email
      address
      postalCode
      city
      avatar
    }
  }
`;
