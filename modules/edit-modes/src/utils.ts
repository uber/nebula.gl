import destination from '@turf/destination';
import bearing from '@turf/bearing';
import pointToLineDistance from '@turf/point-to-line-distance';
import { point } from '@turf/helpers';
import WebMercatorViewport from 'viewport-mercator-project';
import { Viewport, Pick, EditHandleFeature, EditHandleType } from './types';
import {
  Geometry,
  Position,
  Point,
  LineString,
  FeatureOf,
  FeatureWithProps,
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
      //@ts-ignore
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
