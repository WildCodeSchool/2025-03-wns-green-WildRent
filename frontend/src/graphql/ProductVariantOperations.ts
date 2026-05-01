import { gql } from "@apollo/client";

export const GET_PRODUCT_VARIANT_STOCK = gql`
	query GetProductVariantStock($id: Float!) {
		getProductVariantById(id: $id) {
			id
			quantity
		}
	}
`;

export const GET_AVAILABLE_STOCK = gql`
  query GetAvailableStock(
    $productVariantId: Float!
    $startDate: DateTimeISO!
    $endDate: DateTimeISO!
  ) {
    getAvailableStock(
      productVariantId: $productVariantId
      startDate: $startDate
      endDate: $endDate
    )
  }
`;