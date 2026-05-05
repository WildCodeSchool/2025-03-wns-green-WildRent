import { calculateDays } from "./calculateDays";
import { calculateDiscountedPrice } from "./calculateDiscountedPrice";

/**
 * Calculates the total price for a rental item with discount applied.
 * @param price - Base price per day
 * @param quantity - Number of items rented
 * @param startDate - Rental start date (ISO string)
 * @param endDate - Rental end date (ISO string)
 * @param discount - Discount percentage (0-100), defaults to 0
 * @returns Total price for the item after discount
 */
export function calculateItemTotal(
  price: number,
  quantity: number,
  startDate: string,
  endDate: string,
  discount: number = 0,
): number {
  const days = calculateDays(startDate, endDate);
  const unitPrice = calculateDiscountedPrice(price, discount);
  return Math.round(unitPrice * quantity * days * 100) / 100;
}
