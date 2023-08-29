import { F1Field } from "ffjavascript";

const F = new F1Field(
  3618502788666131213697322783095070105623107215331596699973092056135872020481n,
);

describe("Temp", () => {
  test.concurrent("FF", () => {
    const a = F.e(1n);
    const b = F.e(2n);

    expect(F.add(a, b)).toEqual(F.e(3n));
  });
});
