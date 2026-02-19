# Contributing

Thank you for considering a contribution! This guide explains how the codebase is organised, the code-style expectations, and how to submit changes.

## Development workflow

```bash
# 1. Fork the repository and clone your fork
git clone https://github.com/<your-username>/celestial-mechanics-calculations-frontend.git
cd celestial-mechanics-calculations-frontend

# 2. Install dependencies
npm install

# 3. Make your changes in src/

# 4. Type-check (fast, no output written)
npm run typecheck

# 5. Build and verify
npm run build
npx http-server dist   # manual smoke-test in the browser
```

Commit only source files. The `dist/` directory is git-ignored and should never be committed.

## Code style

### TypeScript

- **Strict mode** — all `strict` flags are on in `tsconfig.json`. Do not disable any of them.
- **Import specifiers** — always use `.js` extensions (e.g. `"./config.js"`), even though the source files are `.ts`. This is required for native ESM in the browser.
- **No default exports for modules with multiple exports** — use named exports; only `config.ts` uses a default export.
- **Type annotations** — let TypeScript infer where obvious; annotate function signatures and public class members.
- **`unknown` over `any`** — catch-block errors are `unknown`; narrow them before use.

### CSS

- Custom properties follow the `--spacing-*` naming convention.
- CSS class names use BEM: `block`, `block__element`, `block--modifier`.
- All colour values reference Pico CSS variables (`var(--pico-*)`) wherever possible.

### File naming

| Type | Convention | Example |
|---|---|---|
| TypeScript source | `kebab-case.ts` | `http-client.ts` |
| CSS | `kebab-case.css` | `style.css` |
| Node scripts | `kebab-case.mjs` | `copy-assets.mjs` |
| Documentation | `kebab-case.md` | `getting-started.md` |

## Adding a new page

1. Create `src/pages/<page-name>.ts` that exports a `render<PageName>` function:

   ```ts
   // src/pages/about.ts
   import type { CelestialApi } from "../api/index.js";

   export function renderAboutPage(container: HTMLElement, _api: CelestialApi): void {
     container.innerHTML = `
       <section>
         <h2>About</h2>
         <p>…</p>
       </section>
     `;
   }
   ```

2. Import and call it from `src/main.ts`:

   ```ts
   import { renderAboutPage } from "./pages/about.js";
   // …
   renderAboutPage(mainContent, celestialApi);
   ```

3. Add a nav link in the shell layout inside `src/main.ts`.

## Adding a new API method

1. Add the TypeScript interface(s) for the request/response to `src/types/celestial.ts`.
2. Export the new type(s) from `src/types/index.ts`.
3. Add the method to `CelestialApi` in `src/api/celestial-api.ts`:

   ```ts
   calcEscapeVelocity(bodyId: string): Promise<ApiResponse<EscapeVelocityResult>> {
     return this.client.post<EscapeVelocityResult>("/calculations/escape-velocity", { bodyId });
   }
   ```

4. Consume the method from the relevant page.

## Adding a new utility

Place single-purpose helpers in `src/utils/`. Each file should export one or two closely related functions. Avoid side effects at module level.

## Pull request guidelines

- Keep PRs focused — one feature or fix per PR.
- Write a clear title and description explaining **what** and **why**.
- Run `npm run typecheck` and `npm run build` locally before pushing; the PR should be green.
- Do not commit `dist/`, `node_modules/`, or any editor-specific files.
- Reference the issue number if one exists: `Closes #42`.

## Project structure quick reference

See [Architecture](architecture.md) for the full directory layout and data-flow diagram.
