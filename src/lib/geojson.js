// @flow
import keymirror from 'keymirror';

import Feature from './feature';

export const GeoJsonGeometryTypes = keymirror({
  Point: null,
  LineString: null,
  Polygon: null,
  MultiPoint: null,
  MultiLineString: null,
  MultiPolygon: null
});

export function expandMultiGeometry(
  data: Feature[],
  singleType: string,
  multiType: string,
  createMulti: Function
): { result: Feature[], rejected: Feature[] } {
  const result = [];
  const rejected = [];

  data.forEach(nf => {
    if (nf.geoJson.geometry.type === singleType) {
      result.push(nf);
    } else if (nf.geoJson.geometry.type === multiType) {
      nf.geoJson.geometry.coordinates.forEach((coord, index) => {
        result.push(new Feature(createMulti(coord), nf.style, nf.original, { index }));
      });
    } else {
      rejected.push(nf);
    }
  });

  return { result, rejected };
}

/**
 * Updates a coordinate deeply nested in a GeoJSON geometry coordinates array.
 * Works with Point, MultiPoint, LineString, MultiLineString, Polygon, and MultiPolygon.
 *
 * @param coordinates A GeoJSON geometry coordinates array
 * @param indexes An array containing the indexes of the coordinates to replace
 * @param updatedCoordinate The updated coordinate to place in the result (i.e. [lng, lat])
 * @param isPolygonal `true` if `coordinates` is a Polygon or MultiPolygon
 *
 * @returns A new array with the coordinates at the given index replaced. Does not modify `coordinates`.
 */
export function immutablyReplaceCoordinate(
  coordinates: Array<mixed>,
  indexes: Array<number>,
  updatedCoordinate: Array<number>,
  isPolygonal: boolean = false
): Array<mixed> {
  if (!indexes) {
    return coordinates;
  }
  if (indexes.length === 0) {
    return updatedCoordinate;
  }
  if (indexes.length === 1) {
    const updated = [
      ...coordinates.slice(0, indexes[0]),
      updatedCoordinate,
      ...coordinates.slice(indexes[0] + 1)
    ];

    if (isPolygonal && (indexes[0] === 0 || indexes[0] === coordinates.length - 1)) {
      // for polygons, the first point is repeated at the end of the array
      // so, update it on both ends of the array
      updated[0] = updatedCoordinate;
      updated[coordinates.length - 1] = updatedCoordinate;
    }
    return updated;
  }

  // recursively update inner array
  return [
    ...coordinates.slice(0, indexes[0]),
    immutablyReplaceCoordinate(
      coordinates[indexes[0]],
      indexes.slice(1, indexes.length),
      updatedCoordinate,
      isPolygonal
    ),
    ...coordinates.slice(indexes[0] + 1)
  ];
}

// TODO: add tests for immutablyRemoveCoordinate
/**
 * Removes a coordinate deeply nested in a GeoJSON geometry coordinates array.
 * Works with MultiPoint, LineString, MultiLineString, Polygon, and MultiPolygon.
 *
 * @param coordinates A GeoJSON geometry coordinates array
 * @param indexes An array containing the indexes of the coordinates to remove
 * @param isPolygonal `true` if `coordinates` is a Polygon or MultiPolygon
 *
 * @returns A new array with the coordinates at the given index removed. Does not modify `coordinates`.
 */
export function immutablyRemoveCoordinate(
  coordinates: Array<mixed>,
  indexes: Array<number>,
  isPolygonal: boolean = false
): Array<mixed> {
  if (!indexes) {
    return coordinates;
  }
  if (indexes.length === 0) {
    throw Error('Must specify the index of the coordinate to remove');
  }
  if (indexes.length === 1) {
    if (isPolygonal && coordinates.length < 5) {
      throw Error('Cannot remove a coordinate from a triangle as it will no longer be a polygon');
    }
    const updated = [...coordinates.slice(0, indexes[0]), ...coordinates.slice(indexes[0] + 1)];

    if (isPolygonal && (indexes[0] === 0 || indexes[0] === coordinates.length - 1)) {
      // for polygons, the first point is repeated at the end of the array
      // so, if the first/last coordinate is to be removed, coordinates[1] will be the new first/last coordinate
      if (indexes[0] === 0) {
        // change the last to be the same as the first
        updated[updated.length - 1] = updated[0];
      } else if (indexes[0] === coordinates.length - 1) {
        // change the first to be the same as the last
        updated[0] = updated[updated.length - 1];
      }
    }
    return updated;
  }

  // recursively update inner array
  return [
    ...coordinates.slice(0, indexes[0]),
    immutablyRemoveCoordinate(
      coordinates[indexes[0]],
      indexes.slice(1, indexes.length),
      isPolygonal
    ),
    ...coordinates.slice(indexes[0] + 1)
  ];
}

export function flattenPositions(geometry) {
  let positions = [];
  switch (geometry.type) {
    case 'Point':
      // positions are not nested
      positions = [
        {
          position: geometry.coordinates,
          indexes: []
        }
      ];
      break;
    case 'MultiPoint':
    case 'LineString':
      // positions are nested 1 level
      positions = geometry.coordinates.map((position, index) => ({
        position,
        indexes: [index]
      }));
      break;
    case 'Polygon':
    case 'MultiLineString':
      // positions are nested 2 levels
      for (let a = 0; a < geometry.coordinates.length; a++) {
        positions = positions.concat(
          geometry.coordinates[a].map((position, index) => ({
            position,
            indexes: [a, index]
          }))
        );
      }
      break;
    case 'MultiPolygon':
      // positions are nested 3 levels
      for (let a = 0; a < geometry.coordinates.length; a++) {
        for (let b = 0; b < geometry.coordinates[a].length; b++) {
          positions = positions.concat(
            geometry.coordinates[a][b].map((position, index) => ({
              position,
              indexes: [a, b, index]
            }))
          );
        }
      }
      break;
    default:
      throw Error(`Unhandled geometry type: ${geometry.type}`);
  }

  return positions;
}
