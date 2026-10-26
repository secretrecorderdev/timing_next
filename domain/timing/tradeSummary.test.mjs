import assert from "node:assert/strict";
import test from "node:test";
import { getFilteredTradeSummary } from "./tradeSummary.ts";

const buy = { totalProfit: 10, totalHoldingDays: 365 };
const short = { totalProfit: -4, totalHoldingDays: 365 };

for (const [filter, totalProfit, totalHoldingDays, annualizedProfit] of [
  ["all", 6, 730, 3],
  ["buy", 10, 365, 10],
  ["short", -4, 365, -4],
]) {
  test(`${filter} 필터에 맞춰 수익률·보유기간·연수익률을 선택한다`, () => {
    assert.deepEqual(getFilteredTradeSummary(filter, buy, short), {
      totalProfit, totalHoldingDays, annualizedProfit,
    });
  });
}

test("선택한 유형의 보유기간이 없으면 연수익률은 없다", () => {
  assert.deepEqual(getFilteredTradeSummary("short", buy, { totalProfit: 0, totalHoldingDays: 0 }), {
    totalProfit: 0, totalHoldingDays: 0, annualizedProfit: null,
  });
});
