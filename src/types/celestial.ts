/**
 * Represents a celestial body (planet, moon, star, etc.)
 */
export interface CelestialBody {
  id: string;
  name: string;
  type: CelestialBodyType;
  mass: number;
  radius: number;
  distanceFromSun?: number;
}

export type CelestialBodyType = "star" | "planet" | "moon" | "asteroid" | "comet";

/**
 * Orbital elements that define a Keplerian orbit.
 */
export interface OrbitalElements {
  semiMajorAxis: number;
  eccentricity: number;
  inclination: number;
  longitudeOfAscendingNode: number;
  argumentOfPeriapsis: number;
  trueAnomaly: number;
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
