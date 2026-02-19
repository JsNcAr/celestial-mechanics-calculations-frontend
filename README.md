# Celestial Mechanics — Frontend

A lightweight frontend for the **Celestial Mechanics Calculations** helper. Built with plain HTML, CSS, and TypeScript — no bundler, no framework — served as native ES modules in any modern browser.

## Features

- Browse catalogued celestial bodies (planets, moons, stars, asteroids, comets)
- Calculate orbital periods using Keplerian mechanics
- Calculate gravitational force between any two bodies
- Dismissible toast notifications for API errors
- Responsive dark-theme UI via [Pico CSS](https://picocss.com/)

## Quick start

```bash
# 1. Install dependencies (TypeScript compiler + Pico CSS)
npm install

# 2. Point the app at your backend
#    Edit src/config.ts and set apiBaseUrl
#    (default: http://localhost:8000/api/v1)

# 3. Compile and copy assets
npm run build

# 4. Serve the self-contained dist/ directory
npx http-server dist
# → open http://localhost:8080
```

## Documentation

| Document | Description |
|---|---|
| [Getting Started](docs/getting-started.md) | Prerequisites, install, build, serve |
| [Architecture](docs/architecture.md) | Directory layout, module overview, data flow |
| [API Module](docs/api-module.md) | `HttpClient`, `CelestialApi`, `ApiError` |
| [Types](docs/types.md) | All TypeScript interfaces and type aliases |
| [Configuration](docs/configuration.md) | API URL, deployment, environment |
| [Contributing](docs/contributing.md) | Code style, adding features, PR process |

## Tech stack

| Tool | Role |
|---|---|
| [TypeScript 5.9](https://www.typescriptlang.org/) | Language — compiled to native ES2022 modules |
| [Pico CSS 2](https://picocss.com/) | Styling — classless, semantic HTML |
| [`tsc`](https://www.typescriptlang.org/docs/handbook/compiler-options.html) | Build — no bundler |
| `node scripts/copy-assets.mjs` | Post-build — copies CSS + HTML into `dist/` |

## License

MIT
