import assert from "node:assert/strict";
import test from "node:test";
import { getRiskDailySummary } from "./riskDailySummary.ts";

const row = { timingDate: 202611239999, risk10Score: 50, risk10Signal: 10, kospiCloseValue: 4000, buyBenefit: 12, shortBenefit: -6, buyCount: 3, shortCount: 2 };

test("신호별로 이익과 실제 진입 건수를 합산하고 일별 평균이 아닌 건당 수익을 계산한다", () => {
  const items = [row, { ...row, buyBenefit: -2, shortBenefit: 9, buyCount: 1, shortCount: 1 }, { ...row, risk10Signal: 20 }, { ...row, risk10Signal: 30 }];
  const result = getRiskDailySummary(items);
  assert.deepEqual(result.map((group) => group.signal), [10, 20, 30]);
  assert.deepEqual(result[0].buy, { totalBenefit: 10, count: 4, averageBenefit: 2.5 });
  assert.deepEqual(result[0].short, { totalBenefit: 3, count: 3, averageBenefit: 1 });
  assert.deepEqual(result[1].buy, { totalBenefit: 12, count: 3, averageBenefit: 4 });
  assert.deepEqual(result[2].short, { totalBenefit: -6, count: 2, averageBenefit: -3 });
  assert.equal(items[0].buyBenefit, 12);
});

test("이익이 null인 날짜의 건수는 해당 방향에서만 제외한다", () => {
  const [group] = getRiskDailySummary([
    { ...row, buyBenefit: null, buyCount: 100 },
    { ...row, shortBenefit: null, shortCount: 200 },
  ]);
  assert.deepEqual(group.buy, { totalBenefit: 12, count: 3, averageBenefit: 4 });
  assert.deepEqual(group.short, { totalBenefit: -6, count: 2, averageBenefit: -3 });
});

test("빈 그룹과 null 이익은 미집계로 유지하고 0건은 나누지 않는다", () => {
  for (const group of getRiskDailySummary([])) {
    assert.deepEqual(group.buy, { totalBenefit: null, count: 0, averageBenefit: null });
    assert.deepEqual(group.short, { totalBenefit: null, count: 0, averageBenefit: null });
  }
  const [group] = getRiskDailySummary([{ ...row, buyBenefit: 0, buyCount: 0, shortBenefit: null }]);
  assert.deepEqual(group.buy, { totalBenefit: 0, count: 0, averageBenefit: null });
  assert.deepEqual(group.short, { totalBenefit: null, count: 0, averageBenefit: null });
});

test("신호가 없거나 알 수 없는 행은 요약에 포함하지 않는다", () => {
  assert.deepEqual(getRiskDailySummary([{ ...row, risk10Signal: null }, { ...row, risk10Signal: 99 }]), getRiskDailySummary([]));
});
