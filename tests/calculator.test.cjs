const test = require("node:test");
const assert = require("node:assert/strict");
const { calculateEstimate, formatWon, readKoreanAmount } = require("../calculator.js");

test("calculates the estimate from contract amount, basis ratio, and example rate", () => {
  assert.deepEqual(calculateEstimate(500_000_000, 65, 3.11), {
    targetAmount: 325_000_000,
    estimate: 10_107_500
  });
});

test("rejects invalid amounts and simulation settings", () => {
  assert.throws(() => calculateEstimate(0, 65, 3.11), RangeError);
  assert.throws(() => calculateEstimate(Number.MAX_SAFE_INTEGER + 1, 65, 3.11), RangeError);
  assert.throws(() => calculateEstimate(100_000_000, 0, 3.11), RangeError);
  assert.throws(() => calculateEstimate(100_000_000, 65, 0), RangeError);
});

test("formats won amounts for display", () => {
  assert.equal(formatWon(10_107_500), "10,107,500원");
  assert.equal(readKoreanAmount(500_000_000), "5억 원");
  assert.equal(readKoreanAmount(50_000_000), "5,000만 원");
});
