/**
 * Formats an ISO date string to French locale format (DD/MM/YYYY).
 * @param dateString - ISO date string to format
 * @returns Formatted date string (e.g., "04/05/2026")
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
