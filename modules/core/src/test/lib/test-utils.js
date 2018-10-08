// @flow
/* eslint-env jest */

export function createPointFeature() {
  return {
    type: 'Feature',
    properties: {},
    geometry: { type: 'Point', coordinates: [1, 2] }
  };
}

export function createLineStringFeature() {
  return {
    type: 'Feature',
    properties: {},
    geometry: { type: 'LineString', coordinates: [[1, 2], [2, 3], [3, 4]] }
  };
}

export function createPolygonFeature() {
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [
        // exterior ring
        [[-1, -1], [1, -1], [1, 1], [-1, 1], [-1, -1]],
        // hole
        [[-0.5, -0.5], [-0.5, 0.5], [0.5, 0.5], [0.5, -0.5], [-0.5, -0.5]]
      ]
    }
  };
}

export function createMultiPointFeature() {
  return {
    type: 'Feature',
    properties: {},
    geometry: { type: 'MultiPoint', coordinates: [[1, 2], [3, 4]] }
  };
}

export function createMultiLineStringFeature() {
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiLineString',
      coordinates: [[[1, 2], [2, 3], [3, 4]], [[5, 6], [6, 7], [7, 8]]]
    }
  };
}

export function createMultiPolygonFeature() {
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        [
          // exterior ring polygon 1
          [[-1, -1], [1, -1], [1, 1], [-1, 1], [-1, -1]],
          // hole  polygon 1
          [[-0.5, -0.5], [-0.5, 0.5], [0.5, 0.5], [0.5, -0.5], [-0.5, -0.5]]
        ],
        [
          // exterior ring polygon 2
          [[2, -1], [4, -1], [4, 1], [2, 1], [2, -1]]
        ]
      ]
    }
  };
}

export function createFeatureCollection() {
  return {
    type: 'FeatureCollection',
    features: [
      createPointFeature(),
      createLineStringFeature(),
      createPolygonFeature(),
      createMultiPointFeature(),
      createMultiLineStringFeature(),
      createMultiPolygonFeature()
    ]
  };
}

// Tooling requires at least one test in files under the test folder
test('dummy test', () => {});
