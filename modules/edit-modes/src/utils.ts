import destination from '@turf/destination';
import bearing from '@turf/bearing';
import pointToLineDistance from '@turf/point-to-line-distance';
import { flattenEach } from '@turf/meta';
import { point, MultiLineString } from '@turf/helpers';
import { getCoords } from '@turf/invariant';
import WebMercatorViewport from 'viewport-mercator-project';
import { Viewport, Pick, EditHandleFeature, EditHandleType } from './types';
import {
  Geometry,
  Position,
  Point,
  LineString,
  Polygon,
  FeatureOf,
  FeatureWithProps,
  AnyCoordinates,
} from './geojson-types';

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
  fn: (array: Array<any>, prefix: number[]) => void
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
  mapCoords: Position
): Position[] {
  const lineString: LineString = {
    type: 'LineString',
    coordinates: [p1, p2],
  };
  const pt = point(mapCoords);
  const ddistance = pointToLineDistance(pt, lineString);
  const lineBearing = bearing(p1, p2);

  // Check if current point is to the left or right of line
  // Line from A=(x1,y1) to B=(x2,y2) a point P=(x,y)
  // then (x−x1)(y2−y1)−(y−y1)(x2−x1)
  const isPointToLeftOfLine =
    (mapCoords[0] - p1[0]) * (p2[1] - p1[1]) - (mapCoords[1] - p1[1]) * (p2[0] - p1[0]);

  // Bearing to draw perpendicular to the line string
  const orthogonalBearing = isPointToLeftOfLine < 0 ? lineBearing - 90 : lineBearing - 270;

  // Get coordinates for the point p3 and p4 which are perpendicular to the lineString
  // Add the distance as the current position moves away from the lineString
  const p3 = destination(p2, ddistance, orthogonalBearing);
  const p4 = destination(p1, ddistance, orthogonalBearing);

  return [p3.geometry.coordinates, p4.geometry.coordinates] as Position[];
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
  // @ts-ignore
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
      // @ts-expect-error
      coordinates: wmViewport.unproject([x0, y0, z0]),
    },
    properties: {
      // TODO: calculate the distance in proper units
      dist: minDistance,
      index: index - 1,
    },
  };
}

