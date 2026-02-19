import type { ApiErrorPayload } from "../types/index.js";

/**
 * Custom error class for API failures.
 * Carries the HTTP status code and the structured backend error payload.
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly details?: string;

  constructor(payload: ApiErrorPayload) {
    super(payload.error);
    this.name = "ApiError";
    this.status = payload.status;
    this.details = payload.details;
  }
}

/**
 * Returns true if the given value is an ApiError instance.
 */
export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError;
}
