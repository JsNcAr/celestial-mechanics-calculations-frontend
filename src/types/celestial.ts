/**
 * Input payload for a coordinate transformation request.
 */
export interface TransformationRequest {
  x: number;
  y: number;
  z: number;
  /** Obliquity of the ecliptic in degrees. Defaults to the J2000 value (~23.439°) when omitted. */
  obliquityDeg?: number;
}

/**
 * Heliocentric rectangular ecliptic coordinates returned by the backend.
 */
export interface EclipticCoordinates {
  x: number;
  y: number;
  z: number;
}

/**
 * Result of an orbital period calculation.
 */
export interface OrbitalPeriodResult {
  bodyId: string;
  bodyName: string;
  periodSeconds: number;
  periodDays: number;
  periodYears: number;
}

/**
 * Result of a gravitational force calculation between two bodies.
 */
export interface GravitationalForceResult {
  body1Id: string;
  body2Id: string;
  forceNewtons: number;
  distanceMeters: number;
}
