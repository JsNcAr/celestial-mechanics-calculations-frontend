/**
 * Generic API response envelope returned by the backend.
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

/**
 * Standard error payload returned by the backend.
 */
export interface ApiErrorPayload {
  error: string;
  details?: string;
  status: number;
}

