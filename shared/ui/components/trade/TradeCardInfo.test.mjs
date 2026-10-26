import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";
import { renderToStaticMarkup } from "react-dom/server";

const source = readFileSync(new URL("./TradeCardInfo.tsx", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS },
});
const context = { exports: {}, require: createRequire(import.meta.url) };
vm.runInNewContext(outputText, context);
const { TradeCardInfo } = context.exports;

for (const [buyState, label, value] of [
  [13, "대주매도가", 10000],
  [11, "현재가", 12000],
  [12, "현재가", 12000],
  [1, "현재가", 12000],
  [2, "매도가", 11000],
  [3, "매수가", 10000],
]) {
  test(`유형 ${buyState}의 ${label} 표시값을 확인한다`, () => {
    const html = renderToStaticMarkup(TradeCardInfo({
      buyState, buyPrice: 10000, sellPrice: 11000, currentPrice: 12000,
      holdingDays: 3, buyDateTime: "2026-10-24", profit: 2,
    }));
    assert.ok(html.includes(`${label}(${value.toLocaleString()})`));
  });
}