export function nearestPointOnLine<G extends LineString | MultiLineString>(
  lines: FeatureOf<LineString>,
  inPoint: FeatureOf<Point>,
  viewport?: Viewport
): NearestPointType {
  let mercator;

  if (viewport) {
    mercator = new WebMercatorViewport(viewport);
  }
  let closestPoint: any = point([Infinity, Infinity], {
    dist: Infinity,
  });

  if (!lines.geometry?.coordinates.length || lines.geometry?.coordinates.length < 2) {
    return closestPoint;
  }

  // @ts-ignore
  flattenEach(lines, (line: any) => {
    const coords: any = getCoords(line);
    // @ts-ignore
    const pointCoords: any = getCoords(inPoint);

    let minDist;
    let to;
    let from;
    let x;
    let y;
    let segmentIdx;
    let dist;

    if (coords.length > 1 && pointCoords.length) {
      let lineCoordinates;
      let pointCoordinate;

      // If viewport is given, then translate these coordinates to pixels to increase precision
      if (mercator) {
        lineCoordinates = coords.map((lineCoordinate) => mercator.project(lineCoordinate));
        pointCoordinate = mercator.project(pointCoords);
      } else {
        lineCoordinates = coords;
        pointCoordinate = pointCoords;
      }

      for (let n = 1; n < lineCoordinates.length; n++) {
        if (lineCoordinates[n][0] !== lineCoordinates[n - 1][0]) {
          const slope =
            (lineCoordinates[n][1] - lineCoordinates[n - 1][1]) /
            (lineCoordinates[n][0] - lineCoordinates[n - 1][0]);
          const inverseSlope = lineCoordinates[n][1] - slope * lineCoordinates[n][0];

          dist =
            Math.abs(slope * pointCoordinate[0] + inverseSlope - pointCoordinate[1]) /
            Math.sqrt(slope * slope + 1);
        } else dist = Math.abs(pointCoordinate[0] - lineCoordinates[n][0]);

        // length^2 of line segment
        const rl2 =
          Math.pow(lineCoordinates[n][1] - lineCoordinates[n - 1][1], 2) +
          Math.pow(lineCoordinates[n][0] - lineCoordinates[n - 1][0], 2);

        // distance^2 of pt to end line segment
        const ln2 =
          Math.pow(lineCoordinates[n][1] - pointCoordinate[1], 2) +
          Math.pow(lineCoordinates[n][0] - pointCoordinate[0], 2);

        // distance^2 of pt to begin line segment
        const lnm12 =
          Math.pow(lineCoordinates[n - 1][1] - pointCoordinate[1], 2) +
          Math.pow(lineCoordinates[n - 1][0] - pointCoordinate[0], 2);

        // minimum distance^2 of pt to infinite line
        const dist2 = Math.pow(dist, 2);

        // calculated length^2 of line segment
        const calcrl2 = ln2 - dist2 + lnm12 - dist2;

        // redefine minimum distance to line segment (not infinite line) if necessary
        if (calcrl2 > rl2) {
          dist = Math.sqrt(Math.min(ln2, lnm12));
        }

        if (minDist === null || minDist === undefined || minDist > dist) {
          // eslint-disable-next-line max-depth
          if (calcrl2 > rl2) {
            // eslint-disable-next-line max-depth
            if (lnm12 < ln2) {
              to = 0; // nearer to previous point
              from = 1;
            } else {
              from = 0; // nearer to current point
              to = 1;
            }
          } else {
            // perpendicular from point intersects line segment
            to = Math.sqrt(lnm12 - dist2) / Math.sqrt(rl2);
            from = Math.sqrt(ln2 - dist2) / Math.sqrt(rl2);
          }
          minDist = dist;
          segmentIdx = n;
        }
      }

      const dx = lineCoordinates[segmentIdx - 1][0] - lineCoordinates[segmentIdx][0];
      const dy = lineCoordinates[segmentIdx - 1][1] - lineCoordinates[segmentIdx][1];

      x = lineCoordinates[segmentIdx - 1][0] - dx * to;
      y = lineCoordinates[segmentIdx - 1][1] - dy * to;
    }

    // index needs to be -1 because we have to account for the shift from initial backscan
    let snapPoint = { x, y, idx: segmentIdx - 1, to, from };

    if (mercator) {
      const pixelToLatLong = mercator.unproject([snapPoint.x, snapPoint.y]);
      snapPoint = {
        x: pixelToLatLong[0],
        y: pixelToLatLong[1],
        idx: segmentIdx - 1,
        to,
        from,
      };
    }

    closestPoint = point([snapPoint.x, snapPoint.y], {
      dist: Math.abs(snapPoint.from - snapPoint.to),
      index: snapPoint.idx,
    });
  });

  return closestPoint;
}

export function getPickedEditHandle(
  picks: Pick[] | null | undefined
): EditHandleFeature | null | undefined {
  const handles = getPickedEditHandles(picks);
  return handles.length ? handles[0] : null;
}

export function getPickedSnapSourceEditHandle(
  picks: Pick[] | null | undefined
): EditHandleFeature | null | undefined {
  const handles = getPickedEditHandles(picks);
  return handles.find((handle) => handle.properties.editHandleType === 'snap-source');
}

export function getNonGuidePicks(picks: Pick[]): Pick[] {
  return picks && picks.filter((pick) => !pick.isGuide);
}

export function getPickedExistingEditHandle(
  picks: Pick[] | null | undefined
): EditHandleFeature | null | undefined {
  const handles = getPickedEditHandles(picks);
  return handles.find(
    ({ properties }) => properties.featureIndex >= 0 && properties.editHandleType === 'existing'
  );
}

