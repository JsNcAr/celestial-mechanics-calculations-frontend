# Architecture

This document describes how the codebase is structured and how the different modules interact at runtime.

## Directory layout

```
celestial-mechanics-calculations-frontend/
├── index.html                  ← Source HTML (copied to dist/ by build)
├── src/
│   ├── main.ts                 ← App entry point & bootstrap
│   ├── config.ts               ← Centralised configuration
│   ├── style.css               ← Application styles
│   │
│   ├── api/                    ← HTTP communication layer
│   │   ├── api-error.ts        ← Custom ApiError class
│   │   ├── http-client.ts      ← Generic typed fetch wrapper
│   │   ├── celestial-api.ts    ← Domain-specific API methods
│   │   └── index.ts            ← Public re-exports
│   │
│   ├── types/                  ← TypeScript interfaces / type aliases
│   │   ├── api.ts              ← Generic response envelopes
│   │   ├── celestial.ts        ← Domain types (CelestialBody, OrbitalElements, …)
│   │   └── index.ts            ← Public re-exports
│   │
│   ├── pages/                  ← Page-level renderers
│   │   └── home.ts             ← Home page (bodies grid + calculations form)
│   │
│   └── utils/                  ← Shared utilities
│       ├── escape-html.ts      ← XSS-safe HTML escaping
│       └── notifications.ts    ← Dismissible toast system
│
├── scripts/
│   └── copy-assets.mjs         ← Post-build: copies CSS + HTML to dist/
│
├── dist/                       ← Build output (git-ignored)
├── docs/                       ← This documentation
├── package.json
└── tsconfig.json
```

## Module responsibilities

### `src/main.ts` — Bootstrap

The single entry point loaded by the browser. Responsible for:

1. Creating the `HttpClient` instance bound to `config.apiBaseUrl`
2. Creating the `CelestialApi` instance, injecting the `HttpClient`
3. Rendering the shell layout (header, `<main>`, footer, notifications container) into `#app`
4. Delegating page rendering to `renderHomePage`

Nothing else imports `main.ts`; it is the root of the dependency graph.

### `src/config.ts` — Configuration

A plain `const` object with two fields: `apiBaseUrl` and `appTitle`.  
Edit this file to change the backend URL. See [Configuration](configuration.md).

### `src/api/` — HTTP layer

Three files plus a barrel:

| File | Responsibility |
|---|---|
| `http-client.ts` | Generic `fetch` wrapper — not celestial-mechanics-specific. Handles headers, serialisation, error translation. |
| `api-error.ts` | `ApiError` class and `isApiError` guard — used wherever API responses are caught. |
| `celestial-api.ts` | Domain methods (`listBodies`, `getBody`, `calcOrbitalPeriod`, `calcGravitationalForce`). |
| `index.ts` | Re-exports everything so consumers `import … from "../api/index.js"`. |

See [API Module](api-module.md) for full details.

### `src/types/` — Shared types

Pure TypeScript interfaces; no runtime code. Compiled to empty `.js` files (only type information is used by the compiler).

| File | Contents |
|---|---|
| `api.ts` | `ApiResponse<T>`, `PaginatedResponse<T>`, `ApiErrorPayload`, `PaginationMeta` |
| `celestial.ts` | `CelestialBody`, `CelestialBodyType`, `OrbitalElements`, `OrbitalPeriodResult`, `GravitationalForceResult` |

See [Types](types.md) for full details.

### `src/pages/` — Page renderers

Each file exports a `render*` function that accepts an `HTMLElement` container and any dependencies it needs. Pages are responsible for:

- Injecting HTML into the container via `innerHTML`
- Fetching data and updating the DOM
- Wiring up event listeners

Currently only `home.ts` exists. New pages follow the same pattern.

### `src/utils/` — Utilities

Small, single-purpose helpers with no external dependencies:

| File | Exports |
|---|---|
| `escape-html.ts` | `escapeHtml(text)` — prevents XSS when setting `innerHTML` |
| `notifications.ts` | `showError(error)`, `showInfo(message)` — ARIA-aware dismissible toasts |

## Data flow

```
Browser
  │
  └─▶ dist/index.html
        │
        └─▶ dist/main.js  (type="module")
              │
              ├── creates HttpClient(config.apiBaseUrl)
              ├── creates CelestialApi(httpClient)
              ├── renders shell layout into #app
              │
              └── renderHomePage(mainContent, celestialApi)
                    │
                    ├── sets innerHTML (bodies grid + calc form)
                    │
                    ├── loadBodies()
                    │     └── celestialApi.listBodies()
                    │           └── httpClient.getList("/bodies")
                    │                 └── fetch(baseUrl + "/bodies")
                    │
                    └── wireCalculationButtons()
                          ├── calcOrbitalPeriod(bodyId)
                          │     └── httpClient.post("/calculations/orbital-period", …)
                          └── calcGravitationalForce(id1, id2)
                                └── httpClient.post("/calculations/gravitational-force", …)
```

## Design principles

- **No bundler** — TypeScript is compiled directly to native ES modules; the browser imports them as-is.
- **Dependency injection** — `HttpClient` is created once and passed down; pages never construct their own clients.
- **Single responsibility** — each file does one thing. The `api/` layer never touches the DOM; pages never construct fetch calls directly.
- **Type safety** — all API responses are typed through `ApiResponse<T>` / `PaginatedResponse<T>`; raw `unknown` JSON never escapes the `http-client`.
- **XSS prevention** — every user-visible string coming from the API is run through `escapeHtml` before being set as `innerHTML`.
