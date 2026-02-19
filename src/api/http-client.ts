import type { ApiResponse, PaginatedResponse } from "../types/index.ts";
import { ApiError } from "./api-error.ts";

/** Allowed HTTP methods for requests. */
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/** Options accepted by every request helper. */
export interface RequestOptions {
  /** Additional headers merged on top of the defaults. */
  headers?: Record<string, string>;
  /** Abort signal for request cancellation. */
  signal?: AbortSignal;
}

/**
 * Core HTTP client used by all feature modules.
 *
 * Instantiate once via {@link createHttpClient} and inject it where needed.
 */
export class HttpClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;

  constructor(baseUrl: string, defaultHeaders: Record<string, string> = {}) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...defaultHeaders,
    };
  }

  /** Set (or replace) a default header, e.g. an Authorization token. */
  setHeader(name: string, value: string): void {
    this.defaultHeaders[name] = value;
  }

  /** Remove a previously set default header. */
  removeHeader(name: string): void {
    delete this.defaultHeaders[name];
  }

  // ---------------------------------------------------------------------------
  // Convenience methods
  // ---------------------------------------------------------------------------

  get<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>("GET", path, undefined, options);
  }

  getList<T>(path: string, options?: RequestOptions): Promise<PaginatedResponse<T>> {
    return this.request<T[]>("GET", path, undefined, options) as Promise<PaginatedResponse<T>>;
  }

  post<T>(path: string, body: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>("POST", path, body, options);
  }

  put<T>(path: string, body: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>("PUT", path, body, options);
  }

  patch<T>(path: string, body: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>("PATCH", path, body, options);
  }

  delete<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>("DELETE", path, undefined, options);
  }

  // ---------------------------------------------------------------------------
  // Core request method
  // ---------------------------------------------------------------------------

  private async request<T>(
    method: HttpMethod,
    path: string,
    body: unknown,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...options.headers,
    };

    const init: RequestInit = {
      method,
      headers,
      signal: options.signal,
    };

    if (body !== undefined) {
      init.body = JSON.stringify(body);
    }

    let response: Response;
    try {
      response = await fetch(url, init);
    } catch (cause) {
      // Network-level failure (offline, DNS, CORS, etc.)
      throw new ApiError({
        error: "Network error — unable to reach the server.",
        details: cause instanceof Error ? cause.message : String(cause),
        status: 0,
      });
    }

    const json = await this.parseJson(response);

    if (!response.ok) {
      throw new ApiError({
        error: (json as { error?: string }).error ?? response.statusText,
        details: (json as { details?: string }).details,
        status: response.status,
      });
    }

    return json as ApiResponse<T>;
  }

  private async parseJson(response: Response): Promise<unknown> {
    const contentType = response.headers.get("Content-Type") ?? "";
    if (!contentType.includes("application/json")) {
      return {};
    }
    try {
      return await response.json();
    } catch {
      return {};
    }
  }
}

/**
 * Factory that creates an {@link HttpClient} bound to the backend base URL.
 */
export function createHttpClient(baseUrl: string): HttpClient {
  return new HttpClient(baseUrl);
}
