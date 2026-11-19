"use client";

import { useSyncExternalStore } from "react";
import {
  getAnnouncementSnapshot,
  getServerAnnouncementSnapshot,
  subscribeToAnnouncements,
} from "@/lib/announce";

/**
 * The single polite status region for the whole page. Components announce
 * through `announce()` instead of rendering their own competing live regions.
 * `output` is the implicit `role="status"`, so it announces without a role.
 */
export function LiveStatus() {
  const message = useSyncExternalStore(
    subscribeToAnnouncements,
    getAnnouncementSnapshot,
    getServerAnnouncementSnapshot,
  );

  return (
    <output aria-atomic="true" className="sr-only">
      {message}
    </output>
  );
}
