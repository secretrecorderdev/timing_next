import { NextResponse } from "next/server";

const BACKEND_BASE_URL = process.env.TIMING_NODE_API_BASE_URL ?? "http://127.0.0.1:8001";

export async function POST() {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/stock/getHoldList`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (error) {
    console.error("/api/hold proxy failed", error);
    return NextResponse.json({ message: "Hold API proxy failed" }, { status: 500 });
  }
}
