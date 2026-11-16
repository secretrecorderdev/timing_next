import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";
import { getPageRefreshTarget } from "../../lib/pageRefresh.ts";

const require = createRequire(import.meta.url);
const source = readFileSync(new URL("./Header.tsx", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS },
});

function getNodes(tree) {
  if (!tree || typeof tree !== "object") return [];
  return [tree, ...[tree.props?.children].flat(Infinity).flatMap(getNodes)];
}

for (const [path, visible] of [
  ["/ko/timing", true], ["/ko/hold", true], ["/ko/item/005930", true],
  ["/en/item/005930/", true], ["/ko/item", false], ["/ko/login", false],
]) {
  test(`${path}의 거래 유형 필터 표시 범위`, () => {
    let cycled = false;
    const noop = () => null;
    const state = { tradeTypeFilter: "short", viewMode: "detailed", cycleTradeTypeFilter: () => { cycled = true; } };
    const useStore = (select) => select ? select(state) : {};
    const context = {
      exports: {},
      require: (id) => {
        if (id === "react") return { useState: (initial) => [initial, noop] };
        if (id === "react/jsx-runtime") return require(id);
        if (id === "next/navigation") return { usePathname: () => path };
        if (id.endsWith("/pageRefresh")) return { getPageRefreshTarget };
        if (id.includes("/store/")) return new Proxy({}, { get: () => useStore });
        return new Proxy({ default: noop }, { get: (target, key) => target[key] ?? noop });
      },
    };
    vm.runInNewContext(outputText, context);
    const button = getNodes(context.exports.Header()).find((node) => node.type === "button" && node.props.title === "대주매도만");
    assert.equal(Boolean(button), visible);
    if (button) {
      assert.ok(button.props.className.includes("text-purple-600"));
      button.props.onClick();
      assert.equal(cycled, true);
    }
  });
}
