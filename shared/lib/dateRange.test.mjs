import assert from "node:assert/strict";
import test from "node:test";

import * as dateRange from "./dateRange.ts";

test("데이터 시작일부터 현재까지 연도·반기 기간을 생성한다", () => {
  assert.equal(typeof dateRange.getCalendarRangeOptions, "function");
  const options = dateRange.getCalendarRangeOptions("2023-08-01", "2026-10-24");

  assert.deepEqual(options.map(({ label }) => label), [
    "2026년 하반기", "2026년 상반기", "2026년 전체",
    "2025년 하반기", "2025년 상반기", "2025년 전체",
    "2024년 하반기", "2024년 상반기", "2024년 전체",
    "2023년 하반기", "2023년 전체",
    "전체",
  ]);
  assert.deepEqual(options[0], {
    value: "2026-h2", label: "2026년 하반기",
    startDate: "202607010000", endDate: "202610242359",
  });
  assert.deepEqual(options.find(({ value }) => value === "2023-h2"), {
    value: "2023-h2", label: "2023년 하반기",
    startDate: "202308010000", endDate: "202312312359",
  });
  assert.deepEqual(options.find(({ value }) => value === "2024-full"), {
    value: "2024-full", label: "2024년 전체",
    startDate: "202401010000", endDate: "202412312359",
  });
  assert.deepEqual(options.at(-1), {
    value: "all", label: "전체",
    startDate: "202308010000", endDate: "202610242359",
  });
});
