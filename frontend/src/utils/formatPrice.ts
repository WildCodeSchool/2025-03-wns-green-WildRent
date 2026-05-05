/**
 * Formats a number as a price string with 2 decimal places.
 * Example: 20 → "20.00", 11.25 → "11.25"
 */
export function formatPrice(price: number): string {
  return price.toFixed(2);
}
