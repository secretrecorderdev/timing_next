import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";
import * as riskDaily from "../types/riskDaily.ts";

const require = createRequire(import.meta.url);
const { outputText } = ts.transpileModule(readFileSync(new URL("./riskDailyApi.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
});

test("GET /risk/daily를 본문 없이 호출하고 응답을 검증한다", async () => {
  const calls = [];
  const context = { exports: {}, require: (id) => {
    if (id.endsWith("/axiosRequest")) return { apiRequest: async (...args) => { calls.push(args); return { data: [] }; } };
    if (id.endsWith("/riskDaily")) return riskDaily;
    return require(id);
  } };
  vm.runInNewContext(outputText, context);
  assert.deepEqual(await context.exports.fetchRiskDaily(), []);
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], "/risk/daily");
  assert.equal(calls[0][1].method, "GET");
  assert.equal(Object.hasOwn(calls[0][1], "body"), false);
});
