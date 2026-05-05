import { gql } from "@apollo/client";

export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts($limit: Int = 20, $offset: Int = 0) {
    getAllProducts(limit: $limit, offset: $offset) {
      products {
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
      total
      hasMore
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($data: SearchProductsInput!) {
    searchProducts(data: $data) {
      products {
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
      total
      hasMore
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: Float!) {
    getProductByRef(id: $id) {
      id
      name
      brand
      price
      discount
      description
      productRef
      image
      image1
      image2
      image3
      productVariant {
        id
        color
        size
        quantity
        discount
      }
    }
  }
`;
