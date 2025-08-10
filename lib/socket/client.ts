import { SocketMessage } from '@/types/socket';

let socket: WebSocket | null = null;
let msgBuffer: string[] = [];

type OnMessageHandler = (msg: SocketMessage) => void;

type ConnectOptions = {
  /** 완전한 ws/wss URL. 제공되면 우선 사용 */
  url?: string;
  /** 상대 경로 (예: "/ws/realtime"). url 미지정 시 사용 */
  path?: string;
  /** 필요 시 쿼리/헤더 대신 간단 토큰 부착 */
  token?: string;
  /** 프로토콜 네고가 필요할 때 */
  protocols?: string[];
};

/** http/https → ws/wss 자동 매핑 */
function buildWsUrl(path: string, token?: string) {
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const proto = isHttps ? 'wss' : 'ws';
  const host = typeof window !== 'undefined' ? window.location.host : '';
  const qs = token ? (path.includes('?') ? `&t=${token}` : `?t=${token}`) : '';
  return `${proto}://${host}${path}${qs}`;
}

function replaceHandlers(ws: WebSocket, onMessage: OnMessageHandler) {
  ws.onopen = () => {
    console.log('🟢 WS open', { url: ws.url });
    // 버퍼 비우기
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
    // onerror는 정보가 거의 없음 → readyState라도 남긴다
    console.error('⚠️ WS error', {
      readyState: ws.readyState, // 0 CONNECTING, 1 OPEN, 2 CLOSING, 3 CLOSED
      url: ws.url,
      event: e,
    });
  };

  ws.onclose = (e) => {
    console.warn('🔴 WS close', {
      code: e.code,       // 1000 정상, 1006 비정상 종료
      reason: e.reason,
      wasClean: e.wasClean,
      url: ws.url,
    });
  };
}

/**
 * 소켓 연결 (싱글톤)
 * - 기존 소켓이 CONNECTING/OPEN이면 재사용
 * - CLOSING/CLOSED면 새로 연결
 */
export function connectSocket(
  onMessage: OnMessageHandler,
  opts: ConnectOptions = { path: '/ws/realtime' }
): WebSocket {
  if (typeof window === 'undefined') {
    throw new Error('WebSocket must be used in the browser.');
  }

  const targetUrl =
    opts.url ??
    buildWsUrl(opts.path ?? '/ws/realtime', opts.token);

  // 새 소켓이 필요한 상태: null, CLOSING(2), CLOSED(3)
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

  // CONNECTING(0)/OPEN(1) 모두 여기서 핸들러 최신화
  if (socket) {
    // null이 아닌 경우에만 핸들러 교체
    replaceHandlers(socket, onMessage);
    return socket;
  }

  throw new Error('Failed to initialize WebSocket');
}

/** 안전 전송: OPEN 아니면 버퍼링 후 open 시 전송 */
export function sendMessage<T extends SocketMessage>(msg: T) {
  const payload = JSON.stringify(msg);
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

/** 수동 종료가 필요할 때 */
export function disconnectSocket(code?: number, reason?: string) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close(code, reason);
  }
  socket = null;
  msgBuffer = [];
}