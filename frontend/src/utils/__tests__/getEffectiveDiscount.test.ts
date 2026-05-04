import { getEffectiveDiscount } from "../getEffectiveDiscount";

describe("getEffectiveDiscount", () => {
  it("should return variant discount when it is greater than 0", () => {
    expect(getEffectiveDiscount(10, 20)).toBe(20);
  });

  it("should return product discount when variant discount is 0", () => {
    expect(getEffectiveDiscount(15, 0)).toBe(15);
  });

  it("should return 0 when both discounts are 0", () => {
    expect(getEffectiveDiscount(0, 0)).toBe(0);
  });
});
