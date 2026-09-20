import assert from "node:assert/strict";
import test from "node:test";

import {
  handleAndroidBack,
  isTimingItemDetailPath,
} from "./androidBackNavigation.ts";

test("열린 공통 모달이 있으면 종료 확인 대신 해당 모달만 닫는다", () => {
  const calls = [];

  const result = handleAndroidBack({
    closeTopmostModal: () => {
      calls.push("close-modal");
      return true;
    },
    pathname: "/ko/timing",
    navigateBack: () => calls.push("navigate-back"),
    openExitConfirmation: () => calls.push("open-exit"),
  });

  assert.equal(result, "MODAL_CLOSED");
  assert.deepEqual(calls, ["close-modal"]);
});

test("열린 공통 모달이 없으면 종료 확인 모달을 연다", () => {
  const calls = [];

  const result = handleAndroidBack({
    closeTopmostModal: () => false,
    pathname: "/ko/timing",
    navigateBack: () => calls.push("navigate-back"),
    openExitConfirmation: () => calls.push("open-exit"),
  });

  assert.equal(result, "EXIT_CONFIRMATION_OPENED");
  assert.deepEqual(calls, ["open-exit"]);
});

test("종목 상세 경로에서는 이전 URL로 이동한다", () => {
  const calls = [];

  const result = handleAndroidBack({
    closeTopmostModal: () => false,
    pathname: "/ko/item/000100",
    navigateBack: () => calls.push("navigate-back"),
    openExitConfirmation: () => calls.push("open-exit"),
  });

  assert.equal(result, "PREVIOUS_URL_OPENED");
  assert.deepEqual(calls, ["navigate-back"]);
});

test("종목 목록과 다른 화면은 상세 경로로 취급하지 않는다", () => {
  assert.equal(isTimingItemDetailPath("/item/000100"), true);
  assert.equal(isTimingItemDetailPath("/ko/item/000100"), true);
  assert.equal(isTimingItemDetailPath("/en/item/AAPL"), true);
  assert.equal(isTimingItemDetailPath("/ko/item"), false);
  assert.equal(isTimingItemDetailPath("/ko/timing"), false);
});
