import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";
import { renderToStaticMarkup } from "react-dom/server";

const source = readFileSync(new URL("./TradeDateHeader.tsx", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS },
});
const context = { exports: {}, require: createRequire(import.meta.url) };
vm.runInNewContext(outputText, context);
const { TradeDateHeader } = context.exports;
const group = {
  dateKey: "2026-11-03", label: "2026.11.03 (화)", total: 6,
  counts: { buy: 2, sell: 1, short: 2, cover: 1 }, items: [],
};

for (const [filter, shown, hidden] of [
  ["all", ["매수", "매도", "대주매도", "청산"], []],
  ["buy", ["매수", "매도"], ["대주매도", "청산"]],
  ["short", ["대주매도", "청산"], ["매수", "매도"]],
]) {
  test(`${filter} 날짜 헤더는 필터에 맞는 카운트와 날짜·총 건수를 표시한다`, () => {
    const html = renderToStaticMarkup(TradeDateHeader({ group, tradeTypeFilter: filter }));
    assert.ok(html.includes(group.label));
    assert.ok(html.includes("총 "));
    for (const label of shown) assert.ok(html.includes(`>${label} `));
    for (const label of hidden) assert.ok(!html.includes(`>${label} `));
  });
}

test("0건과 날짜 미상도 표시하며 날짜 라벨은 HTML로 해석하지 않는다", () => {
  const html = renderToStaticMarkup(TradeDateHeader({
    group: { ...group, label: "날짜 미상<script>", counts: { buy: 0, sell: 0, short: 0, cover: 0 } },
  }));
  assert.ok(html.includes("날짜 미상&lt;script&gt;"));
  assert.ok(html.includes("매수 "));
  assert.ok(html.includes("청산 "));
  assert.ok(!html.includes("<script>"));
});
