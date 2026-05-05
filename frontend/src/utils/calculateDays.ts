/**
 * Calculates the number of rental days between two dates (inclusive).
 * Both start and end days are counted as rental days.
 * Example: May 4 to May 6 = 3 days (4th, 5th, 6th).
 */
export function calculateDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end.getTime() - start.getTime();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, days);
}
