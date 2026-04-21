import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE_URL = process.env.TIMING_NODE_API_BASE_URL ?? "http://127.0.0.1:3001";

export async function postTimingRoute(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(`${BACKEND_BASE_URL}/stock/getTimingList`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body ?? {}),
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
    console.error("/api/timing proxy failed", error);
    return NextResponse.json({ message: "Timing API proxy failed" }, { status: 500 });
  }
}
