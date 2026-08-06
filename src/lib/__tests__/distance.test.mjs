import assert from "node:assert/strict";
import test from "node:test";

const EARTH_RADIUS_KM = 6371;
function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}
function calculateDistanceKm(from, to) {
  const dLat = toRadians(to.latitude - from.latitude);
  const dLng = toRadians(to.longitude - from.longitude);
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

test("distance between nearby Busan points is under 5km", () => {
  const km = calculateDistanceKm(
    { latitude: 35.2441, longitude: 129.2185 },
    { latitude: 35.25, longitude: 129.22 },
  );
  assert.equal(km > 0, true);
  assert.equal(km < 5, true);
});

test("identical coordinates yield ~0", () => {
  const point = { latitude: 35.1, longitude: 129.1 };
  assert.ok(calculateDistanceKm(point, point) < 0.0001);
});
