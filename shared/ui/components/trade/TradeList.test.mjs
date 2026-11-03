import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createTradeListRows } from "../../../lib/tradeDateGroup.ts";

const require = createRequire(import.meta.url);
function loadComponent(name, overrides = {}) {
  const source = readFileSync(new URL(`./${name}.tsx`, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS },
  });
  const context = { exports: {}, require: (id) => overrides[id] ?? require(id) };
  vm.runInNewContext(outputText, context);
  return context.exports[name];
}
const TradeDateHeader = loadComponent("TradeDateHeader");
let virtualizerOptions;
const TradeList = loadComponent("TradeList", {
  "@/shared/lib/tradeDateGroup": { createTradeListRows },
  "./TradeDateHeader": { TradeDateHeader },
  "./TradeCard": { TradeCard: ({ item }) => createElement("div", { "data-card": item.code }, item.name) },
  "@tanstack/react-virtual": {
    useVirtualizer: (options) => {
      virtualizerOptions = options;
      return {
        getVirtualItems: () => Array.from({ length: options.count }, (_, index) => ({
          index, key: options.getItemKey?.(index) ?? index, start: index * 124, size: 124,
        })),
        getTotalSize: () => options.count * 124,
        measureElement: () => {},
      };
    },
  },
});
const items = [
  { code: "a", name: "첫날 종목", buyState: 1, timingDateTime: "2026-11-02 09:00", buyDateTime: "2026-11-02 09:00" },
  { code: "b", name: "둘째날 종목", buyState: 11, timingDateTime: "2026-11-03 09:00", buyDateTime: "2026-11-03 09:00" },
];

test("그룹 리스트에서 헤더와 카드를 함께 가상화하고 최신 날짜부터 표시한다", () => {
  const html = renderToStaticMarkup(createElement(TradeList, { items, groupByDate: true }));
  assert.equal(virtualizerOptions.count, 4);
  assert.ok(virtualizerOptions.getItemKey(0).startsWith("date:"));
  assert.ok(virtualizerOptions.getItemKey(1).includes("trade:"));
  assert.ok(virtualizerOptions.estimateSize(0) < virtualizerOptions.estimateSize(1));
  assert.ok(html.indexOf("2026.11.03") < html.indexOf("둘째날 종목"));
  assert.ok(html.indexOf("둘째날 종목") < html.indexOf("2026.11.02"));
  assert.equal((html.match(/data-card=/g) ?? []).length, 2);
});

test("비그룹 리스트는 헤더 없이 기존 카드 순서와 빈 결과 안내를 유지한다", () => {
  const html = renderToStaticMarkup(createElement(TradeList, { items }));
  assert.equal(virtualizerOptions.count, 2);
  assert.ok(!html.includes("<h2"));
  assert.ok(html.indexOf("첫날 종목") < html.indexOf("둘째날 종목"));
  assert.ok(renderToStaticMarkup(createElement(TradeList, { items: [], groupByDate: true })).includes("표시할 데이터가 없습니다."));
});

test("선택한 필터가 날짜 헤더에 전달된다", () => {
  const html = renderToStaticMarkup(createElement(TradeList, { items, groupByDate: true, tradeTypeFilter: "short" }));
  assert.ok(html.includes(">대주매도 "));
  assert.ok(html.includes(">청산 "));
  assert.ok(!html.includes(">매수 "));
});
