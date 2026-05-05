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
            image
          }
        }
      }
    }
  }
`;

export const DELETE_BOOKING = gql`
  mutation DeleteBooking($id: ID!) {
    deleteBooking(id: $id)
  }
`;

export const UPDATE_BOOKING = gql`
  mutation UpdateBooking($id: ID!, $data: UpdateBookingInput!) {
    updateBooking(id: $id, data: $data) {
      id
      startDate
      endDate
      totalPrice
      status {
        statusName
      }
    }
  }
`;

export const GET_ALL_STATUS = gql`
  query GetAllStatus {
    getAllStatus {
      id
      statusName
    }
  }
`;