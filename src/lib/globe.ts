import * as THREE from 'three';

/** Planetocentric lat/lon (degrees, east-positive) -> point on a Three.js SphereGeometry.
 *  Matches the default sphere UV layout, so markers line up with the equirectangular texture. */
export const latLonToVector = (lat: number, lon: number, radius: number) => {
  const phi = ((lon + 180) / 360) * Math.PI * 2;
  const theta = ((90 - lat) / 180) * Math.PI;
  return new THREE.Vector3(
    -radius * Math.cos(phi) * Math.sin(theta),
    radius * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

/** Globe rotation that turns the given lat/lon to face the camera (+Z). */
export const rotationFacing = (lat: number, lon: number) => {
  const p = latLonToVector(lat, lon, 1);
  return { y: Math.atan2(-p.x, p.z), x: THREE.MathUtils.degToRad(lat) };
};

export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Shortest equivalent of `target` relative to `from` (radians), so a globe turns the short way round. */
export const nearestAngle = (from: number, target: number) => {
  const twoPi = Math.PI * 2;
  const d = ((((target - from) % twoPi) + twoPi * 1.5) % twoPi) - Math.PI;
  return from + d;
};
