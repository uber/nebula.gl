// @flow

import destination from '@turf/destination';
import bearing from '@turf/bearing';
import pointToLineDistance from '@turf/point-to-line-distance';
import { point } from '@turf/helpers';
import type { Position, LineString, FeatureCollection } from '../geojson-types.js';

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

export function convertFeatureListToFeatureCollection(featuresList: Array<any>): FeatureCollection {
  const features = featuresList.map(feature => {
    // Turf functions do not preserve properties nested inside of a FeatureCollection feature's
    // geometry. This logic moves the nested geometry properties up to the parent feature.
    const featureObject: any = {
      type: 'Feature',
      geometry: feature,
      properties: feature.properties || {}
    };
    return featureObject;
  });
  return {
    type: 'FeatureCollection',
    features
  };
}

export function convertFeatureCollectionToFeatureList({ features }: FeatureCollection): Array<any> {
  return features.map(({ geometry, properties }) => {
    // Turf functions do not preserve a properties value of _internalIndex: 0
    // It is important for the properties._internalIndex value to be present to prevent
    // a strange mass duplication bug.
    if (properties) {
      geometry.properties = properties;
      if (!properties._internalIndex) {
        geometry.properties = { ...properties, _internalIndex: 0 };
      }
    }
    return geometry;
  });
}
