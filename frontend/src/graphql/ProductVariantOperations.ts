import { gql } from "@apollo/client";

export const GET_PRODUCT_VARIANT_STOCK = gql`
	query GetProductVariantStock($id: Float!) {
		getProductVariantById(id: $id) {
			id
			quantity
		}
	}
`;