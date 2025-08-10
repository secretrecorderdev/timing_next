// hooks/useSocket.ts
import { useEffect, useRef } from 'react';
import { connectSocket } from '@/lib/socket/client';
import { useTimingStore } from '@/store/timing/useTimingStore'
import type { SocketMessage } from '@/types/socket';
import type { TimingUpdateMessage } from '@/types/socket';


export function useSocket(onMessage: (msg: SocketMessage) => void) {
  const socketRef = useRef<WebSocket | null>(null);
  // const setLastTimingMessage = useTimingStore(s => s.setLastTimingMessage);
  const setLast = useTimingStore((s) => s.setLast);
  useEffect(() => {
    socketRef.current = connectSocket((msg: SocketMessage) => {
      // 공용 콜백 먼저 실행
      onMessage(msg);

      // timing_update만 전역 상태 업데이트
      if (msg.type === 'timing_update') {
        setLast(msg as TimingUpdateMessage);
      }
    });

    return () => socketRef.current?.close();
  }, [onMessage, setLast]);

  return { socket: socketRef.current };
}