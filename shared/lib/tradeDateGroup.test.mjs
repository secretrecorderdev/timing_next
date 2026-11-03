import assert from "node:assert/strict";
import test from "node:test";
import { groupTradesByDate, createTradeListRows } from "./tradeDateGroup.ts";

const item = (buyState, timingDateTime, code = "005930") => ({
  code, name: "테스트", buyState, timingDateTime,
  buyDateTime: "2026-01-01 09:00", buyPrice: 100, currentPrice: 110,
  holdingDays: 1, profit: 10,
});

test("신호 날짜별로 묶고 완료된 진입 신호를 중복 없이 집계한다", () => {
  const items = [1, 2, 3, 11, 12, 13].map((state) => item(state, "2026-11-03 09:00"));
  const groups = groupTradesByDate(items);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].dateKey, "2026-11-03");
  assert.equal(groups[0].label, "2026.11.03 (화)");
  assert.equal(groups[0].total, 6);
  assert.deepEqual(groups[0].counts, { buy: 2, sell: 1, short: 2, cover: 1 });
  assert.deepEqual(groups[0].items, items);
});

test("날짜와 시간은 최신순이며 같은 시간의 순서와 입력 배열을 유지한다", () => {
  const items = [
    item(1, "2026-11-02 15:00", "a"),
    item(3, "2026-11-03 09:00", "b"),
    item(11, "2026-11-03 15:00", "c"),
    item(13, "2026-11-03 15:00", "d"),
  ];
  items.forEach(Object.freeze);
  Object.freeze(items);
  const groups = groupTradesByDate(items);
  assert.deepEqual(groups.map((group) => group.dateKey), ["2026-11-03", "2026-11-02"]);
  assert.deepEqual(groups[0].items.map((row) => row.code), ["c", "d", "b"]);
  assert.deepEqual(items.map((row) => row.code), ["a", "b", "c", "d"]);
});

test("잘못된 날짜와 시각은 매수일로 대체하지 않고 날짜 미상으로 마지막에 모은다", () => {
  const invalid = [null, undefined, "-", "", "2026-02-29 09:00", "2026-13-01 09:00", "2026-11-03 24:00", "2026-11-03 09:60"];
  const groups = groupTradesByDate([
    ...invalid.map((date) => item(1, date)),
    item(3, "2024-02-29 09:00"),
  ]);
  assert.equal(groups.length, 2);
  assert.equal(groups[0].dateKey, "2024-02-29");
  assert.equal(groups[1].dateKey, "unknown");
  assert.equal(groups[1].label, "날짜 미상");
  assert.equal(groups[1].total, invalid.length);
});

test("빈 입력과 미정 상태를 보존하고 필터별 날짜 합계가 표시 개수와 일치한다", () => {
  assert.deepEqual(groupTradesByDate([]), []);
  const items = [0, 1, 2, 3, 11, 12, 13, 99].map((state, index) =>
    item(state, `2026-11-${index % 2 ? "02" : "03"} 09:00`));
  for (const states of [[0, 1, 2, 3, 11, 12, 13, 99], [1, 2, 3], [11, 12, 13]]) {
    const visible = items.filter((row) => states.includes(row.buyState));
    const groups = groupTradesByDate(visible);
    assert.equal(groups.reduce((sum, group) => sum + group.total, 0), visible.length);
    assert.equal(groups.flatMap((group) => group.items).length, visible.length);
    assert.equal(new Set(groups.flatMap((group) => group.items)).size, visible.length);
  }
  const [unknown] = groupTradesByDate([item(99, null)]);
  assert.equal(unknown.total, 1);
  assert.deepEqual(unknown.counts, { buy: 0, sell: 0, short: 0, cover: 0 });
});

test("그룹 모드에서 날짜 헤더와 카드를 한 가상 행 목록으로 구성한다", () => {
  const items = [item(1, "2026-11-02 09:00"), item(13, "2026-11-03 09:00")];
  const rows = createTradeListRows(items, true);
  assert.deepEqual(rows.map((row) => row.type), ["header", "trade", "header", "trade"]);
  assert.equal(rows[0].group.dateKey, "2026-11-03");
  assert.equal(rows[1].item, items[1]);
  assert.equal(rows[3].item, items[0]);
  assert.equal(new Set(rows.map((row) => row.key)).size, rows.length);
  assert.deepEqual(createTradeListRows([], true), []);
});

test("기본 모드는 기존 순서와 모든 카드를 유지하고 중복 종목의 키를 구분한다", () => {
  const items = [item(1, null), item(1, null), item(3, "2026-11-03 09:00")];
  const rows = createTradeListRows(items);
  assert.deepEqual(rows.map((row) => row.type), ["trade", "trade", "trade"]);
  assert.deepEqual(rows.map((row) => row.item), items);
  assert.equal(new Set(rows.map((row) => row.key)).size, rows.length);
});
