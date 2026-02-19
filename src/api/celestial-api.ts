import type {
  CelestialBody,
  OrbitalPeriodResult,
  GravitationalForceResult,
} from "../types/index.ts";
import type { ApiResponse, PaginatedResponse } from "../types/index.ts";
import type { HttpClient } from "./http-client.ts";

/**
 * All celestial-mechanics API calls are grouped in this module.
 * Each method returns a typed promise so callers never deal with raw JSON.
 */
export class CelestialApi {
  private readonly client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  // ── Bodies ──────────────────────────────────────────────────────────────────

  listBodies(): Promise<PaginatedResponse<CelestialBody>> {
    return this.client.getList<CelestialBody>("/bodies");
  }

  getBody(id: string): Promise<ApiResponse<CelestialBody>> {
    return this.client.get<CelestialBody>(`/bodies/${encodeURIComponent(id)}`);
  }

  // ── Calculations ─────────────────────────────────────────────────────────────

  calcOrbitalPeriod(bodyId: string): Promise<ApiResponse<OrbitalPeriodResult>> {
    return this.client.post<OrbitalPeriodResult>("/calculations/orbital-period", { bodyId });
  }

  calcGravitationalForce(
    body1Id: string,
    body2Id: string,
  ): Promise<ApiResponse<GravitationalForceResult>> {
    return this.client.post<GravitationalForceResult>("/calculations/gravitational-force", {
      body1Id,
      body2Id,
    });
  }
}
