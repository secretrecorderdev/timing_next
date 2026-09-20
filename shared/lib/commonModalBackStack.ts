type CommonModalBackHandler = () => void;

const backHandlers: CommonModalBackHandler[] = [];

export function registerCommonModalBackHandler(handler: CommonModalBackHandler) {
  backHandlers.push(handler);

  return () => {
    const index = backHandlers.lastIndexOf(handler);
    if (index >= 0) {
      backHandlers.splice(index, 1);
    }
  };
}

export function closeTopmostCommonModal(): boolean {
  const handler = backHandlers.pop();
  if (!handler) {
    return false;
  }

  handler();
  return true;
}

export function resetCommonModalBackStack() {
  backHandlers.length = 0;
}
