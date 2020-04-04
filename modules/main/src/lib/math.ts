import { Position } from 'geojson';

export function toDegree(radian: number): number {
  return (radian * 180) / Math.PI;
}

export function toRadian(angle: number): number {
  return (angle * Math.PI) / 180;
}

/**
 * Converts an array of latitudes, longitudes in E7 format to a list of points in degrees.
 *
 * @param {[]} array: An E7 array [lat_e7, lng_e7, lat_e7, lng_e7, ...]
 * @return {[]} An array of points in degrees
 *              [ [lng_degrees, lat_degrees], [lng_degrees, lat_degrees], ...]
 */
export function convertE7Array(array: number[]): Position[] {
  const points = [];
  for (let i = 0; i < array.length; i += 2) {
    const lat = array[i] * 1e-7;
    const lng = array[i + 1] * 1e-7;
    points.push([lng, lat]);
  }
  return points;
}
