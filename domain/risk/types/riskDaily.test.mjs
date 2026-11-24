import assert from "node:assert/strict";
import test from "node:test";
import { normalizeRiskDailyResponse, getRiskDailySignal, formatRiskDailyDate } from "./riskDaily.ts";

const row = { timingDate: 202611209999, risk10Score: 74.58, risk10Signal: 30, kospiCloseValue: 4869.96, buyBenefit: 12.3456, shortBenefit: -7.8901, buyCount: 3, shortCount: 2 };

test("일별 위험도 응답을 최신 날짜순으로 정렬하며 원본을 변경하지 않는다", () => {
  const data = [row, { ...row, timingDate: 202611239999 }];
  const result = normalizeRiskDailyResponse({ code: "SUCCESS", data });
  assert.deepEqual(result.map((item) => item.timingDate), [202611239999, 202611209999]);
  assert.equal(data[0].timingDate, 202611209999);
  assert.equal(result[1].kospiCloseValue, 4869.96);
  assert.equal(result[1].buyBenefit, 12.3456);
  assert.equal(result[1].shortBenefit, -7.8901);
  assert.equal(result[1].buyCount, 3);
  assert.equal(result[1].shortCount, 2);
  assert.equal(formatRiskDailyDate(result[1].timingDate), "2026-11-20");
});

test("매수·혼합·매도는 빨강·노랑·파랑으로 구분한다", () => {
  for (const [signal, label, color] of [[10, "매수", "red"], [20, "혼합", "amber"], [30, "매도", "blue"]]) {
    assert.equal(getRiskDailySignal(signal).label, label);
    assert.ok(getRiskDailySignal(signal).className.includes(`text-${color}-700`));
  }
  assert.equal(getRiskDailySignal(null).label, "-");
  assert.equal(getRiskDailySignal(99).label, "-");
});

test("빈 목록과 nullable 필드를 허용하고 잘못된 외부 응답은 거부한다", () => {
  assert.deepEqual(normalizeRiskDailyResponse({ data: [] }), []);
  const nullable = { ...row, risk10Score: null, risk10Signal: null, kospiCloseValue: null, buyBenefit: null, shortBenefit: null };
  assert.deepEqual(normalizeRiskDailyResponse({ data: [nullable] }), [nullable]);
  for (const payload of [null, { data: {} }, { data: [null] }, { data: [{ ...row, timingDate: "202611209999" }] }, { data: [{ ...row, kospiCloseValue: "<script>" }] }, { data: [{ ...row, risk10Score: Infinity }] }]) {
    assert.throws(() => normalizeRiskDailyResponse(payload));
  }
  for (const field of ["buyBenefit", "shortBenefit"]) {
    assert.throws(() => normalizeRiskDailyResponse({ data: [{ ...row, [field]: "invalid" }] }));
    assert.throws(() => normalizeRiskDailyResponse({ data: [{ ...row, [field]: Infinity }] }));
  }
  for (const field of ["buyCount", "shortCount"]) {
    for (const value of [null, undefined, "3", -1, 1.5, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
      assert.throws(() => normalizeRiskDailyResponse({ data: [{ ...row, [field]: value }] }));
    }
    assert.equal(normalizeRiskDailyResponse({ data: [{ ...row, [field]: 0 }] })[0][field], 0);
  }
});
