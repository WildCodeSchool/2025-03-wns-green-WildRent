/**
 * Returns the effective discount percentage for a product variant.
 * If the variant has its own discount (> 0), it takes priority.
 * Otherwise, it inherits the product-level discount.
 * A variant discount is always >= the product discount (enforced by the backend).
 */
export function getEffectiveDiscount(productDiscount: number, variantDiscount: number): number {
    return variantDiscount > 0 ? variantDiscount : productDiscount;
}
