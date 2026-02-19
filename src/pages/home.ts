import type { CelestialApi } from "../api/index.ts";
import { showError } from "../utils/notifications.ts";
import { escapeHtml } from "../utils/escape-html.ts";
import type { CelestialBody } from "../types/index.ts";

/**
 * Renders the home page into the given container and wires up its interactions.
 */
export function renderHomePage(container: HTMLElement, api: CelestialApi): void {
  container.innerHTML = `
    <section>
      <hgroup>
        <h2>Celestial Bodies</h2>
        <p>Explore catalogued bodies and run orbital mechanics calculations.</p>
      </hgroup>

      <div id="bodies-grid" aria-live="polite" aria-busy="true">
        <p>Loading celestial bodies…</p>
      </div>
    </section>

    <section>
      <hgroup>
        <h2>Calculations</h2>
        <p>Select two bodies and choose a calculation to run.</p>
      </hgroup>

      <form id="calc-form">
        <fieldset class="grid">
          <label>
            Body 1 ID
            <input id="body1-input" name="body1Id" type="text" placeholder="e.g. earth" required />
          </label>
          <label>
            Body 2 ID
            <input id="body2-input" name="body2Id" type="text" placeholder="e.g. moon" required />
          </label>
        </fieldset>

        <div role="group">
          <button id="btn-period" type="button">Orbital Period</button>
          <button id="btn-gravity" type="button">Gravitational Force</button>
        </div>
      </form>

      <div id="calc-result" aria-live="polite"></div>
    </section>
  `;

  loadBodies(api);
  wireCalculationButtons(api);
}

async function loadBodies(api: CelestialApi): Promise<void> {
  const grid = document.getElementById("bodies-grid")!;

  try {
    const response = await api.listBodies();
    if (response.data.length === 0) {
      grid.innerHTML = "<p>No celestial bodies found.</p>";
      return;
    }
    grid.setAttribute("aria-busy", "false");
    grid.innerHTML = response.data.map(bodyCard).join("");
  } catch (error) {
    grid.setAttribute("aria-busy", "false");
    grid.innerHTML = "<p>Failed to load celestial bodies.</p>";
    showError(error);
  }
}

function bodyCard(body: CelestialBody): string {
  return `
    <article>
      <header><strong>${escapeHtml(body.name)}</strong> <small>(${escapeHtml(body.type)})</small></header>
      <dl>
        <dt>Mass</dt><dd>${body.mass.toExponential(3)} kg</dd>
        <dt>Radius</dt><dd>${body.radius.toExponential(3)} m</dd>
      </dl>
    </article>
  `;
}

function wireCalculationButtons(api: CelestialApi): void {
  document.getElementById("btn-period")?.addEventListener("click", async () => {
    const body1Id = getInputValue("body1-input");
    if (!body1Id) return;
    const resultEl = document.getElementById("calc-result")!;
    resultEl.innerHTML = "<p aria-busy='true'>Calculating…</p>";
    try {
      const { data } = await api.calcOrbitalPeriod(body1Id);
      resultEl.innerHTML = `
        <article>
          <header>Orbital Period — ${escapeHtml(data.bodyName)}</header>
          <dl>
            <dt>Seconds</dt><dd>${data.periodSeconds.toFixed(2)} s</dd>
            <dt>Days</dt><dd>${data.periodDays.toFixed(2)} d</dd>
            <dt>Years</dt><dd>${data.periodYears.toFixed(4)} yr</dd>
          </dl>
        </article>
      `;
    } catch (error) {
      resultEl.innerHTML = "";
      showError(error);
    }
  });

  document.getElementById("btn-gravity")?.addEventListener("click", async () => {
    const body1Id = getInputValue("body1-input");
    const body2Id = getInputValue("body2-input");
    if (!body1Id || !body2Id) return;
    const resultEl = document.getElementById("calc-result")!;
    resultEl.innerHTML = "<p aria-busy='true'>Calculating…</p>";
    try {
      const { data } = await api.calcGravitationalForce(body1Id, body2Id);
      resultEl.innerHTML = `
        <article>
          <header>Gravitational Force</header>
          <dl>
            <dt>Force</dt><dd>${data.forceNewtons.toExponential(4)} N</dd>
            <dt>Distance</dt><dd>${data.distanceMeters.toExponential(4)} m</dd>
          </dl>
        </article>
      `;
    } catch (error) {
      resultEl.innerHTML = "";
      showError(error);
    }
  });
}

function getInputValue(id: string): string {
  return (document.getElementById(id) as HTMLInputElement | null)?.value.trim() ?? "";
}
