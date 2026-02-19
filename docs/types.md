# Types

All TypeScript interfaces and type aliases live in `src/types/`. They are pure compile-time constructs — the compiled `.js` files contain no runtime code.

Import from the barrel:

```ts
import type { CelestialBody, ApiResponse } from "../types/index.js";
```

---

## Generic response envelopes (`src/types/api.ts`)

These interfaces model the JSON contract shared by every backend endpoint.

### `ApiResponse<T>`

The standard single-resource response envelope.

```ts
interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}
```

| Field | Type | Description |
|---|---|---|
| `data` | `T` | The requested resource |
| `message` | `string | undefined` | Optional informational message from the backend |
| `status` | `number` | HTTP status code echoed in the body |

### `PaginatedResponse<T>`

Extends `ApiResponse<T[]>` with pagination metadata. Used for list endpoints.

```ts
interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}
```

### `PaginationMeta`

```ts
interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}
```

| Field | Description |
|---|---|
| `page` | Current page number (1-based) |
| `perPage` | Number of items per page |
| `total` | Total number of items across all pages |
| `totalPages` | Total number of pages |

### `ApiErrorPayload`

The error shape expected from non-2xx backend responses.

```ts
interface ApiErrorPayload {
  error: string;
  details?: string;
  status: number;
}
```

| Field | Description |
|---|---|
| `error` | Human-readable error message |
| `details` | Optional technical details or stack trace excerpt |
| `status` | HTTP status code |

---

## Domain types (`src/types/celestial.ts`)

### `CelestialBody`

Represents a catalogued astronomical object.

```ts
interface CelestialBody {
  id: string;
  name: string;
  type: CelestialBodyType;
  mass: number;          // kilograms
  radius: number;        // metres
  distanceFromSun?: number;  // metres — undefined for the Sun itself
}
```

### `CelestialBodyType`

```ts
type CelestialBodyType = "star" | "planet" | "moon" | "asteroid" | "comet";
```

### `OrbitalElements`

The six classical Keplerian orbital elements that fully describe an elliptical orbit.

```ts
interface OrbitalElements {
  semiMajorAxis: number;              // metres
  eccentricity: number;               // dimensionless, 0 = circular
  inclination: number;                // degrees
  longitudeOfAscendingNode: number;   // degrees
  argumentOfPeriapsis: number;        // degrees
  trueAnomaly: number;                // degrees, current position in orbit
}
```

### `OrbitalPeriodResult`

Returned by `CelestialApi.calcOrbitalPeriod()`.

```ts
interface OrbitalPeriodResult {
  bodyId: string;
  bodyName: string;
  periodSeconds: number;
  periodDays: number;
  periodYears: number;
}
```

**Example (Earth):**
```json
{
  "bodyId": "earth",
  "bodyName": "Earth",
  "periodSeconds": 31558150,
  "periodDays": 365.25,
  "periodYears": 1.0
}
```

### `GravitationalForceResult`

Returned by `CelestialApi.calcGravitationalForce()`.

```ts
interface GravitationalForceResult {
  body1Id: string;
  body2Id: string;
  forceNewtons: number;    // Newtons
  distanceMeters: number;  // metres — distance between the two bodies
}
```

**Example (Earth–Moon):**
```json
{
  "body1Id": "earth",
  "body2Id": "moon",
  "forceNewtons": 1.982e+20,
  "distanceMeters": 3.844e+08
}
```
