# Getting Started

This guide covers everything you need to install, build, and serve the Celestial Mechanics frontend.

## Prerequisites

| Requirement | Minimum version | Notes |
|---|---|---|
| [Node.js](https://nodejs.org/) | 18 | Used to run `tsc` and the asset-copy script |
| npm | 8 | Bundled with Node.js |
| A running backend | — | See [Configuration](configuration.md) for the expected API contract |

> **Browser support** — The compiled output uses native ES2022 modules (`type="module"`). Any evergreen browser (Chrome 94+, Firefox 93+, Safari 15.4+, Edge 94+) works without a polyfill.

## Installation

```bash
git clone https://github.com/JsNcAr/celestial-mechanics-calculations-frontend.git
cd celestial-mechanics-calculations-frontend
npm install
```

`npm install` downloads two packages:

| Package | Role |
|---|---|
| `typescript` | TypeScript compiler (`tsc`) |
| `@picocss/pico` | CSS framework — classless, dark-theme ready |

## Configure the API base URL

Before building, open **`src/config.ts`** and update `apiBaseUrl` to point at your backend:

```ts
const config = {
  apiBaseUrl: "https://api.example.com/api/v1",  // ← change this
  appTitle: "Celestial Mechanics",
} as const;
```

See [Configuration](configuration.md) for all available options.

## Build

```bash
npm run build
```

This runs two steps in sequence:

1. **`tsc`** — type-checks all source files and compiles them to `dist/`  
2. **`node scripts/copy-assets.mjs`** — copies `pico.min.css`, `src/style.css`, and `index.html` into `dist/`

On success the `dist/` directory is fully self-contained:

```
dist/
├── index.html          ← entry-point HTML
├── pico.min.css        ← Pico CSS framework
├── style.css           ← application styles
├── main.js             ← app bootstrap
├── config.js
├── api/
│   ├── api-error.js
│   ├── celestial-api.js
│   ├── http-client.js
│   └── index.js
├── pages/
│   └── home.js
├── types/
│   ├── api.js
│   ├── celestial.js
│   └── index.js
└── utils/
    ├── escape-html.js
    └── notifications.js
```

## Type-check without emitting

```bash
npm run typecheck
```

Runs `tsc --noEmit` — useful in CI to catch type errors without writing files to disk.

## Serve locally

After building, serve the `dist/` directory with any static file server.

**Option A — npx http-server (zero install)**
```bash
npx http-server dist
# → http://localhost:8080
```

**Option B — Python built-in server**
```bash
python3 -m http.server 8080 --directory dist
# → http://localhost:8080
```

**Option C — nginx / Apache**  
Point the server root at `dist/` and serve `index.html` for all routes.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Blank page, console says `Failed to resolve module` | Old browser without ESM support | Use a modern browser |
| `tsc` fails with "Cannot find module `…/types/index.js`" | Import specifier wrong | All imports must use `.js` extensions |
| Bodies grid shows "Failed to load" | Backend not running or wrong URL | Check `src/config.ts` `apiBaseUrl` |
| CORS error in browser console | Backend not sending CORS headers | Configure CORS on the backend to allow your origin |
