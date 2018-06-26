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
 * Updates a coordinate deeply nested in a GeoJSON geometry coordinates.
 * Works with MultiPoint, LineString, MultiLineString, Polygon, and MultiPolygon.
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
  if (!indexes || indexes.length === 0) {
    return coordinates;
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

export function flattenPositions(geometry) {
  let positions = [];
  if (geometry.type === 'Point') {
    // positions are not nested
    positions = [
      {
        position: geometry.coordinates,
        indexes: []
      }
    ];
  } else if (geometry.type === 'MultiPoint' || geometry.type === 'LineString') {
    // positions are nested 1 level
    positions = geometry.coordinates.map((position, index) => ({
      position,
      indexes: [index]
    }));
  } else if (geometry.type === 'Polygon' || geometry.type === 'MultiLineString') {
    // positions are nested 2 levels
    for (let a = 0; a < geometry.coordinates.length; a++) {
      positions = positions.concat(
        geometry.coordinates[a].map((position, index) => ({
          position,
          indexes: [a, index]
        }))
      );
    }
  } else if (geometry.type === 'MultiPolygon') {
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
  }

  return positions;
}

// TODO: move these to a test file
function assertEquals(expected, actual, message) {
  const expectedString = JSON.stringify(expected);
  const actualString = JSON.stringify(actual);
  if (expectedString !== actualString) {
    console.error(`TESTT: expected, actual`, expected, actual); // eslint-disable-line
  }
}

assertEquals(
  [{ position: [1, 2], indexes: [] }],
  flattenPositions({ type: 'Point', coordinates: [1, 2] })
);
assertEquals(
  [{ position: [1, 2], indexes: [0] }, { position: [3, 4], indexes: [1] }],
  flattenPositions({ type: 'MultiPoint', coordinates: [[1, 2], [3, 4]] })
);
assertEquals(
  [{ position: [1, 2], indexes: [0] }, { position: [3, 4], indexes: [1] }],
  flattenPositions({ type: 'LineString', coordinates: [[1, 2], [3, 4]] })
);
assertEquals(
  [
    { position: [1, 2], indexes: [0, 0] },
    { position: [3, 4], indexes: [0, 1] },
    { position: [1, 2], indexes: [0, 2] },
    { position: [10, 11], indexes: [1, 0] },
    { position: [12, 13], indexes: [1, 1] },
    { position: [10, 11], indexes: [1, 2] }
  ],
  flattenPositions({
    type: 'Polygon',
    coordinates: [[[1, 2], [3, 4], [1, 2]], [[10, 11], [12, 13], [10, 11]]]
  })
);
assertEquals(
  [
    { position: [1, 2], indexes: [0, 0] },
    { position: [3, 4], indexes: [0, 1] },
    { position: [10, 11], indexes: [1, 0] },
    { position: [12, 13], indexes: [1, 1] },
    { position: [14, 15], indexes: [1, 2] }
  ],
  flattenPositions({
    type: 'MultiLineString',
    coordinates: [[[1, 2], [3, 4]], [[10, 11], [12, 13], [14, 15]]]
  })
);
assertEquals(
  [
    { position: [1, 2], indexes: [0, 0, 0] },
    { position: [3, 4], indexes: [0, 0, 1] },
    { position: [1, 2], indexes: [0, 0, 2] },
    { position: [10, 11], indexes: [0, 1, 0] },
    { position: [12, 13], indexes: [0, 1, 1] },
    { position: [10, 11], indexes: [0, 1, 2] },
    { position: [20, 21], indexes: [1, 0, 0] },
    { position: [22, 23], indexes: [1, 0, 1] },
    { position: [20, 21], indexes: [1, 0, 2] }
  ],
  flattenPositions({
    type: 'MultiPolygon',
    coordinates: [
      [[[1, 2], [3, 4], [1, 2]], [[10, 11], [12, 13], [10, 11]]],
      [[[20, 21], [22, 23], [20, 21]]]
    ]
  })
);
