import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { filterTradeItems } from "../../shared/lib/tradeTypeFilter.ts";

const require = createRequire(import.meta.url);
const source = readFileSync(new URL("./HoldingPageClient.tsx", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS },
});
const items = [
  { buyState: 1, profit: 10, holdingDays: 5 },
  { buyState: 11, profit: -3, holdingDays: 2 },
];

for (const [filter, buyCount, shortCount, total, profit, days] of [
  ["all", 1, 1, 2, "+7.00", 7],
  ["buy", 1, null, 1, "+10.00", 5],
  ["short", null, 1, 1, "-3.00", 2],
]) {
  test(`보유중 ${filter} 필터에서 같은 색의 유형 개수와 목록·합계를 표시한다`, () => {
    const context = {
      exports: {},
      require: (id) => {
        if (id.endsWith("/useHoldingTradeItems")) return { useHoldingTradeItems: () => ({ items }) };
        if (id.endsWith("/useTradeViewStore")) return { useTradeViewStore: (select) => select({ tradeTypeFilter: filter }) };
        if (id.endsWith("/tradeTypeFilter")) return { filterTradeItems };
        if (id.endsWith("/TradeDetailModal")) return { TradeDetailModal: () => null };
        if (id.endsWith("/TradeList")) return { TradeList: ({ items: rows, groupByDate, dateBasis, tradeTypeFilter }) => {
          assert.equal(groupByDate, true);
          assert.equal(dateBasis, "entry");
          assert.equal(tradeTypeFilter, filter);
          return `목록 ${rows.map((row) => row.buyState).join(",")}`;
        } };
        return require(id);
      },
    };
    vm.runInNewContext(outputText, context);
    const html = renderToStaticMarkup(createElement(context.exports.default));
    for (const [label, count, color] of [["매수", buyCount, "red"], ["대주매도", shortCount, "purple"]]) {
      if (count == null) assert.ok(!html.includes(`${label} `), html);
      else assert.ok(html.includes(`class="text-${color}-500">${label} ${count}</span>`), html);
    }
    assert.ok(html.includes(`총 ${total}개`), html);
    assert.ok(html.includes(`수익률 합 ${profit}%`), html);
    assert.ok(html.includes(`총 보유기간 ${days}일`), html);
    assert.ok(html.includes(`목록 ${filterTradeItems(items, filter).map((row) => row.buyState).join(",")}`), html);
  });
}
