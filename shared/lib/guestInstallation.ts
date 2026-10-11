export const INSTALLATION_ID_STORAGE_KEY = "timing-installation-id";
export const LEGACY_GUEST_DEVICE_ID_STORAGE_KEY = "timing-guest-device-id";

export type GuestPlatform = "WEB" | "ANDROID";

type InstallationStorage = Pick<Storage, "getItem" | "setItem">;
type InstallationCrypto = Pick<Crypto, "getRandomValues"> &
  Partial<Pick<Crypto, "randomUUID">>;

export function createInstallationUuid(cryptoApi: InstallationCrypto = crypto): string {
  if (typeof cryptoApi.randomUUID === "function") {
    return cryptoApi.randomUUID();
  }

  const bytes = cryptoApi.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function getOrCreateInstallationId(
  storage: InstallationStorage,
  createUuid: () => string,
): string {
  const existing = storage.getItem(INSTALLATION_ID_STORAGE_KEY);
  if (existing) {
    return existing;
  }

  const legacyId = storage.getItem(LEGACY_GUEST_DEVICE_ID_STORAGE_KEY);
  if (legacyId) {
    storage.setItem(INSTALLATION_ID_STORAGE_KEY, legacyId);
    return legacyId;
  }

  const installationId = createUuid();
  storage.setItem(INSTALLATION_ID_STORAGE_KEY, installationId);
  return installationId;
}

export function detectGuestPlatform(isAndroidApp: boolean): GuestPlatform {
  return isAndroidApp ? "ANDROID" : "WEB";
}
