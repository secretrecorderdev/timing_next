export interface TimingAndroidTransport {
  postMessage(message: string): void;
  addEventListener(type: "message", listener: (event: { data: string }) => void): void;
}

export interface TimingAndroidBridgeClient {
  getPlatform(): Promise<"ANDROID">;
  getNotificationEnabled(): Promise<boolean>;
  setNotificationEnabled(enabled: boolean): Promise<void>;
  finishApp(): void;
}

type BridgeMethod =
  | "getPlatform"
  | "getNotificationEnabled"
  | "setNotificationEnabled"
  | "finishApp";

interface BridgeResponse {
  id: string;
  ok: boolean;
  result?: unknown;
  error?: string;
}

interface PendingRequest {
  resolve(value: unknown): void;
  reject(error: Error): void;
  timeout: ReturnType<typeof setTimeout>;
}

const DEFAULT_TIMEOUT_MILLIS = 5_000;
let requestSequence = 0;
let cachedTransport: TimingAndroidTransport | undefined;
let cachedClient: TimingAndroidBridgeClient | undefined;

function createRequestId(): string {
  requestSequence += 1;
  return `${Date.now().toString(36)}-${requestSequence.toString(36)}`;
}

function parseResponse(data: string): BridgeResponse | undefined {
  try {
    const response = JSON.parse(data) as Partial<BridgeResponse>;
    if (typeof response.id !== "string" || typeof response.ok !== "boolean") {
      return undefined;
    }
    return response as BridgeResponse;
  } catch {
    return undefined;
  }
}

export function createTimingAndroidBridgeClient(
  transport: TimingAndroidTransport,
  timeoutMillis = DEFAULT_TIMEOUT_MILLIS,
): TimingAndroidBridgeClient {
  const pending = new Map<string, PendingRequest>();

  transport.addEventListener("message", (event) => {
    const response = parseResponse(event.data);
    if (!response) {
      return;
    }

    const request = pending.get(response.id);
    if (!request) {
      return;
    }

    pending.delete(response.id);
    clearTimeout(request.timeout);
    if (response.ok) {
      request.resolve(response.result);
    } else {
      request.reject(new Error(`TimingAndroid bridge error: ${response.error ?? "unknown_error"}`));
    }
  });

  const request = <T>(method: BridgeMethod, payload: Record<string, unknown> = {}) => {
    const id = createRequestId();

    return new Promise<T>((resolve, reject) => {
      const timeout = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`TimingAndroid bridge timed out: ${method}`));
      }, timeoutMillis);

      pending.set(id, {
        resolve: (value) => resolve(value as T),
        reject,
        timeout,
      });

      try {
        transport.postMessage(JSON.stringify({ id, method, ...payload }));
      } catch (error) {
        clearTimeout(timeout);
        pending.delete(id);
        reject(error instanceof Error ? error : new Error("TimingAndroid bridge postMessage failed"));
      }
    });
  };

  return {
    getPlatform: () => request<"ANDROID">("getPlatform"),
    getNotificationEnabled: () => request<boolean>("getNotificationEnabled"),
    setNotificationEnabled: (enabled) =>
      request<null>("setNotificationEnabled", { enabled }).then(() => undefined),
    finishApp: () => {
      transport.postMessage(JSON.stringify({ id: createRequestId(), method: "finishApp" }));
    },
  };
}

export function getTimingAndroidBridgeClient(): TimingAndroidBridgeClient | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  const transport = window.TimingAndroid;
  if (!transport || typeof transport.postMessage !== "function") {
    return undefined;
  }

  if (transport !== cachedTransport) {
    cachedTransport = transport;
    cachedClient = createTimingAndroidBridgeClient(transport);
  }

  return cachedClient;
}

export function isTimingAndroidApp(): boolean {
  return getTimingAndroidBridgeClient() !== undefined;
}
