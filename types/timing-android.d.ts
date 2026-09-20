import type { TimingAndroidBridge } from "@/shared/lib/guestInstallation";
import type { TimingIosBridge } from "@/shared/lib/notificationRuntime";

export {};

declare global {
  interface Window {
    TimingAndroid?: TimingAndroidBridge;
    TimingIOS?: TimingIosBridge;
    __timingHandleAndroidBack?: () => void;
  }
}
