import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { getFilteredTradeSummary } from "./tradeSummary.ts";
import { getRiskDailySignal } from "../risk/types/riskDaily.ts";

const require = createRequire(import.meta.url);
const { outputText } = ts.transpileModule(readFileSync(new URL("./TimingPageClient.tsx", import.meta.url), "utf8"), {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS },
});

for (const [signal, label, color] of [
  [10, "매수 추천", "red"],
  [20, "매수/매도 혼합", "amber"],
  [30, "매도 추천", "blue"],
  [null, "매매 신호", "slate"],
]) {
test(`최신 신호 ${signal}의 진입 버튼은 ${label} 문구와 ${color} 색상을 표시한다`, () => {
  let listProps;
  const context = { exports: {}, require: (id) => {
    if (id.endsWith("/useLatestRisk") || id.endsWith("/usePeriodRisk")) throw new Error("이전 위험도 API를 호출하면 안 됩니다.");
    if (id.endsWith("/useRiskDaily")) return { useRiskDaily: (enabled) => {
      assert.notEqual(enabled, false, "모달을 열기 전에도 최신 신호를 조회해야 합니다.");
      return { data: [{ timingDate: 202611209999, risk10Signal: signal }, { timingDate: 202611199999, risk10Signal: 10 }], refetch: () => {}, isLoading: false, isError: false };
    } };
    if (id.endsWith("/riskDaily")) return { getRiskDailySignal };
    if (id.endsWith("/RiskDailyList")) return { RiskDailyList: (props) => { listProps = props; return "일별 위험도 목록"; } };
    if (id.endsWith("/useTimingTradeItems")) return { useTimingTradeItems: () => ({ items: [], refetch: () => {} }) };
    if (id.endsWith("/usePageRefreshStore")) return { usePageRefreshStore: (select) => select({ timingRevision: 0 }) };
    if (id.endsWith("/useTradeViewStore")) return { useTradeViewStore: (select) => select({ tradeTypeFilter: "all" }) };
    if (id.endsWith("/tradeTypeFilter")) return { filterTradeItems: (items) => items };
    if (id === "./tradeSummary") return { getFilteredTradeSummary };
    if (id.endsWith("/dateRange")) return { toRangeByPreset: () => ({ startDate: "202611010000", endDate: "202611242359" }), getRangeSummaryLabel: () => "해당 기간", formatDateInputValue: (v) => v };
    if (id.endsWith("/CommonModal")) return { default: ({ title, children }) => createElement("section", null, title, children) };
    if (id.endsWith("/CommonDetailGrid")) return { default: () => null };
    for (const name of ["TradeList", "TradeDetailModal", "DateRangeFilter", "PeriodSummaryCard"]) {
      if (id.endsWith(`/${name}`)) return { [name]: () => null };
    }
    return require(id);
  } };
  vm.runInNewContext(outputText, context);
  const html = renderToStaticMarkup(createElement(context.exports.default, { today: "2026-11-24" }));
  assert.ok(html.includes(`>${label}</button>`), html);
  assert.ok(html.includes(`text-${color}-700`), html);
  assert.ok(!html.includes(">위험도</button>"), html);
  assert.ok(html.includes("일별 위험도 목록"), html);
  assert.ok(!html.includes("현재"), html);
  assert.ok(!html.includes("각 위험도 별 매수 통계"), html);
  assert.equal(listProps.items[0].timingDate, 202611209999);
});
}
