import { gql } from "@apollo/client";

export const CREATE_BOOKING = gql`
  mutation CreateBooking($data: CreateBookingInput!) {
    createBooking(data: $data) {
      id
    }
  }
`;

export const CREATE_BOOKING_PRODUCT = gql`
  mutation CreateBookingProduct($data: CreateBookingProductsInput!) {
    createBookingProduct(data: $data) {
      id
    }
  }
`;