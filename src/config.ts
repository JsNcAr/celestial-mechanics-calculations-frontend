/**
 * Application-wide configuration.
 * Values can be overridden via Vite's import.meta.env mechanism.
 */
const config = {
  /** Base URL of the celestial-mechanics backend API. */
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1",
  /** Application title shown in the browser tab and header. */
  appTitle: "Celestial Mechanics",
} as const;

export default config;
