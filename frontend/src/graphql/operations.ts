import { gql } from "@apollo/client";

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: Float!) {
    getProductByRef(id: $id) {
      id
      name
      brand
      price
      description
      productRef
      image1
      image2
      image3
      productVariant {
        color
        size
      }
    }
  }
`;