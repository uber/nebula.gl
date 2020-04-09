import destination from '@turf/destination';
import bearing from '@turf/bearing';
import pointToLineDistance from '@turf/point-to-line-distance';
import { point } from '@turf/helpers';
import {
  Position,
  Point,
  LineString,
  FeatureOf,
  FeatureWithProps,
  Viewport,
} from '@nebula.gl/edit-modes';
import WebMercatorViewport from 'viewport-mercator-project';

// TODO edit-modes: delete and use edit-modes/utils instead

export type NearestPointType = FeatureWithProps<Point, { dist: number; index: number }>;

export function toDeckColor(
  color?: [number, number, number, number] | number,
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
    coordinates: [p1, p2],
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
  //@ts-ignore
  return [p3.geometry.coordinates, p4.geometry.coordinates];
}

export function distance2d(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

export function mix(a: number, b: number, ratio: number): number {
  return b * ratio + a * (1 - ratio);
}

export function nearestPointOnProjectedLine(
  line: FeatureOf<LineString>,
  inPoint: FeatureOf<Point>,
  viewport: Viewport
): NearestPointType {
  const wmViewport = new WebMercatorViewport(viewport);
  // Project the line to viewport, then find the nearest point
  const coordinates: Array<Array<number>> = line.geometry.coordinates as any;
  const projectedCoords = coordinates.map(([x, y, z = 0]) => wmViewport.project([x, y, z]));
  //@ts-ignore
  const [x, y] = wmViewport.project(inPoint.geometry.coordinates);
  // console.log('projectedCoords', JSON.stringify(projectedCoords));

  let minDistance = Infinity;
  let minPointInfo = {};

  projectedCoords.forEach(([x2, y2], index) => {
    if (index === 0) {
      return;
    }

    const [x1, y1] = projectedCoords[index - 1];

    // line from projectedCoords[index - 1] to projectedCoords[index]
    // convert to Ax + By + C = 0
    const A = y1 - y2;
    const B = x2 - x1;
    const C = x1 * y2 - x2 * y1;

    // https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
    const div = A * A + B * B;
    const distance = Math.abs(A * x + B * y + C) / Math.sqrt(div);

    // TODO: Check if inside bounds

    if (distance < minDistance) {
      minDistance = distance;
      minPointInfo = {
        index,
        x0: (B * (B * x - A * y) - A * C) / div,
        y0: (A * (-B * x + A * y) - B * C) / div,
      };
    }
  });
  //@ts-ignore
  const { index, x0, y0 } = minPointInfo;
  const [x1, y1, z1 = 0] = projectedCoords[index - 1];
  const [x2, y2, z2 = 0] = projectedCoords[index];

  // calculate what ratio of the line we are on to find the proper z
  const lineLength = distance2d(x1, y1, x2, y2);
  const startToPointLength = distance2d(x1, y1, x0, y0);
  const ratio = startToPointLength / lineLength;
  const z0 = mix(z1, z2, ratio);

  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: wmViewport.unproject([x0, y0, z0]),
    },
    properties: {
      // TODO: calculate the distance in proper units
      dist: minDistance,
      index: index - 1,
    },
  };
}
