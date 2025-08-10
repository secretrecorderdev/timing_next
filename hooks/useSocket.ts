// hooks/useSocket.ts
import { useEffect, useRef } from 'react';
import { connectSocket } from '@/lib/socket/client';
import type { SocketMessage } from '@/types/socket';

export function useSocket(onMessage: (msg: SocketMessage) => void) {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    socketRef.current = connectSocket(onMessage);

    return () => {
      socketRef.current?.close();
    };
  }, [onMessage]);

  return {
    socket: socketRef.current,
  };
}
