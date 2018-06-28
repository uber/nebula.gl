// @flow-ignore
import { polygon } from '@turf/helpers';

import Feature from '../../lib/feature';
import {
  expandMultiGeometry,
  GeoJsonGeometryTypes,
  immutablyReplaceCoordinate,
  flattenPositions
} from '../../lib/geojson';

it('test expandMultiGeometry()', () => {
  const data = [
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-122.44065057089426, 37.86997264051048],
            [-122.45034943869211, 37.85716578496087],
            [-122.42906342794993, 37.85059209014963],
            [-122.41327058127024, 37.852557483014245],
            [-122.41678963949778, 37.87010815089117],
            [-122.4302650575886, 37.87471535553951],
            [-122.44065057089426, 37.86997264051048]
          ],
          [
            [-122.43309691521875, 37.863841448225706],
            [-122.43262484643213, 37.85709893121648],
            [-122.42301180932276, 37.85791213180541],
            [-122.423955946896, 37.865366052490586],
            [-122.43309691521875, 37.863841448225706]
          ]
        ]
      },
      properties: {}
    },
    {
      type: 'Feature',
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [-122.4960994720459, 37.88474434096118],
              [-122.48335361480711, 37.88474434096118],
              [-122.48335361480711, 37.889689316564045],
              [-122.4960994720459, 37.889689316564045],
              [-122.4960994720459, 37.88474434096118]
            ]
          ],
          [
            [
              [-122.48936176300049, 37.88152654150914],
              [-122.48588562011717, 37.88152654150914],
              [-122.48588562011717, 37.88403305002908],
              [-122.48936176300049, 37.88403305002908],
              [-122.48936176300049, 37.88152654150914]
            ]
          ]
        ]
      },
      properties: {}
    },
    {
      type: 'Feature',
      geometry: {
        type: 'INVALID'
      },
      properties: {}
    }
  ];

  const { result, rejected } = expandMultiGeometry(
    data.map(d => new Feature(d, {})),
    GeoJsonGeometryTypes.Polygon,
    GeoJsonGeometryTypes.MultiPolygon,
    polygon
  );

  expect(result.length).toBe(3);
  expect(rejected.length).toBe(1);
});

describe('immutablyReplaceCoordinate()', () => {
  it('replaces single point geometry', () => {
    const coords = [1, 2];
    const updatedCoords = immutablyReplaceCoordinate(coords, [], [10, 20], false);
    expect(coords).toEqual([1, 2]);
    expect(updatedCoords).toEqual([10, 20]);
  });

  it('replaces first element of 1 level nesting', () => {
    const coords = [[1, 2]];
    const updatedCoords = immutablyReplaceCoordinate(coords, [0], [10, 20], false);
    expect(coords).toEqual([[1, 2]]);
    expect(updatedCoords).toEqual([[10, 20]]);
  });

  it('replaces last element of 1 level nesting', () => {
    const coords = [[1, 2], [3, 4]];
    const updatedCoords = immutablyReplaceCoordinate(coords, [1], [30, 40], false);
    expect(coords).toEqual([[1, 2], [3, 4]]);
    expect(updatedCoords).toEqual([[1, 2], [30, 40]]);
  });

  it('replaces last element of 2 level nesting', () => {
    const coords = [[[1, 2], [3, 4]], [[5, 6], [7, 8]]];
    const updatedCoords = immutablyReplaceCoordinate(coords, [1, 0], [50, 60], false);
    expect(coords).toEqual([[[1, 2], [3, 4]], [[5, 6], [7, 8]]]);
    expect(updatedCoords).toEqual([[[1, 2], [3, 4]], [[50, 60], [7, 8]]]);
  });

  it('replaces last coordinate when replacing first if polygonal', () => {
    const coords = [[1, 2], [3, 4], [1, 2]];
    const updatedCoords = immutablyReplaceCoordinate(coords, [0], [10, 20], true);
    expect(coords).toEqual([[1, 2], [3, 4], [1, 2]]);
    expect(updatedCoords).toEqual([[10, 20], [3, 4], [10, 20]]);
  });

  it('replaces first coordinate when replacing last if polygonal', () => {
    const coords = [[1, 2], [3, 4], [1, 2]];
    const updatedCoords = immutablyReplaceCoordinate(coords, [2], [10, 20], true);
    expect(coords).toEqual([[1, 2], [3, 4], [1, 2]]);
    expect(updatedCoords).toEqual([[10, 20], [3, 4], [10, 20]]);
  });
});

describe('flattenPositions()', () => {
  it('flattens Point', () => {
    const feature = { type: 'Point', coordinates: [1, 2] };
    const expected = [{ position: [1, 2], indexes: [] }];

    expect(flattenPositions(feature)).toEqual(expected);
  });

  it('flattens MultiPoint', () => {
    const feature = { type: 'MultiPoint', coordinates: [[1, 2], [3, 4]] };
    const expected = [{ position: [1, 2], indexes: [0] }, { position: [3, 4], indexes: [1] }];

    expect(flattenPositions(feature)).toEqual(expected);
  });

  it('flattens LineString', () => {
    const feature = { type: 'LineString', coordinates: [[1, 2], [3, 4]] };
    const expected = [{ position: [1, 2], indexes: [0] }, { position: [3, 4], indexes: [1] }];

    expect(flattenPositions(feature)).toEqual(expected);
  });

  it('flattens Polygon', () => {
    const feature = {
      type: 'Polygon',
      coordinates: [[[1, 2], [3, 4], [1, 2]], [[10, 11], [12, 13], [10, 11]]]
    };
    const expected = [
      { position: [1, 2], indexes: [0, 0] },
      { position: [3, 4], indexes: [0, 1] },
      { position: [1, 2], indexes: [0, 2] },
      { position: [10, 11], indexes: [1, 0] },
      { position: [12, 13], indexes: [1, 1] },
      { position: [10, 11], indexes: [1, 2] }
    ];

    expect(flattenPositions(feature)).toEqual(expected);
  });

  it('flattens MultiLineString', () => {
    const feature = {
      type: 'MultiLineString',
      coordinates: [[[1, 2], [3, 4]], [[10, 11], [12, 13], [14, 15]]]
    };
    const expected = [
      { position: [1, 2], indexes: [0, 0] },
      { position: [3, 4], indexes: [0, 1] },
      { position: [10, 11], indexes: [1, 0] },
      { position: [12, 13], indexes: [1, 1] },
      { position: [14, 15], indexes: [1, 2] }
    ];

    expect(flattenPositions(feature)).toEqual(expected);
  });

  it('flattens MultiPolygon', () => {
    const feature = {
      type: 'MultiPolygon',
      coordinates: [
        [[[1, 2], [3, 4], [1, 2]], [[10, 11], [12, 13], [10, 11]]],
        [[[20, 21], [22, 23], [20, 21]]]
      ]
    };
    const expected = [
      { position: [1, 2], indexes: [0, 0, 0] },
      { position: [3, 4], indexes: [0, 0, 1] },
      { position: [1, 2], indexes: [0, 0, 2] },
      { position: [10, 11], indexes: [0, 1, 0] },
      { position: [12, 13], indexes: [0, 1, 1] },
      { position: [10, 11], indexes: [0, 1, 2] },
      { position: [20, 21], indexes: [1, 0, 0] },
      { position: [22, 23], indexes: [1, 0, 1] },
      { position: [20, 21], indexes: [1, 0, 2] }
    ];

    expect(flattenPositions(feature)).toEqual(expected);
  });
});
