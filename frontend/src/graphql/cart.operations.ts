import { gql } from "@apollo/client";

export const GET_MY_CART = gql`
  query GetMyCart {
    getMyCart {
      id
      startDate
      endDate
      totalPrice
      status {
        statusName
      }
      bookingsProducts {
        id
        productQuantity
        productVariant {
          id
          color
          size
          image
          productRef
          quantity
          product {
            id
            name
            productRef
            price
            image
            discount
          }
        }
      }
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($data: AddToCartInput!) {
    addToCart(data: $data) {
      id
    }
  }
`;

export const UPDATE_CART_ITEM_QUANTITY = gql`
  mutation UpdateCartItemQuantity($data: UpdateCartItemQuantityInput!) {
    updateCartItemQuantity(data: $data) {
      id
    }
  }
`;

export const UPDATE_CART_ITEM_DATES = gql`
  mutation UpdateCartItemDates($data: UpdateCartItemDatesInput!) {
    updateCartItemDates(data: $data) {
      id
    }
  }
`;

export const REMOVE_CART_ITEM = gql`
  mutation RemoveCartItem($data: RemoveCartItemInput!) {
    removeCartItem(data: $data)
  }
`;

export const CLEAR_CART = gql`
  mutation ClearCart {
    clearCart
  }
`;

export const VALIDATE_CART = gql`
  mutation ValidateCart {
    validateCart {
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
            image
          }
        }
      }
    }
  }
`;