export function getPickedIntermediateEditHandle(
  picks: Pick[] | null | undefined
): EditHandleFeature | null | undefined {
  const handles = getPickedEditHandles(picks);
  return handles.find(
    ({ properties }) => properties.featureIndex >= 0 && properties.editHandleType === 'intermediate'
  );
}

export function getPickedEditHandles(picks: Pick[] | null | undefined): EditHandleFeature[] {
  const handles =
    (picks &&
      picks
        .filter((pick) => pick.isGuide && pick.object.properties.guideType === 'editHandle')
        .map((pick) => pick.object)) ||
    [];

  return handles;
}

export function getEditHandlesForGeometry(
  geometry: Geometry,
  featureIndex: number,
  editHandleType: EditHandleType = 'existing'
): EditHandleFeature[] {
  let handles: EditHandleFeature[] = [];

  switch (geometry.type) {
    case 'Point':
      // positions are not nested
      handles = [
        {
          type: 'Feature',
          properties: {
            guideType: 'editHandle',
            editHandleType,
            positionIndexes: [],
            featureIndex,
          },
          geometry: {
            type: 'Point',
            coordinates: geometry.coordinates,
          },
        },
      ];
      break;
    case 'MultiPoint':
    case 'LineString':
      // positions are nested 1 level
      handles = handles.concat(
        getEditHandlesForCoordinates(geometry.coordinates, [], featureIndex, editHandleType)
      );
      break;
    case 'Polygon':
    case 'MultiLineString':
      // positions are nested 2 levels
      for (let a = 0; a < geometry.coordinates.length; a++) {
        handles = handles.concat(
          getEditHandlesForCoordinates(geometry.coordinates[a], [a], featureIndex, editHandleType)
        );
        if (geometry.type === 'Polygon') {
          // Don't repeat the first/last handle for Polygons
          handles = handles.slice(0, -1);
        }
      }

      break;
    case 'MultiPolygon':
      // positions are nested 3 levels
      for (let a = 0; a < geometry.coordinates.length; a++) {
        for (let b = 0; b < geometry.coordinates[a].length; b++) {
          handles = handles.concat(
            getEditHandlesForCoordinates(
              geometry.coordinates[a][b],
              [a, b],
              featureIndex,
              editHandleType
            )
          );
          // Don't repeat the first/last handle for Polygons
          handles = handles.slice(0, -1);
        }
      }

      break;
    default:
      // @ts-expect-error
      throw Error(`Unhandled geometry type: ${geometry.type}`);
  }

  return handles;
}

function getEditHandlesForCoordinates(
  coordinates: any[],
  positionIndexPrefix: number[],
  featureIndex: number,
  editHandleType: EditHandleType = 'existing'
): EditHandleFeature[] {
  const editHandles = [];
  for (let i = 0; i < coordinates.length; i++) {
    const position = coordinates[i];
    editHandles.push({
      type: 'Feature',
      properties: {
        guideType: 'editHandle',
        positionIndexes: [...positionIndexPrefix, i],
        featureIndex,
        editHandleType,
      },
      geometry: {
        type: 'Point',
        coordinates: position,
      },
    });
  }
  return editHandles;
}

/**
 * Calculates coordinates for a feature preserving rectangular shape.
 * @param feature Feature before modification.
 * @param editHandleIndex Index of the point to modify.
 * @param mapCoords New position for the point.
 * @returns Updated coordinates.
 */
export function updateRectanglePosition(
  feature: FeatureOf<Polygon>,
  editHandleIndex: number,
  mapCoords: Position
): Position[][] {
  const coordinates = feature.geometry.coordinates;
  if (!coordinates) {
    return null;
  }

  const points = coordinates[0].slice(0, 4);
  points[editHandleIndex % 4] = mapCoords;

  const p0 = points[(editHandleIndex + 2) % 4];
  const p2 = points[editHandleIndex % 4];
  points[(editHandleIndex + 1) % 4] = [p2[0], p0[1]];
  points[(editHandleIndex + 3) % 4] = [p0[0], p2[1]];

  return [[...points, points[0]]];
}

