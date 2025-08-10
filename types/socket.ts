// types/socket.ts

export type TimingUpdateMessage = {
  type: 'timing_update';
  payload: {
    id: string;
    timestamp: string;  // ISO 형식
    value: number;
  };
};

export type NotificationMessage = {
  type: 'notification';
  payload: {
    message: string;
    level: 'info' | 'warning' | 'error';
  };
};

export type SocketMessage = TimingUpdateMessage | NotificationMessage;