import { Position } from 'geojson';
export declare function toDegree(radian: number): number;
export declare function toRadian(angle: number): number;
/**
 * Converts an array of latitudes, longitudes in E7 format to a list of points in degrees.
 *
 * @param {[]} array: An E7 array [lat_e7, lng_e7, lat_e7, lng_e7, ...]
 * @return {[]} An array of points in degrees
 *              [ [lng_degrees, lat_degrees], [lng_degrees, lat_degrees], ...]
 */
export declare function convertE7Array(array: number[]): Position[];
//# sourceMappingURL=math.d.ts.map