// @flow
/* eslint-env jest */

import { ModeHandler } from '../../../src/mode-handlers/mode-handler.js';

let pointFeature;
let lineStringFeature;
let polygonFeature;
let multiPointFeature;
let multiLineStringFeature;
let multiPolygonFeature;
let featureCollection;

beforeEach(() => {
  pointFeature = {
    type: 'Feature',
    properties: {},
    geometry: { type: 'Point', coordinates: [1, 2] }
  };

  lineStringFeature = {
    type: 'Feature',
    properties: {},
    geometry: { type: 'LineString', coordinates: [[1, 2], [2, 3], [3, 4]] }
  };

  polygonFeature = {
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

  multiPointFeature = {
    type: 'Feature',
    properties: {},
    geometry: { type: 'MultiPoint', coordinates: [[1, 2], [3, 4]] }
  };

  multiLineStringFeature = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiLineString',
      coordinates: [[[1, 2], [2, 3], [3, 4]], [[5, 6], [6, 7], [7, 8]]]
    }
  };

  multiPolygonFeature = {
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

  featureCollection = {
    type: 'FeatureCollection',
    features: [
      pointFeature,
      lineStringFeature,
      polygonFeature,
      multiPointFeature,
      multiLineStringFeature,
      multiPolygonFeature
    ]
  };
});

describe('getFeatureCollection()', () => {
  it('can get real object', () => {
    const handler = new ModeHandler(featureCollection);

    expect(handler.getFeatureCollection()).toBe(featureCollection);
  });
});

describe('setFeatureCollection()', () => {
  it('immutably updates feature collection', () => {
    const featureCollection1 = {
      type: 'FeatureCollection',
      features: [pointFeature]
    };
    const featureCollection2 = {
      type: 'FeatureCollection',
      features: [multiPolygonFeature, lineStringFeature]
    };
    const handler = new ModeHandler(featureCollection1);

    handler.setFeatureCollection(featureCollection2);

    expect(handler.getFeatureCollection()).toEqual(featureCollection2);
  });
});

describe('setSelectedFeatureIndexes()', () => {
  it('should set selectedFeatureIndexes', () => {
    const handler = new ModeHandler(featureCollection);

    handler.setSelectedFeatureIndexes([1, 2]);

    expect(handler.getSelectedFeatureIndexes()).toEqual([1, 2]);
  });

  it('should do nothing if already set', () => {
    const handler = new ModeHandler(featureCollection);

    handler.setSelectedFeatureIndexes([1, 2]);
    handler.setSelectedFeatureIndexes([1, 2]);

    expect(handler.getSelectedFeatureIndexes()).toEqual([1, 2]);
  });
});

describe('handleClick', () => {
  it('tracks click sequence', () => {
    const handler = new ModeHandler(featureCollection);

    handler.handleClick({
      screenCoords: [-1, -1],
      groundCoords: [0, 1],
      picks: [],
      sourceEvent: null
    });
    handler.handleClick({
      screenCoords: [-1, -1],
      groundCoords: [2, 3],
      picks: [],
      sourceEvent: null
    });

    expect(handler.getClickSequence()).toEqual([[0, 1], [2, 3]]);
  });
});
