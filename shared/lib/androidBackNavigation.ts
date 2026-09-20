interface AndroidBackHandlers {
  closeTopmostModal: () => boolean;
  pathname: string;
  navigateBack: () => void;
  openExitConfirmation: () => void;
}

export type AndroidBackResult =
  | "MODAL_CLOSED"
  | "PREVIOUS_URL_OPENED"
  | "EXIT_CONFIRMATION_OPENED";

export function isTimingItemDetailPath(pathname: string): boolean {
  return /^(?:\/(?:ko|en))?\/item\/[^/]+\/?$/.test(pathname);
}

export function handleAndroidBack({
  closeTopmostModal,
  pathname,
  navigateBack,
  openExitConfirmation,
}: AndroidBackHandlers): AndroidBackResult {
  if (closeTopmostModal()) {
    return "MODAL_CLOSED";
  }

  if (isTimingItemDetailPath(pathname)) {
    navigateBack();
    return "PREVIOUS_URL_OPENED";
  }

  openExitConfirmation();
  return "EXIT_CONFIRMATION_OPENED";
}
