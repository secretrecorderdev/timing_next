import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as riskDaily from "../types/riskDaily.ts";
import * as riskDailySummary from "../types/riskDailySummary.ts";

const require = createRequire(import.meta.url);
const source = readFileSync(new URL("./RiskDailyList.tsx", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS },
});
const context = { exports: {}, require: (id) => id.endsWith("/riskDaily") ? riskDaily : id.endsWith("/riskDailySummary") ? riskDailySummary : require(id) };
vm.runInNewContext(outputText, context);
const render = (props) => renderToStaticMarkup(createElement(context.exports.RiskDailyList, props));
const items = [10, 20, 30].map((risk10Signal, index) => ({ timingDate: [202611239999, 202611229999, 202611209999][index], risk10Score: 74.58, risk10Signal, kospiCloseValue: 4869.96, buyBenefit: 12, shortBenefit: -6, buyCount: 3, shortCount: 2 }));

test("일별 목록은 날짜·코스피·신호만 표시하고 현재·점수는 표시하지 않는다", () => {
  const html = render({ items });
  for (const text of ["날짜", "코스피", "라벨", "2026-11-20", "4,869.96", "매수", "혼합", "매도", "text-red-700", "text-amber-700", "text-blue-700"]) assert.ok(html.includes(text), html);
  const table = html.slice(html.indexOf("<table"));
  for (const text of ["현재", "74.58", "수익률", "보유 기간", "총합", "매수 통계"]) assert.ok(!table.includes(text), table);
});

test("목록 위에 세 신호의 매수·대주매도 이익 합과 실제 건수·건당 수익률을 표시한다", () => {
  const html = render({ items });
  const summary = html.slice(0, html.indexOf("<table"));
  for (const text of ["매수 추천", "매수/매도 혼합", "매도 추천", "매수", "대주매도", "이익 합 +12.00%", "이익 합 -6.00%", "3건", "2건", "건당 수익률 +4.00%", "건당 수익률 -3.00%", "text-red-700", "text-amber-700", "text-blue-700"]) assert.ok(summary.includes(text), html);
});

test("로딩·오류·빈 목록을 구분하고 오류 시 기존 데이터를 표시하지 않는다", () => {
  assert.ok(render({ items: [], isLoading: true }).includes("불러오는 중"));
  const error = render({ items, isError: true });
  assert.ok(error.includes("불러오지 못했습니다"));
  assert.ok(!error.includes("4,869.96"));
  assert.ok(render({ items: [] }).includes("표시할 위험도 내역이 없습니다"));
});

test("코스피와 신호가 null이면 0이나 임의의 매매 신호 대신 대시를 표시한다", () => {
  const fullHtml = render({ items: [{ ...items[0], kospiCloseValue: null, risk10Signal: null }] });
  const html = fullHtml.slice(fullHtml.indexOf("<table"));
  assert.ok(!html.includes("0.00"));
  assert.ok(!html.includes(">매수<"));
  assert.ok(html.includes(">-<"));
});

test("0건의 건당 수익과 이익 미집계는 대시로 표시한다", () => {
  const html = render({ items: [{ ...items[0], buyBenefit: 0, buyCount: 0, shortBenefit: null }] });
  assert.ok(html.includes("이익 합 0.00%"), html);
  assert.ok(html.includes("이익 합 -"), html);
  assert.ok(html.includes("건당 수익률 -"), html);
  assert.ok(!html.includes("NaN"));
  assert.ok(!html.includes("Infinity"));
});
