// @flow
/* eslint-env jest */

import { ModeHandler } from '../../../src/mode-handlers/mode-handler.js';
import {
  createPointFeature,
  createLineStringFeature,
  createPolygonFeature,
  createMultiPointFeature,
  createMultiLineStringFeature,
  createMultiPolygonFeature
} from '../test-utils.js';

let pointFeature;
let lineStringFeature;
let polygonFeature;
let multiPointFeature;
let multiLineStringFeature;
let multiPolygonFeature;
let featureCollection;

export function mockFeatureCollectionState(polygon: any) {
  const handler = new ModeHandler(polygon);
  handler.setSelectedFeatureIndexes([1]);
  return handler;
}

beforeEach(() => {
  pointFeature = createPointFeature();
  lineStringFeature = createLineStringFeature();
  polygonFeature = createPolygonFeature();
  multiPointFeature = createMultiPointFeature();
  multiLineStringFeature = createMultiLineStringFeature();
  multiPolygonFeature = createMultiPolygonFeature();

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
