import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";
import { filterTradeItems } from "../../shared/lib/tradeTypeFilter.ts";
import { getFilteredTradeSummary } from "../timing/tradeSummary.ts";

const require = createRequire(import.meta.url);
const source = readFileSync(new URL("./StockDetailPageClient.tsx", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS },
});

test("종목 상세 페이지 하단에 별도 바로가기 아이콘을 표시하지 않는다", () => {
  assert.ok(!source.includes("<TradeActionButtons"));
});

function getPage(buyState, filter = "all", items = []) {
  const noop = () => null;
  const Chart = () => null;
  const rawItems = [{ id: 1, buyState, buyDate: "202610240900", sellDate: "202610271030", timingDate: "202610281035" }];
  const context = {
    exports: {},
    require: (id) => {
      if (id === "react") return { useMemo: (fn) => fn(), useState: (initial) => [initial, noop] };
      if (id === "react/jsx-runtime") return require(id);
      if (id.endsWith("/useDetailTimingTradeItems")) return { useDetailTimingTradeItems: () => ({ items, rawItems }) };
      if (id.endsWith("/useTradeViewStore")) return { useTradeViewStore: (select) => select({ tradeTypeFilter: filter }) };
      if (id.endsWith("/tradeTypeFilter")) return { filterTradeItems };
      if (id.endsWith("/tradeSummary")) return { getFilteredTradeSummary };
      if (id.endsWith("/useDailyCloseChart")) return { useDailyCloseChart: () => ({ items: [20261024, 20261027, 20261028].map((date) => ({ date, price: 10000 })) }) };
      if (id.endsWith("/StockDailyCloseChartCard")) return { StockDailyCloseChartCard: Chart };
      if (id.endsWith("/dateRange")) return {
        toRangeByPreset: () => ({ startDate: "20260101", endDate: "20261030" }),
        getRangeSummaryLabel: () => "기간", formatDateInputValue: (value) => value,
        MIN_TIMING_DATE: "20230801",
      };
      return new Proxy({ default: noop }, { get: (target, key) => target[key] ?? noop });
    },
  };
  vm.runInNewContext(outputText, context);
  const tree = context.exports.default({ stock: { code: "005930", baseName: "삼성전자" }, today: "20261030" });
  return tree;
}

function getNodes(tree) {
  if (!tree || typeof tree !== "object") return [];
  return [tree, ...[tree.props?.children].flat(Infinity).flatMap(getNodes)];
}

function getMarkers(buyState, filter = "all") {
  const chart = getNodes(getPage(buyState, filter)).find((node) => node.props?.markers);
  return JSON.parse(JSON.stringify(chart.props.markers));
}

for (const [filter, profit, days, count] of [["all", 20, 9, 6], ["buy", 12, 3, 3], ["short", 8, 6, 3]]) {
  test(`종목 상세 ${filter} 필터는 실시간 신호와 같은 집계 및 목록을 사용한다`, () => {
    const items = [1, 2, 3, 11, 12, 13].map((buyState, index) => ({
      buyState, profit: [10, 100, 2, 5, 100, 3][index], holdingDays: [2, 100, 1, 4, 100, 2][index],
    }));
    const nodes = getNodes(getPage(13, filter, items));
    const summary = nodes.find((node) => node.props?.totalProfit != null).props;
    assert.equal(summary.totalProfit, profit);
    assert.equal(summary.totalHoldingDays, days);
    assert.equal(summary.annualizedProfit, profit / (days / 365));
    assert.equal(nodes.find((node) => Array.isArray(node.props?.items) && node.props.items[0]?.buyState).props.items.length, count);
    assert.equal(nodes.filter((node) => node.props?.markers).length, 1);
  });
}

test("매수만 차트는 대주 마커를 숨기고 대주매도만 차트는 매수·매도 마커를 숨긴다", () => {
  assert.equal(getMarkers(13, "buy").length, 0);
  assert.equal(getMarkers(11, "buy").length, 0);
  assert.equal(getMarkers(2, "short").length, 0);
  assert.equal(getMarkers(13, "short")[0].text, "청산");
  assert.equal(getMarkers(2, "buy")[0].text, "매수");
});

for (const [state, expected] of [
  [1, [["매수", "2026-10-24", "#ef4444", "arrowUp", "belowBar"]]],
  [2, [["매수", "2026-10-24", "#ef4444", "arrowUp", "belowBar"], ["매도", "2026-10-27", "#2563eb", "arrowDown", "aboveBar"]]],
  [3, [["매도", "2026-10-27", "#2563eb", "arrowDown", "aboveBar"]]],
  [11, [["대주매도", "2026-10-24", "#a855f7", "arrowDown", "aboveBar"]]],
  [12, [["대주매도", "2026-10-24", "#a855f7", "arrowDown", "aboveBar"]]],
  [13, [["청산", "2026-10-28", "#22c55e", "arrowUp", "belowBar"]]],
]) {
  test(`차트 유형 ${state}의 마커 날짜·색상·방향`, () => {
    assert.deepEqual(getMarkers(state).map(({ text, time, color, shape, position }) => [text, time, color, shape, position]), expected);
  });
}
