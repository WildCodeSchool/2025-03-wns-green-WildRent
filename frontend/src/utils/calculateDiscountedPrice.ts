/**
 * Calculates the discounted unit price rounded to 2 decimal places.
 * @param price - Base price
 * @param discount - Discount percentage (0-100)
 * @returns Discounted price with 2 decimal precision
 */
export function calculateDiscountedPrice(price: number, discount: number): number {
  if (discount <= 0) return price;
  return Math.round(price * (1 - discount / 100) * 100) / 100;
}
