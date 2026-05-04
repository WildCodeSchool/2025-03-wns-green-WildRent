import { calculateItemTotal } from "../calculateItemTotal";

describe("calculateItemTotal", () => {
  it("should calculate total for a multi-day rental", () => {
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
});
