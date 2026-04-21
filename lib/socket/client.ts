// lib/socket/client.ts
import { SocketMessage } from '@/types/socket';

let socket: WebSocket | null = null;
let msgBuffer: string[] = [];

type OnMessageHandler = (msg: SocketMessage) => void;

type ConnectOptions = {
  /** 완전한 ws/wss URL (예: wss://api.myfarmus.com/stock/timing-ws). 제공되면 우선 사용 */
  url?: string;
  /** 상대 경로. 기본: '/stock/timing-ws' */
  path?: string;
  /** 쿼리 토큰 부착용 */
  token?: string;
  /** 하위 프로토콜 */
  protocols?: string[];
};

/** http/https → ws/wss 자동 매핑 (백엔드 오리진 분리 지원) */
function buildWsUrl(path: string, token?: string) {
    
  // 절대 WS URL이 env로 주어진 경우 최우선
  const envWs = process.env.NEXT_PUBLIC_WS_URL; // 예: wss://api.myfarmus.com/stock/timing-ws
  if (envWs) return token ? appendToken(envWs, token) : envWs;

  // 백엔드 오리진이 분리된 경우 (http origin) → ws/wss로 변환
  const apiOrigin = process.env.NEXT_PUBLIC_API_ORIGIN; // 예: https://api.myfarmus.com
  if (apiOrigin) {
    const u = new URL(apiOrigin);
    const proto = u.protocol === 'https:' ? 'wss:' : 'ws:';
    const base = `${proto}//${u.host}${path}`;
    return token ? appendToken(base, token) : base;
  }

  // 동일 오리진
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const proto = isHttps ? 'wss' : 'ws';
  const host = typeof window !== 'undefined' ? window.location.host : '';
  const base = `${proto}://${host}${path}`;
  return token ? appendToken(base, token) : base;
}

function appendToken(url: string, token: string) {
  return url.includes('?') ? `${url}&t=${token}` : `${url}?t=${token}`;
}

function replaceHandlers(ws: WebSocket, onMessage: OnMessageHandler) {
  ws.onopen = () => {
    console.log('🟢 WS open', { url: ws.url });
    if (msgBuffer.length) {
      for (const m of msgBuffer) ws.send(m);
      msgBuffer = [];
    }
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data) as SocketMessage;
      onMessage(data);
    } catch (err) {
      console.error('❌ WS parse error', err, event.data);
    }
  };

  ws.onerror = (e) => {
    console.error('⚠️ WS error', {
      readyState: ws.readyState,
      url: ws.url,
      event: e,
    });
  };

  ws.onclose = (e) => {
    console.warn('🔴 WS close', {
      code: e.code,
      reason: e.reason,
      wasClean: e.wasClean,
      url: ws.url,
    });
  };
}

/** 싱글톤 연결 */
export function connectSocket(
  onMessage: OnMessageHandler,
  opts: ConnectOptions = { path: '/stock/timing-ws' } // ✅ 기본 경로 변경
): WebSocket {
  if (typeof window === 'undefined') {
    throw new Error('WebSocket must be used in the browser.');
  }

  const targetUrl = opts.url ?? buildWsUrl(opts.path ?? '/stock/timing-ws', opts.token);
  console.log('[WS] opening →', targetUrl); 
  const needNew =
    !socket || socket.readyState === WebSocket.CLOSING || socket.readyState === WebSocket.CLOSED;

  if (needNew) {
    try {
      socket = new WebSocket(targetUrl, opts.protocols);
    } catch (err) {
      console.error('WS construct failed', err, { targetUrl });
      throw err;
    }
  }

  if (socket) {
    replaceHandlers(socket, onMessage);
    return socket;
  }
  throw new Error('Failed to initialize WebSocket');
}

/** 안전 전송 */
export function sendMessage<T extends SocketMessage>(_msg: T) {
  const payload = JSON.stringify(_msg);
  if (!socket) {
    console.warn('WS not initialized. Buffering message.');
    msgBuffer.push(payload);
    return;
  }
  switch (socket.readyState) {
    case WebSocket.OPEN:
      socket.send(payload);
      break;
    case WebSocket.CONNECTING:
      msgBuffer.push(payload);
      break;
    default:
      console.warn('WS not open (will buffer). readyState=', socket.readyState);
      msgBuffer.push(payload);
  }
}

/** 수동 종료 */
export function disconnectSocket(code?: number, reason?: string) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close(code, reason);
  }
  socket = null;
  msgBuffer = [];
}
