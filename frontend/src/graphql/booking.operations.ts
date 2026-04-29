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

export const GET_MY_BOOKINGS = gql`
  query GetMyBookings {
    getMyBookings {
      id
      bookingRef
      totalPrice
      startDate
      endDate
      status {
        statusName
      }
      bookingsProducts {
        productQuantity
        productVariant {
          id
          color
          size
          image
          product {
            id
            name
            productRef
            price
            brand
          }
        }
      }
    }
  }
`;