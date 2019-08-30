// @flow
/* eslint-env jest */

import turfArea from '@turf/area';
import type { Feature, FeatureCollection } from '@nebula.gl/edit-modes';
import { DrawRectangleHandler } from '../../../src/mode-handlers/draw-rectangle-handler.js';
import {
  createFeatureCollection,
  createClickEvent,
  createPointerMoveEvent
} from '../test-utils.js';
import type { EditAction } from '../../../src/mode-handlers/mode-handler.js';

let featureCollection: FeatureCollection;
let polygonFeature: Feature;
let polygonFeatureIndex: number;

let warnBefore;
beforeEach(() => {
  warnBefore = console.warn; // eslint-disable-line
  // $FlowFixMe
  console.warn = function() {}; // eslint-disable-line

  featureCollection = createFeatureCollection();

  const makeFlowHappy = featureCollection.features.find(f => f.geometry.type === 'Polygon');
  if (!makeFlowHappy) {
    throw new Error(`Need a Polygon in my setup`);
  }
  polygonFeature = makeFlowHappy;
  polygonFeatureIndex = featureCollection.features.indexOf(polygonFeature);
});

afterEach(() => {
  // $FlowFixMe
  console.warn = warnBefore; // eslint-disable-line
});

test('sets tentative feature to a Polygon after first click', () => {
  const handler = new DrawRectangleHandler(featureCollection);

  handler.handlePointerMove(createPointerMoveEvent([1, 2]));
  handler.handleClick(createClickEvent([1, 2]));
  handler.handlePointerMove(createPointerMoveEvent([2, 3]));

  const tentativeFeature = handler.getTentativeFeature();

  if (!tentativeFeature) {
    throw new Error('Should have tentative feature');
  }

  expect(tentativeFeature.geometry).toEqual({
    type: 'Polygon',
    coordinates: [[[1, 2], [2, 2], [2, 3], [1, 3], [1, 2]]]
  });
});

test('adds a new feature after two clicks', () => {
  const handler = new DrawRectangleHandler(featureCollection);

  handler.handlePointerMove(createPointerMoveEvent([1, 2]));
  const action1 = handler.handleClick(createClickEvent([1, 2]));
  handler.handlePointerMove(createPointerMoveEvent([2, 3]));
  const action2 = handler.handleClick(createClickEvent([2, 3]));

  const expectedAction2: EditAction = {
    editType: 'addFeature',
    updatedData: {
      ...featureCollection,
      features: [
        ...featureCollection.features,
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [[[1, 2], [2, 2], [2, 3], [1, 3], [1, 2]]]
          }
        }
      ]
    },
    featureIndexes: [featureCollection.features.length],
    editContext: {
      featureIndexes: [featureCollection.features.length]
    }
  };

  expect(action1).toBeNull();
  expect(action2).toEqual(expectedAction2);
});

describe('modeConfig.booleanOperation', () => {
  describe('union', () => {
    test('unions shapes', () => {
      const handler = new DrawRectangleHandler(featureCollection);
      handler.setSelectedFeatureIndexes([polygonFeatureIndex]);
      handler.setModeConfig({ booleanOperation: 'union' });

      const areaBefore = turfArea(featureCollection.features[polygonFeatureIndex]);

      handler.handlePointerMove(createPointerMoveEvent([0, 0]));
      handler.handleClick(createClickEvent([0, 0]));
      handler.handlePointerMove(createPointerMoveEvent([2, 2]));
      const action = handler.handleClick(createClickEvent([2, 2]));

      if (!action) {
        throw new Error('Should return action');
      }

      const areaAfter = turfArea(action.updatedData.features[polygonFeatureIndex]);

      expect(areaAfter).toBeGreaterThan(areaBefore);
    });
  });

  describe('difference', () => {
    test('subtracts geometry', () => {
      const handler = new DrawRectangleHandler(featureCollection);
      handler.setSelectedFeatureIndexes([polygonFeatureIndex]);
      handler.setModeConfig({ booleanOperation: 'difference' });

      const areaBefore = turfArea(featureCollection.features[polygonFeatureIndex]);

      handler.handlePointerMove(createPointerMoveEvent([0, 0]));
      handler.handleClick(createClickEvent([0, 0]));
      handler.handlePointerMove(createPointerMoveEvent([2, 2]));
      const action = handler.handleClick(createClickEvent([2, 2]));

      if (!action) {
        throw new Error('Should return action');
      }

      const areaAfter = turfArea(action.updatedData.features[polygonFeatureIndex]);

      expect(areaAfter).toBeLessThan(areaBefore);
    });
  });

  describe('intersection', () => {
    test('subtracts geometry', () => {
      const handler = new DrawRectangleHandler(featureCollection);
      handler.setSelectedFeatureIndexes([polygonFeatureIndex]);
      handler.setModeConfig({ booleanOperation: 'intersection' });

      const areaBefore = turfArea(featureCollection.features[polygonFeatureIndex]);

      handler.handlePointerMove(createPointerMoveEvent([0, 0]));
      handler.handleClick(createClickEvent([0, 0]));
      handler.handlePointerMove(createPointerMoveEvent([2, 2]));
      const action = handler.handleClick(createClickEvent([2, 2]));

      if (!action) {
        throw new Error('Should return action');
      }

      const areaAfter = turfArea(action.updatedData.features[polygonFeatureIndex]);

      expect(areaAfter).toBeLessThan(areaBefore);
    });
  });
});
