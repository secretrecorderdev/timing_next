import type { TimingIosBridge } from "@/shared/lib/notificationRuntime";
import type { TimingAndroidTransport } from "@/shared/lib/timingAndroidBridge";

export {};

declare global {
  interface Window {
    TimingAndroid?: TimingAndroidTransport;
    TimingIOS?: TimingIosBridge;
    __timingHandleAndroidBack?: () => void;
  }
}
