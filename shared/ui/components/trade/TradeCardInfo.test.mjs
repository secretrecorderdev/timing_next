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

test("청산 완료 카드 날짜는 기존 대주매도 시간을 유지한다", () => {
  const html = renderToStaticMarkup(TradeCardInfo({
    buyState: 12, buyPrice: 10000, sellPrice: 11000, currentPrice: 12000,
    holdingDays: 3, buyDateTime: "2026-10-24 09:00",
    timingDateTime: "2026-10-27 10:35", profit: -10,
  }));
  assert.ok(html.includes("2026-10-24 09:00"), html);
  assert.ok(!html.includes("2026-10-27 10:35"), html);
});

test("대주청산 신호 카드 날짜는 timing_date를 사용한다", () => {
  const html = renderToStaticMarkup(TradeCardInfo({
    buyState: 13, buyPrice: 10000, sellPrice: 11000, currentPrice: 12000,
    holdingDays: 3, buyDateTime: "2026-10-24 09:00",
    timingDateTime: "2026-10-27 10:35", profit: -10,
  }));
  assert.ok(html.includes("2026-10-27 10:35"), html);
  assert.ok(!html.includes("2026-10-24 09:00"), html);
});

for (const [buyState, label, value] of [
  [13, "대주매도가", 10000],
  [11, "현재가", 12000],
  [12, "청산가", 11000],
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
