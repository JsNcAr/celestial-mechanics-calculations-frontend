# API Module

The `src/api/` directory contains the entire HTTP communication layer. It is framework-agnostic and can be reused outside of this project with no changes.

## Overview

```
src/api/
├── api-error.ts      ← ApiError class + isApiError guard
├── http-client.ts    ← Generic fetch wrapper (HttpClient)
├── celestial-api.ts  ← Domain-specific methods (CelestialApi)
└── index.ts          ← Public barrel export
```

---

## `ApiError`

**File:** `src/api/api-error.ts`

A typed subclass of `Error` that is thrown for every non-2xx response and for network failures.

### Properties

| Property | Type | Description |
|---|---|---|
| `message` | `string` | Human-readable error message (from `Error`) |
| `status` | `number` | HTTP status code; `0` means a network-level failure |
| `details` | `string | undefined` | Optional extra context from the backend |
| `name` | `"ApiError"` | Allows `instanceof`-free identification |

### `isApiError(value)`

```ts
function isApiError(value: unknown): value is ApiError
```

Type guard — returns `true` if `value` is an `ApiError`. Use this in `catch` blocks to distinguish API errors from unexpected exceptions:

```ts
try {
  const { data } = await api.calcOrbitalPeriod("earth");
} catch (error) {
  if (isApiError(error)) {
    console.error(`HTTP ${error.status}: ${error.message}`);
    // error.details may contain more context
  } else {
    throw error; // re-throw unexpected errors
  }
}
```

### Error mapping

| Situation | `status` | `message` |
|---|---|---|
| Non-2xx response with JSON body | HTTP status code | `body.error` field |
| Non-2xx response without JSON | HTTP status code | `response.statusText` |
| Network / DNS / CORS failure | `0` | `"Network error — unable to reach the server."` |

---

## `HttpClient`

**File:** `src/api/http-client.ts`

A thin, typed wrapper around the browser `fetch` API. Handles JSON serialisation, default headers, and error translation into `ApiError`.

### Creating an instance

Use the factory function (preferred) or the constructor directly:

```ts
import { createHttpClient } from "./api/index.js";

const client = createHttpClient("https://api.example.com/api/v1");
```

The base URL may include a path prefix. A trailing slash is stripped automatically.

### Default headers

Every request automatically includes:

```
Content-Type: application/json
Accept: application/json
```

### Managing headers

```ts
// Add or replace a header (e.g. after user login)
client.setHeader("Authorization", `Bearer ${token}`);

// Remove a previously set header
client.removeHeader("Authorization");
```

### Request methods

All methods return a `Promise` that resolves to a typed response envelope or rejects with `ApiError`.

| Method | Signature | Use for |
|---|---|---|
| `get` | `get<T>(path, options?)` | Fetch a single resource |
| `getList` | `getList<T>(path, options?)` | Fetch a paginated list |
| `post` | `post<T>(path, body, options?)` | Create a resource or trigger a calculation |
| `put` | `put<T>(path, body, options?)` | Replace a resource |
| `patch` | `patch<T>(path, body, options?)` | Partially update a resource |
| `delete` | `delete<T>(path, options?)` | Delete a resource |

### `RequestOptions`

```ts
interface RequestOptions {
  headers?: Record<string, string>;  // extra headers for this request only
  signal?: AbortSignal;              // cancel the request
}
```

**Cancellation example:**

```ts
const controller = new AbortController();
const promise = client.get<CelestialBody>("/bodies/earth", {
  signal: controller.signal,
});

// Cancel after 5 seconds
setTimeout(() => controller.abort(), 5000);
```

### Response contract

Successful responses are expected to match `ApiResponse<T>`:

```ts
interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}
```

Paginated list responses are expected to match `PaginatedResponse<T>`:

```ts
interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}
```

See [Types](types.md) for the full definition of these interfaces.

---

## `CelestialApi`

**File:** `src/api/celestial-api.ts`

Domain-specific API methods for the Celestial Mechanics backend. Depends on `HttpClient` (injected via the constructor), so it can be tested with a mock client.

### Constructor

```ts
const api = new CelestialApi(httpClient);
```

### Methods — Bodies

#### `listBodies()`

```ts
listBodies(): Promise<PaginatedResponse<CelestialBody>>
```

Fetches the full list of catalogued celestial bodies (`GET /bodies`).

#### `getBody(id)`

```ts
getBody(id: string): Promise<ApiResponse<CelestialBody>>
```

Fetches a single body by its ID (`GET /bodies/:id`). The ID is URL-encoded automatically.

### Methods — Calculations

#### `calcOrbitalPeriod(bodyId)`

```ts
calcOrbitalPeriod(bodyId: string): Promise<ApiResponse<OrbitalPeriodResult>>
```

Calculates the orbital period of a body around its primary (`POST /calculations/orbital-period`).

**Request body:**
```json
{ "bodyId": "earth" }
```

**Response data shape:** `OrbitalPeriodResult` — see [Types](types.md).

#### `calcGravitationalForce(body1Id, body2Id)`

```ts
calcGravitationalForce(
  body1Id: string,
  body2Id: string,
): Promise<ApiResponse<GravitationalForceResult>>
```

Calculates the gravitational force between two bodies at their current positions (`POST /calculations/gravitational-force`).

**Request body:**
```json
{ "body1Id": "earth", "body2Id": "moon" }
```

**Response data shape:** `GravitationalForceResult` — see [Types](types.md).

---

## Barrel export (`index.ts`)

Import everything from the barrel so consumers never need to know the internal file layout:

```ts
import {
  createHttpClient,
  HttpClient,
  CelestialApi,
  ApiError,
  isApiError,
} from "./api/index.js";

import type { RequestOptions } from "./api/index.js";
```
