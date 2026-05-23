import axios, { AxiosError, type AxiosRequestConfig, type Method } from "axios";
import { useAuthStore } from "@/shared/store/useAuthStore";

export interface ApiRequestOptions<TBody = unknown>
  extends Omit<AxiosRequestConfig<TBody>, "url" | "data" | "method"> {
  method?: Method;
  body?: TBody;
}

interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

interface AuthTokenPayload {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  refreshTokenExpiresIn: number;
}

interface RetryableAxiosRequestConfig<T = unknown> extends AxiosRequestConfig<T> {
  _retry?: boolean;
}

const BACKEND_BASE_URL = "/api";

export const apiClient = axios.create({
  baseURL: BACKEND_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<AuthTokenPayload | null> | null = null;
let interceptorsInstalled = false;

function shouldSkipAuth(config?: AxiosRequestConfig) {
  const url = config?.url ?? "";
  return url.includes("/auth/google") || url.includes("/auth/refresh");
}

async function refreshAccessToken(): Promise<AuthTokenPayload | null> {
  const authState = useAuthStore.getState();
  const refreshToken = authState.token?.refreshToken;

  if (!refreshToken) {
    console.warn("[jang][axios] no refresh token available");
    return null;
  }

  console.log("[jang][axios] requesting /auth/refresh", {
    refreshTokenLength: refreshToken.length,
  });

  const response = await apiClient.post<ApiResponse<{ token: AuthTokenPayload }>>("/auth/refresh", {
    refreshToken,
  });

  const nextToken = response.data.data.token;
  useAuthStore.getState().setToken(nextToken);

  console.log("[jang][axios] refresh success", {
    expiresIn: nextToken.expiresIn,
    refreshTokenExpiresIn: nextToken.refreshTokenExpiresIn,
  });

  return nextToken;
}

function installAuthInterceptors() {
  if (interceptorsInstalled) {
    return;
  }

  interceptorsInstalled = true;

  apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token?.accessToken;

    if (!shouldSkipAuth(config) && token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
      console.log("[jang][axios] attached access token", {
        url: config.url,
        method: config.method,
      });
    }

    return config;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableAxiosRequestConfig | undefined;
      const status = error.response?.status;

      console.error("[jang][axios] response error", {
        url: originalRequest?.url,
        method: originalRequest?.method,
        status,
        code: error.code,
      });

      if (!originalRequest || status !== 401 || shouldSkipAuth(originalRequest) || originalRequest._retry) {
        throw error;
      }

      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          console.log("[jang][axios] starting refresh flow", {
            url: originalRequest.url,
          });
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
        } else {
          console.log("[jang][axios] waiting for in-flight refresh", {
            url: originalRequest.url,
          });
        }

        const nextToken = await refreshPromise;
        if (!nextToken) {
          throw error;
        }

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${nextToken.accessToken}`;

        console.log("[jang][axios] retrying original request", {
          url: originalRequest.url,
          method: originalRequest.method,
        });

        return await apiClient.request(originalRequest);
      } catch (refreshError) {
        console.error("[jang][axios] refresh failed, logging out", refreshError);
        useAuthStore.getState().logout();
        throw refreshError;
      }
    }
  );
}

installAuthInterceptors();

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
