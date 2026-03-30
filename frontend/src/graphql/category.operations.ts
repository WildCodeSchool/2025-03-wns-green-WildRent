import { gql } from "@apollo/client";

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCategory($categoryId: Float!) {
    getProductsByCategory(categoryId: $categoryId) {
      id
      name
      brand
      price
      image
      gender
      productVariant {
        color
        size
      }
    }
  }
`;