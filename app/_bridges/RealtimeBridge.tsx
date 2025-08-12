'use client';
import { useSocket } from '@/hooks/useSocket';
export default function RealtimeBridge() {
  useSocket(); // 소켓 연결 → Zustand 업데이트
  return null;
}