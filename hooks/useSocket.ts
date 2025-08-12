'use client';

import { useEffect, useRef } from 'react';
import { connectSocket } from '@/lib/socket/client';
import type { SocketMessage, TimingUpdateMessage } from '@/types/socket';
import { useTimingStore } from '@/store/timing/useTimingStore';

export function useSocket() {
  const setLast = useTimingStore((s) => s.setLast);

  // 최신 핸들러 보존 (재렌더로 인한 재연결 방지)
  const onMsgRef = useRef((m: SocketMessage) => {
    if (m?.type === 'timing_update') {
      setLast(m as TimingUpdateMessage);
    }
  });

  useEffect(() => {
    const ws = connectSocket((m) => onMsgRef.current(m), {
      // 기본값: '/stock/timing-ws' (client.ts에서 이미 바꿔둠)
      // 필요시 url/path/token 전달 가능
      
    });

    return () => {
      console.log("웹소켓 연결", )
      // 페이지 이동 시 소켓 유지하고 싶으면 닫지 말고 놔둬도 됨.
      // ws.close();
    };
  }, [setLast]);

  return null;
}
