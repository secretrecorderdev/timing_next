export interface ApiRequestOptions<TBody = unknown> extends Omit<RequestInit, "body"> {
  body?: TBody;
}

export async function apiRequest<TResponse, TBody = unknown>(
  input: RequestInfo | URL,
  options: ApiRequestOptions<TBody> = {}
): Promise<TResponse> {
  const { body, headers, ...init } = options;

  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<TResponse>;
}
