import assert from "node:assert/strict";
import test from "node:test";
import { filterTradeItems } from "./tradeTypeFilter.ts";

const items = [1, 2, 3, 11, 12, 13].map((buyState) => ({ buyState }));
for (const [filter, states] of [
  ["all", [1, 2, 3, 11, 12, 13]],
  ["buy", [1, 2, 3]],
  ["short", [11, 12, 13]],
]) {
  test(`${filter} 보기에서 동일한 거래 유형을 필터링한다`, () => {
    assert.deepEqual(filterTradeItems(items, filter).map((item) => item.buyState), states);
  });
}

test("보유주식 목록·개수·수익률·보유기간은 같은 필터를 따른다", () => {
  const holdings = [
    { buyState: 1, profit: 10, holdingDays: 5 },
    { buyState: 11, profit: -3, holdingDays: 2 },
  ];
  for (const [filter, count, profit, days] of [
    ["all", 2, 7, 7], ["buy", 1, 10, 5], ["short", 1, -3, 2],
  ]) {
    const filtered = filterTradeItems(holdings, filter);
    assert.equal(filtered.length, count);
    assert.equal(filtered.reduce((sum, item) => sum + item.profit, 0), profit);
    assert.equal(filtered.reduce((sum, item) => sum + item.holdingDays, 0), days);
  }
  assert.equal(holdings.length, 2);
});
