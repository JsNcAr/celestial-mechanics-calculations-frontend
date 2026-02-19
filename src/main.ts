import "./style.css";
import config from "./config.ts";
import { createHttpClient, CelestialApi } from "./api/index.ts";
import { renderHomePage } from "./pages/home.ts";

// ── Bootstrap ────────────────────────────────────────────────────────────────

const httpClient = createHttpClient(config.apiBaseUrl);
const celestialApi = new CelestialApi(httpClient);

const appEl = document.getElementById("app");
if (!appEl) throw new Error("Root element #app not found.");

appEl.innerHTML = `
  <header class="container-fluid">
    <nav>
      <ul>
        <li><a href="/" class="brand">${config.appTitle}</a></li>
      </ul>
      <ul>
        <li><a href="/">Home</a></li>
      </ul>
    </nav>
  </header>

  <main class="container" id="main-content">
  </main>

  <footer class="container-fluid">
    <small>&copy; ${new Date().getFullYear()} Celestial Mechanics</small>
  </footer>

  <div id="notifications" aria-live="assertive"></div>
`;

const mainContent = document.getElementById("main-content")!;
renderHomePage(mainContent, celestialApi);
