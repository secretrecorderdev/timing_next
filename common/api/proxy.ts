import { NextResponse } from "next/server";

const BACKEND_BASE_URL = process.env.TIMING_NODE_API_BASE_URL ?? "http://127.0.0.1:3001";

export async function proxyPostToBackend(
  path: string,
  body?: unknown,
  errorMessage = "API proxy failed"
) {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
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
    console.error(`${path} proxy failed`, error);
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
