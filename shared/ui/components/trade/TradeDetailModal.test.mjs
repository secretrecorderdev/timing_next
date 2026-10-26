import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";
import { renderToStaticMarkup } from "react-dom/server";

const require = createRequire(import.meta.url);
const source = readFileSync(new URL("./TradeDetailModal.tsx", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS },
});
const context = {
  exports: {},
  require: (id) => {
    if (id.endsWith("/CommonModal")) return { default: ({ children }) => children };
    if (id.endsWith("/CommonDetailGrid")) return {
      default: ({ items }) => items.map(({ label, value }) => `${label}: ${value}`).join(" | "),
    };
    if (id.endsWith("/CommonUtils")) return { cn: (...classes) => classes.join(" ") };
    if (id === "./TradeActionButtons") return { TradeActionButtons: () => null };
    return require(id);
  },
};
vm.runInNewContext(outputText, context);
const { TradeDetailModal } = context.exports;

for (const [buyState, text, color] of [
  [1, "매수", "text-red-500"],
  [2, "매도됨", "text-gray-500"],
  [3, "매도", "text-blue-500"],
  [11, "대주매도", "text-purple-500"],
  [12, "청산됨", "text-gray-500"],
  [13, "대주청산", "text-green-500"],
]) {
  test(`상세보기 유형 ${buyState}의 상태 문구와 색상`, () => {
    const html = renderToStaticMarkup(TradeDetailModal({
      open: true, onClose() {},
      item: { buyState, code: "005930", name: "삼성전자", buyPrice: 10000,
        currentPrice: 12000, holdingDays: 3, profit: 2, buyDateTime: "2026-10-24" },
    }));
    assert.ok(html.includes(text), html);
    assert.ok(html.includes(color), html);
    assert.ok(!html.includes("미확정"), html);
  });
}

for (const buyState of [1, 2, 3, 11, 12, 13]) {
  test(`유형 ${buyState}에 맞는 진입 시간·가격 항목명을 표시한다`, () => {
    const html = renderToStaticMarkup(TradeDetailModal({
      open: true, onClose() {},
      item: { buyState, code: "005930", name: "삼성전자", buyPrice: 10000,
        currentPrice: 12000, holdingDays: 3, profit: 2, buyDateTime: "2026-10-24" },
    }));
    const isShort = [11, 12, 13].includes(buyState);
    assert.ok(html.includes(`${isShort ? "대주 매도 시간" : "매수 시간"}: 2026-10-24`), html);
    assert.ok(html.includes(`${isShort ? "대주매도 가격" : "매수 가격"}: ${(10000).toLocaleString()}원`), html);
  });
}
