import { NextResponse } from "next/server";
import { ApiError, type ApiErrorCode } from "./types";

const STATUS: Record<ApiErrorCode, number> = {
  bad_request: 400,
  unauthenticated: 401,
  not_found: 404,
  internal_error: 500,
  network_error: 0,
  timeout: 0,
};

/** Render one consistent error envelope from a route handler. */
export function errorResponse(
  code: ApiErrorCode,
  message: string,
  fields?: Record<string, string>,
) {
  return NextResponse.json<{
    error: { code: ApiErrorCode; message: string; fields?: Record<string, string> };
  }>({ error: { code, message, fields } }, { status: STATUS[code] || 500 });
}

export function badRequest(message: string, fields?: Record<string, string>) {
  return errorResponse("bad_request", message, fields);
}

export function notFound(message: string) {
  return errorResponse("not_found", message);
}

export function unauthenticated(message: string) {
  return errorResponse("unauthenticated", message);
}

export function toApiErrorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return errorResponse(error.code, error.message);
  }
  return errorResponse(
    "internal_error",
    "The request could not be completed.",
  );
}
