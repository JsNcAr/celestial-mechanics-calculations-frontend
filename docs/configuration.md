# Configuration

The only configuration file in this project is **`src/config.ts`**.  
Edit it before running `npm run build`.

## `src/config.ts`

```ts
const config = {
  /** Base URL of the celestial-mechanics backend API. */
  apiBaseUrl: "http://localhost:8000/api/v1",
  /** Application title shown in the browser tab and header. */
  appTitle: "Celestial Mechanics",
} as const;

export default config;
```

### Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `apiBaseUrl` | `string` | `"http://localhost:8000/api/v1"` | Root URL of the backend REST API. Must **not** have a trailing slash. |
| `appTitle` | `string` | `"Celestial Mechanics"` | Displayed in the nav bar. Does **not** set the `<title>` tag (update `index.html` for that). |

### Changing the API URL

```ts
const config = {
  apiBaseUrl: "https://api.your-domain.com/api/v1",
  appTitle: "Celestial Mechanics",
} as const;
```

Rebuild after every config change:

```bash
npm run build
```

## Environment-specific builds

Because the app is compiled with plain `tsc` (no bundler), there is no environment-variable injection at build time. Use one of these approaches for multiple environments:

### Option A — Manual edit (simplest)

Edit `src/config.ts` before building for each target environment.

### Option B — Replace with a sed/script step in CI

```yaml
# Example GitHub Actions step
- name: Set API URL
  run: |
    sed -i 's|http://localhost:8000/api/v1|${{ vars.API_BASE_URL }}|' src/config.ts
- run: npm run build
```

### Option C — Runtime configuration via `window`

For dynamic configuration without rebuilding, add a `config.js` file served by your backend/CDN that sets a global:

```html
<!-- index.html — before main.js -->
<script src="/runtime-config.js"></script>
```

```js
// runtime-config.js (served by your infrastructure)
window.__API_BASE_URL__ = "https://api.prod.example.com/api/v1";
```

Then read it in `src/config.ts`:

```ts
const config = {
  apiBaseUrl: (window as { __API_BASE_URL__?: string }).__API_BASE_URL__
    ?? "http://localhost:8000/api/v1",
  appTitle: "Celestial Mechanics",
} as const;
```

## Deployment checklist

1. Set `apiBaseUrl` to the production backend URL.
2. Run `npm run build`.
3. Upload the **entire `dist/`** directory to your static hosting provider.
4. Ensure the backend sends `Access-Control-Allow-Origin` for your frontend's origin.
5. Configure the server to respond to all routes with `dist/index.html` (single-page app routing).

## Pico CSS theme

The HTML document uses `data-theme="dark"` on the `<html>` element to opt in to Pico's built-in dark palette:

```html
<html lang="en" data-theme="dark">
```

To switch to the light theme, change the attribute value:

```html
<html lang="en" data-theme="light">
```

Or remove it entirely to follow the OS preference (`prefers-color-scheme`).
