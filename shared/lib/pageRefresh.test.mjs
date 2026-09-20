import assert from "node:assert/strict";
import test from "node:test";

import { getPageRefreshTarget } from "./pageRefresh.ts";
import { usePageRefreshStore } from "../store/usePageRefreshStore.ts";

test("실시간 신호와 보유 주식 경로만 새로고침 대상으로 판별한다", () => {
  assert.equal(getPageRefreshTarget("/ko/timing"), "timing");
  assert.equal(getPageRefreshTarget("/en/hold"), "hold");
  assert.equal(getPageRefreshTarget("/ko/item"), null);
});

test("요청한 화면의 새로고침 revision만 증가시킨다", () => {
  const before = usePageRefreshStore.getState();

  before.requestRefresh("timing");
  const afterTiming = usePageRefreshStore.getState();
  assert.equal(afterTiming.timingRevision, before.timingRevision + 1);
  assert.equal(afterTiming.holdRevision, before.holdRevision);

  afterTiming.requestRefresh("hold");
  const afterHold = usePageRefreshStore.getState();
  assert.equal(afterHold.timingRevision, afterTiming.timingRevision);
  assert.equal(afterHold.holdRevision, afterTiming.holdRevision + 1);
});
