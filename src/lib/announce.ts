let message = "";
const listeners = new Set<() => void>();
let clearTimer: number | null = null;

function emit() {
  listeners.forEach((listener) => listener());
}

/**
 * Announce one status message through the single live region in the layout.
 * The message is cleared first so repeating the same text still announces.
 */
export function announce(next: string) {
  if (typeof window === "undefined") return;

  if (clearTimer !== null) window.clearTimeout(clearTimer);

  if (message !== "") {
    message = "";
    emit();
  }

  clearTimer = window.setTimeout(() => {
    message = next;
    clearTimer = null;
    emit();
  }, 60);
}

export function subscribeToAnnouncements(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getAnnouncementSnapshot(): string {
  return message;
}

export function getServerAnnouncementSnapshot(): string {
  return "";
}
