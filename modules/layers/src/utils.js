// @flow

import destination from '@turf/destination';
import bearing from '@turf/bearing';
import pointToLineDistance from '@turf/point-to-line-distance';
import { point } from '@turf/helpers';
import type { Position, LineString } from './geojson-types.js';

export function toDeckColor(
  color?: ?[number, number, number, number],
  defaultColor: [number, number, number, number] = [255, 0, 0, 255]
): [number, number, number, number] {
  if (!Array.isArray(color)) {
    return defaultColor;
  }
  return [color[0] * 255, color[1] * 255, color[2] * 255, color[3] * 255];
}

//
// a GeoJSON helper function that calls the provided function with
// an argument that is the most deeply-nested array having elements
// that are arrays of primitives as an argument, e.g.
//
// {
//   "type": "MultiPolygon",
//   "coordinates": [
//       [
//           [[30, 20], [45, 40], [10, 40], [30, 20]]
//       ],
//       [
//           [[15, 5], [40, 10], [10, 20], [5, 10], [15, 5]]
//       ]
//   ]
// }
//
// the function would be called on:
//
// [[30, 20], [45, 40], [10, 40], [30, 20]]
//
// and
//
// [[15, 5], [40, 10], [10, 20], [5, 10], [15, 5]]
//
export function recursivelyTraverseNestedArrays(
  array: Array<any>,
  prefix: Array<number>,
  fn: Function
) {
  if (!Array.isArray(array[0])) {
    return true;
  }
  for (let i = 0; i < array.length; i++) {
    if (recursivelyTraverseNestedArrays(array[i], [...prefix, i], fn)) {
      fn(array, prefix);
      break;
    }
  }
  return false;
}

export function generatePointsParallelToLinePoints(
  p1: Position,
  p2: Position,
  groundCoords: Position
): Position[] {
  const lineString: LineString = {
    type: 'LineString',
    coordinates: [p1, p2]
  };
  const pt = point(groundCoords);
  const ddistance = pointToLineDistance(pt, lineString);
  const lineBearing = bearing(p1, p2);

  // Check if current point is to the left or right of line
  // Line from A=(x1,y1) to B=(x2,y2) a point P=(x,y)
  // then (x−x1)(y2−y1)−(y−y1)(x2−x1)
  const isPointToLeftOfLine =
    (groundCoords[0] - p1[0]) * (p2[1] - p1[1]) - (groundCoords[1] - p1[1]) * (p2[0] - p1[0]);

  // Bearing to draw perpendicular to the line string
  const orthogonalBearing = isPointToLeftOfLine < 0 ? lineBearing - 90 : lineBearing - 270;

  // Get coordinates for the point p3 and p4 which are perpendicular to the lineString
  // Add the distance as the current position moves away from the lineString
  const p3 = destination(p2, ddistance, orthogonalBearing);
  const p4 = destination(p1, ddistance, orthogonalBearing);

  return [p3.geometry.coordinates, p4.geometry.coordinates];
}

export const SortType = {
  MIN: 'min',
  MAX: 'max'
};

export class SortedList {
  _array: any[];
  _arraySize: number;
  _getValueToCompareFn: Function;
  _sortType: string;

  constructor(options: Object) {
    const { arraySize, getValueToCompareFn, sortType } = options;
    this._array = [];
    this._arraySize = arraySize;
    this._getValueToCompareFn = getValueToCompareFn;
    this._sortType = sortType;
  }

  push(value: any): boolean {
    let isArrayModified = false;
    const pushIndex = this._array.length;

    if (pushIndex < this._arraySize) {
      // Initial array population
      this._array[pushIndex] = value;
      isArrayModified = true;
    } else {
      // Value comparison function that accounts for the sortType
      const contextualValueComparison = (a, b) => (this._sortType === 'min' ? a < b : a > b);
      // If the value passed in this method will be sorted before the last item
      // of the array, replace the last item of the array with the value passed.
      const isPushable = contextualValueComparison(
        this._getValueToCompareFn(value),
        this._getValueToCompareFn(this._array[this._arraySize - 1])
      );
      if (isPushable) {
        this._array[this._arraySize - 1] = value;
        isArrayModified = true;
      }
    }

    if (this._arraySize > 1 && isArrayModified) {
      // Sort the array only if the array was modified. Sort the array so that
      // the last item in the array is ready to be replaced (i.e. it has the
      // greatest value if this.sortType === min, or has the smallest value if
      // this.sortType === max).
      const isSortMin = this._sortType === 'min';
      const contextualSortFunction = (a, b) =>
        this._getValueToCompareFn(isSortMin ? a : b) - this._getValueToCompareFn(isSortMin ? b : a);

      this._array.sort(contextualSortFunction);
    }

    return isArrayModified;
  }

  fromArray(valueArray: any[]) {
    valueArray.forEach(value => this.push(value));
  }

  toArray(): any[] {
    return this._array;
  }

  size(): number {
    return this._array.length;
  }
}
