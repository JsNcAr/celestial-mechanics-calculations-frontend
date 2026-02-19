import type {
  TransformationRequest,
  EclipticCoordinates,
  OrbitalPeriodResult,
  GravitationalForceResult,
} from "../types/index.js";
import type { ApiResponse } from "../types/index.js";
import type { HttpClient } from "./http-client.js";

/**
 * All celestial-mechanics API calls are grouped in this module.
 * Each method returns a typed promise so callers never deal with raw JSON.
 */
export class CelestialApi {
  private readonly client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  // ── Coordinate Transformations ───────────────────────────────────────────────

  transformEquatorialToEcliptic(
    payload: TransformationRequest,
  ): Promise<ApiResponse<EclipticCoordinates>> {
    return this.client.post<EclipticCoordinates>(
      "/transformations/equatorial-to-ecliptic",
      payload,
    );
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
