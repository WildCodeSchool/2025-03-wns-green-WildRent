import { gql } from "@apollo/client";

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
