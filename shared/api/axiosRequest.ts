import axios, { type AxiosRequestConfig, type Method } from "axios";

export interface ApiRequestOptions<TBody = unknown>
  extends Omit<AxiosRequestConfig<TBody>, "url" | "data" | "method"> {
  method?: Method;
  body?: TBody;
}

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8082";

export const apiClient = axios.create({
  baseURL: BACKEND_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function apiRequest<TResponse, TBody = unknown>(
  input: string | URL,
  options: ApiRequestOptions<TBody> = {}
): Promise<TResponse> {
  const { body, headers, method, ...config } = options;

  const response = await apiClient.request<TResponse>({
    url: input.toString(),
    method,
    headers,
    data: body,
    ...config,
  });

  return response.data;
}
