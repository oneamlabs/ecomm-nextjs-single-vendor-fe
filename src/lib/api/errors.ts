import { ApiError } from "./types.ts";

/**
 * Was this failure "the resource does not exist", as opposed to "the request
 * could not be completed"?
 *
 * The distinction matters on a page: a missing product deserves `notFound()`,
 * while an outage or a bad request must reach the error boundary. Collapsing
 * both into a 404 hides a real failure behind a polite "no such page".
 */
export function isMissingResource(error: unknown): boolean {
  return error instanceof ApiError && error.code === "not_found";
}
