import { create } from "axios";
import { createApi } from "./client";

/**
 * The browser instance. Requests are same-origin, so no base URL is needed and
 * cookies travel automatically. A longer timeout gives a slow network one clear
 * failure instead of an indefinite wait.
 */
export const browserApi = createApi(
  create({
    timeout: 15_000,
    headers: { Accept: "application/json" },
  }),
);
