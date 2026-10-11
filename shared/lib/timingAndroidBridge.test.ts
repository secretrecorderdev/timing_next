import assert from "node:assert/strict";
import test from "node:test";

// @ts-expect-error Node's test runner loads TypeScript directly with --experimental-strip-types.
const { createTimingAndroidBridgeClient } = await import("./timingAndroidBridge.ts");

class FakeTransport {
  listener?: (event: { data: string }) => void;
  sent: string[] = [];

  postMessage(message: string) {
    this.sent.push(message);
  }

  addEventListener(_type: "message", listener: (event: { data: string }) => void) {
    this.listener = listener;
  }

  respond(payload: unknown) {
    this.listener?.({ data: JSON.stringify(payload) });
  }
}

test("resolves native query responses by request id", async () => {
  const transport = new FakeTransport();
  const bridge = createTimingAndroidBridgeClient(transport, 100);

  const platformPromise = bridge.getPlatform();
  const platformRequest = JSON.parse(transport.sent[0]);
  assert.equal(platformRequest.method, "getPlatform");
  transport.respond({ id: platformRequest.id, ok: true, result: "ANDROID" });
  assert.equal(await platformPromise, "ANDROID");

  const enabledPromise = bridge.getNotificationEnabled();
  const enabledRequest = JSON.parse(transport.sent[1]);
  assert.equal(enabledRequest.method, "getNotificationEnabled");
  transport.respond({ id: enabledRequest.id, ok: true, result: true });
  assert.equal(await enabledPromise, true);
});

test("sends notification updates and finish commands", async () => {
  const transport = new FakeTransport();
  const bridge = createTimingAndroidBridgeClient(transport, 100);

  const updatePromise = bridge.setNotificationEnabled(true);
  const updateRequest = JSON.parse(transport.sent[0]);
  assert.deepEqual(
    { method: updateRequest.method, enabled: updateRequest.enabled },
    { method: "setNotificationEnabled", enabled: true },
  );
  transport.respond({ id: updateRequest.id, ok: true, result: null });
  await updatePromise;

  bridge.finishApp();
  const finishRequest = JSON.parse(transport.sent[1]);
  assert.equal(finishRequest.method, "finishApp");
});

test("rejects failed native responses", async () => {
  const transport = new FakeTransport();
  const bridge = createTimingAndroidBridgeClient(transport, 100);

  const requestPromise = bridge.getNotificationEnabled();
  const request = JSON.parse(transport.sent[0]);
  transport.respond({ id: request.id, ok: false, error: "invalid_params" });

  await assert.rejects(requestPromise, /invalid_params/);
});
