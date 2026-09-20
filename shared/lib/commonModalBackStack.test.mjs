import assert from "node:assert/strict";
import test from "node:test";

import {
  closeTopmostCommonModal,
  registerCommonModalBackHandler,
  resetCommonModalBackStack,
} from "./commonModalBackStack.ts";

test.afterEach(() => {
  resetCommonModalBackStack();
});

test("뒤로가기는 가장 나중에 열린 공통 모달 하나만 닫는다", () => {
  const closed = [];
  registerCommonModalBackHandler(() => closed.push("first"));
  registerCommonModalBackHandler(() => closed.push("second"));

  assert.equal(closeTopmostCommonModal(), true);
  assert.deepEqual(closed, ["second"]);
});

test("열린 공통 모달이 없으면 뒤로가기를 처리하지 않는다", () => {
  assert.equal(closeTopmostCommonModal(), false);
});

test("닫힌 모달은 뒤로가기 대상에서 제거한다", () => {
  let closed = false;
  const unregister = registerCommonModalBackHandler(() => {
    closed = true;
  });

  unregister();

  assert.equal(closeTopmostCommonModal(), false);
  assert.equal(closed, false);
});