/** Creates a copy of feature's coordinates.
 * Each position in coordinates is transformed by calling the provided function.
 * @param coords Coordinates of a feature.
 * @param callback A function to transform each coordinate.
 * @retuns Transformed coordinates.
 */
export function mapCoords(
  coords: AnyCoordinates,
  callback: (coords: Position) => Position
): AnyCoordinates {
  if (typeof coords[0] === 'number') {
    if (!isNaN(coords[0]) && isFinite(coords[0])) {
      return callback(coords as Position);
    }
    return coords;
  }

  return (coords as Position[])
    .map((coord) => {
      return mapCoords(coord, callback) as Position;
    })
    .filter(Boolean);
}

/**
 * Checks if two line segments intersect.
 *
 * @param {number} Ax - x-coordinate of the start point of the first line segment.
 * @param {number} Ay - y-coordinate of the start point of the first line segment.
 * @param {number} Bx - x-coordinate of the end point of the first line segment.
 * @param {number} By - y-coordinate of the end point of the first line segment.
 * @param {number} Cx - x-coordinate of the start point of the second line segment.
 * @param {number} Cy - y-coordinate of the start point of the second line segment.
 * @param {number} Dx - x-coordinate of the end point of the second line segment.
 * @param {number} Dy - y-coordinate of the end point of the second line segment.
 * @return {boolean} true if the line segments intersect, false otherwise.
 */
// eslint-disable-next-line max-params
function lineSegmentIntersection(
  Ax: number,
  Ay: number,
  Bx: number,
  By: number,
  Cx: number,
  Cy: number,
  Dx: number,
  Dy: number
): boolean {
  let newX: number;

  if ((Ax === Bx && Ay === By) || (Cx === Dx && Cy === Dy)) {
    return false;
  }

  if (
    (Ax === Cx && Ay === Cy) ||
    (Bx === Cx && By === Cy) ||
    (Ax === Dx && Ay === Dy) ||
    (Bx === Dx && By === Dy)
  ) {
    return false;
  }

  Bx -= Ax;
  By -= Ay;
  Cx -= Ax;
  Cy -= Ay;
  Dx -= Ax;
  Dy -= Ay;

  const distAB = Math.sqrt(Bx * Bx + By * By);

  const theCos = Bx / distAB;
  const theSin = By / distAB;
  newX = Cx * theCos + Cy * theSin;
  Cy = Cy * theCos - Cx * theSin;
  Cx = newX;
  newX = Dx * theCos + Dy * theSin;
  Dy = Dy * theCos - Dx * theSin;
  Dx = newX;

  if ((Cy < 0.0 && Dy < 0.0) || (Cy >= 0.0 && Dy >= 0.0)) {
    return false;
  }

  const ABpos = Dx + ((Cx - Dx) * Dy) / (Dy - Cy);

  if (ABpos < 0.0 || ABpos > distAB) {
    return false;
  }

  return true;
}

/**
 * Checks if a polygon defined by the coordinates has any crossing lines.
 *
 * @param {Position[]} coordinates - Array of coordinates defining the polygon.
 * @return {boolean} True if the polygon has crossing lines, false otherwise.
 */
export function hasPolygonCrossingLines(coordinates: Position[]): boolean {
  for (let i = 0; i < coordinates.length - 2; i++) {
    const point1 = coordinates[i];
    const point2 = coordinates[i + 1];
    for (let j = i + 1; j < coordinates.length - 1; j++) {
      const point3 = coordinates[j];
      const point4 = coordinates[j + 1];
      if (
        lineSegmentIntersection(
          point1[0],
          point1[1],
          point2[0],
          point2[1],
          point3[0],
          point3[1],
          point4[0],
          point4[1]
        )
      ) {
        return true;
      }
    }
  }
  return false;
}
