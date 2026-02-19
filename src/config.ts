/**
 * Application-wide configuration.
 * Update API_BASE_URL to point at your backend before serving.
 */
const config = {
  /** Base URL of the celestial-mechanics backend API. */
  apiBaseUrl: "http://localhost:8000/api/v1",
  /** Application title shown in the browser tab and header. */
  appTitle: "Celestial Mechanics",
} as const;

export default config;
