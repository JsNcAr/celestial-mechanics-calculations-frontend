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

/**
 * Pagination metadata included in list responses.
 */
export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

/**
 * Generic paginated response envelope.
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}
