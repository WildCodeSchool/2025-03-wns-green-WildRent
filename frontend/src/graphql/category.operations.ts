import { gql } from "@apollo/client";

export const GET_ALL_CATEGORIES = gql`
  query GetAllCategories {
    getAllCategories {
      id
      name
      image
    }
  }
`;

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCategory($categoryId: Float!) {
    getProductsByCategory(categoryId: $categoryId) {
      id
      name
      brand
      price
      image
      gender
      productRef
      discount
      category {
        id
        name
      }
      productVariant {
        color
        size
      }
    }
  }
`;