import { calculateDiscountedPrice } from "../calculateDiscountedPrice";

describe("calculateDiscountedPrice", () => {
  it("should return the original price when discount is 0", () => {
    expect(calculateDiscountedPrice(15, 0)).toBe(15);
  });

  it("should apply 25% discount correctly (15€ → 11.25€)", () => {
    expect(calculateDiscountedPrice(15, 25)).toBe(11.25);
  });

  it("should apply 50% discount correctly", () => {
    expect(calculateDiscountedPrice(20, 50)).toBe(10);
  });

  it("should round to 2 decimal places", () => {
    // 10€ with 33% off → 6.70€
    expect(calculateDiscountedPrice(10, 33)).toBe(6.7);
  });

  it("should return original price for negative discount", () => {
    expect(calculateDiscountedPrice(15, -10)).toBe(15);
  });
});
