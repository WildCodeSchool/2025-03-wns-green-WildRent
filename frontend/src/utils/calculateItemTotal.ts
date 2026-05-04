import { calculateDays } from "./calculateDays";

/**
 * Calculates the total price for a rental item (price × quantity × days).
 * @param price - Price per day
 * @param quantity - Number of items rented
 * @param startDate - Rental start date (ISO string)
 * @param endDate - Rental end date (ISO string)
 * @returns Total price for the item
 */
export function calculateItemTotal(
  price: number,
  quantity: number,
  startDate: string,
  endDate: string
): number {
  const days = calculateDays(startDate, endDate);
  return price * quantity * days;
}
