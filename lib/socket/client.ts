import { SocketMessage } from '@/types/socket';

let socket: WebSocket | null = null;

type OnMessageHandler = (msg: SocketMessage) => void;

export function connectSocket(onMessage: OnMessageHandler): WebSocket {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    socket = new WebSocket('wss://your-api/ws/realtime');

    socket.onopen = () => console.log('🟢 소켓 연결됨');
    socket.onclose = () => console.log('🔴 소켓 종료됨');
    socket.onerror = (e) => console.error('⚠️ 소켓 에러', e);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as SocketMessage;
        onMessage(data);
      } catch (err) {
        console.error('❌ 메시지 파싱 실패:', err);
      }
    };
  }
  return socket;
}

export function sendMessage<T extends SocketMessage>(msg: T) {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(msg));
  } else {
    console.warn('소켓이 열려있지 않음');
  }
}