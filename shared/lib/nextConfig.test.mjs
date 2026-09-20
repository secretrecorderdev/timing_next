import assert from "node:assert/strict";
import test from "node:test";

test("개발 WebView 호스트를 Next.js 허용 Origin으로 전달한다", async () => {
  const previous = process.env.TIMING_ALLOWED_DEV_ORIGIN;
  process.env.TIMING_ALLOWED_DEV_ORIGIN = "192.168.219.43";

  try {
    const { default: nextConfig } = await import(`../../next.config.ts?test=${Date.now()}`);
    assert.deepEqual(nextConfig.allowedDevOrigins, ["192.168.219.43"]);
  } finally {
    if (previous === undefined) {
      delete process.env.TIMING_ALLOWED_DEV_ORIGIN;
    } else {
      process.env.TIMING_ALLOWED_DEV_ORIGIN = previous;
    }
  }
});
