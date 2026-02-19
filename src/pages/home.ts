import type { CelestialApi } from "../api/index.js";
import { showError } from "../utils/notifications.js";
import { escapeHtml } from "../utils/escape-html.js";

/**
 * Renders the home page into the given container and wires up its interactions.
 */
export function renderHomePage(container: HTMLElement, api: CelestialApi): void {
  container.innerHTML = `
    <section>
      <hgroup>
        <h2>Coordinate Transformation</h2>
        <p>Convert heliocentric rectangular equatorial coordinates to ecliptic coordinates.</p>
      </hgroup>

      <form id="transform-form">
        <fieldset class="grid">
          <label>
            X
            <input id="coord-x" name="x" type="number" step="any" placeholder="e.g. 0.716" required />
          </label>
          <label>
            Y
            <input id="coord-y" name="y" type="number" step="any" placeholder="e.g. 0.698" required />
          </label>
          <label>
            Z
            <input id="coord-z" name="z" type="number" step="any" placeholder="e.g. 0.000" required />
          </label>
        </fieldset>

        <label>
          Obliquity of the ecliptic (°) <small>optional — defaults to J2000 value (~23.439°)</small>
          <input id="obliquity-input" name="obliquityDeg" type="number" step="any" placeholder="23.439" />
        </label>

        <button id="btn-transform" type="button">Transform</button>
      </form>

      <div id="transform-result" aria-live="polite"></div>
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

  wireTransformButton(api);
  wireCalculationButtons(api);
}

async function wireTransformButton(api: CelestialApi): Promise<void> {
  document.getElementById("btn-transform")?.addEventListener("click", async () => {
    const x = parseFloat(getInputValue("coord-x"));
    const y = parseFloat(getInputValue("coord-y"));
    const z = parseFloat(getInputValue("coord-z"));
    if (isNaN(x) || isNaN(y) || isNaN(z)) return;

    const obliquityRaw = getInputValue("obliquity-input");
    const obliquityDeg = obliquityRaw !== "" ? parseFloat(obliquityRaw) : undefined;

    const resultEl = document.getElementById("transform-result")!;
    resultEl.innerHTML = "<p aria-busy='true'>Transforming…</p>";
    try {
      const { data } = await api.transformEquatorialToEcliptic({ x, y, z, obliquityDeg });
      resultEl.innerHTML = `
        <article>
          <header>Ecliptic Coordinates</header>
          <dl>
            <dt>X</dt><dd>${escapeHtml(data.x.toString())}</dd>
            <dt>Y</dt><dd>${escapeHtml(data.y.toString())}</dd>
            <dt>Z</dt><dd>${escapeHtml(data.z.toString())}</dd>
          </dl>
        </article>
      `;
    } catch (error) {
      resultEl.innerHTML = "";
      showError(error);
    }
  });
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
