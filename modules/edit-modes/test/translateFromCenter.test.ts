import type { Feature as TurfFeature, Geometry } from '@turf/helpers';
// I used types from geojson because they're generic and helps me with intellisense
import type {
  Feature as GenericFeature,
  Point,
  MultiPoint,
  LineString,
  Polygon,
  MultiPolygon,
} from 'geojson';
import { translateFromCenter } from '../src/translateFromCenter';

type Feature = TurfFeature<Geometry>;

test('Point coordinates in right format', () => {
  const feature: GenericFeature<Point> = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [0, 0],
    },
    properties: {},
  };
  const result = translateFromCenter(feature as Feature, 100, 100) as GenericFeature<Point>;
  expect(result.geometry.coordinates).toHaveLength(2);
});

test('MultiPoint coordinates in right format', () => {
  const feature: GenericFeature<MultiPoint> = {
    type: 'Feature',
    geometry: {
      type: 'MultiPoint',
      coordinates: [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
    },
    properties: {},
  };
  const result = translateFromCenter(feature as Feature, 100, 100) as GenericFeature<MultiPoint>;
  expect(result.geometry.coordinates[0]).toHaveLength(2);
  expect(result.geometry.coordinates[1]).toHaveLength(2);
  expect(result.geometry.coordinates[2]).toHaveLength(2);
});

test('LineString coordinates in right format', () => {
  const feature: GenericFeature<LineString> = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [1, 1],
        [2, 2],
      ],
    },
    properties: {},
  };
  const result = translateFromCenter(feature as Feature, 100, 100) as GenericFeature<LineString>;
  expect(result.geometry.coordinates[0]).toHaveLength(2);
  expect(result.geometry.coordinates[1]).toHaveLength(2);
});

test('Polygon coordinates in right format', () => {
  const feature: GenericFeature<Polygon> = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [0, 0],
          [0, 1],
          [2, 2],
        ],
      ],
    },
    properties: {},
  };
  const result = translateFromCenter(feature as Feature, 100, 100) as GenericFeature<Polygon>;
  expect(result.geometry.coordinates[0][0]).toHaveLength(2);
  expect(result.geometry.coordinates[0][1]).toHaveLength(2);
  expect(result.geometry.coordinates[0][2]).toHaveLength(2);

  expect(result.geometry.coordinates[0][3]).toBeUndefined();
  expect(result.geometry.coordinates[1]).toBeUndefined();
});

test('Polygon coordinates in right format', () => {
  const feature: GenericFeature<MultiPolygon> = {
    type: 'Feature',
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [0, 0],
            [0, 1],
            [2, 2],
          ],
          [
            [3, 3],
            [5, 3],
            [5, 5],
          ],
        ],
      ],
    },
    properties: {},
  };
  const result = translateFromCenter(feature as Feature, 100, 100) as GenericFeature<MultiPolygon>;
  expect(result.geometry.coordinates[0][0][0]).toHaveLength(2);
  expect(result.geometry.coordinates[0][0][1]).toHaveLength(2);
  expect(result.geometry.coordinates[0][0][2]).toHaveLength(2);
  expect(result.geometry.coordinates[0][1][2]).toHaveLength(2);

  expect(result.geometry.coordinates[0][1][3]).toBeUndefined();
  expect(result.geometry.coordinates[0][2]).toBeUndefined();
});
