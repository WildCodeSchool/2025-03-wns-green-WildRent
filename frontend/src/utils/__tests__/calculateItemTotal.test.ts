import { calculateItemTotal } from "../calculateItemTotal";

describe("calculateItemTotal", () => {
  it("should calculate total for a multi-day rental without discount", () => {
    // May 4 to May 6 = 3 days → 10€ × 2 × 3 = 60€
    const total = calculateItemTotal(10, 2, "2026-05-04", "2026-05-06");
    expect(total).toBe(60);
  });

  it("should count same-day rental as 1 day", () => {
    // May 4 to May 4 = 1 day → 25€ × 1 × 1 = 25€
    const total = calculateItemTotal(25, 1, "2026-05-04", "2026-05-04");
    expect(total).toBe(25);
  });

  it("should multiply by quantity", () => {
    // May 1 to May 2 = 2 days → 15€ × 3 × 2 = 90€
    const total = calculateItemTotal(15, 3, "2026-05-01", "2026-05-02");
    expect(total).toBe(90);
  });

  it("should apply discount percentage", () => {
    // May 4 to May 6 = 3 days, 20% off → 10€ × 0.8 × 1 × 3 = 24€
    const total = calculateItemTotal(10, 1, "2026-05-04", "2026-05-06", 20);
    expect(total).toBe(24);
  });

  it("should not apply discount when discount is 0", () => {
    const total = calculateItemTotal(10, 1, "2026-05-04", "2026-05-06", 0);
    expect(total).toBe(30);
  });

  it("should round to 2 decimal places", () => {
    // 15€ × 0.75 (25% off) × 1 × 3 days = 33.75€
    const total = calculateItemTotal(15, 1, "2026-05-04", "2026-05-06", 25);
    expect(total).toBe(33.75);
  });
});
