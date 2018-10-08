// @flow
/* eslint-env jest */
/* eslint-disable max-nested-callbacks */

import type { Position, Feature, FeatureCollection } from '../../../geojson-types.js';
import type { ClickEvent, PointerMoveEvent } from '../../../lib/event-types.js';
import { DrawLineStringHandler } from '../../../lib/mode-handlers/draw-line-string-handler.js';
import { createFeatureCollection } from '../test-utils.js';

function createClickEvent(groundCoords: Position): ClickEvent {
  return {
    screenCoords: [-1, -1],
    groundCoords,
    picks: []
  };
}

function createPointerMoveEvent(groundCoords: Position): PointerMoveEvent {
  return {
    screenCoords: [-1, -1],
    groundCoords,
    picks: [],
    isDragging: false,
    pointerDownPicks: null,
    pointerDownScreenCoords: null,
    pointerDownGroundCoords: null,
    sourceEvent: null
  };
}

let featureCollection: FeatureCollection;
let lineStringFeature: Feature;
let lineStringFeatureIndex: number;

let warnBefore;
beforeEach(() => {
  warnBefore = console.warn; // eslint-disable-line
  // $FlowFixMe
  console.warn = function() {}; // eslint-disable-line

  featureCollection = createFeatureCollection();

  const makeFlowHappy = featureCollection.features.find(f => f.geometry.type === 'LineString');
  if (!makeFlowHappy) {
    throw new Error(`Need a LineString in my setup`);
  }
  lineStringFeature = makeFlowHappy;
  lineStringFeatureIndex = featureCollection.features.indexOf(lineStringFeature);
});

afterEach(() => {
  // $FlowFixMe
  console.warn = warnBefore; // eslint-disable-line
});

describe('when no selection', () => {
  test('sets tentative feature to a LineString after first click', () => {
    const handler = new DrawLineStringHandler(featureCollection);

    handler.handlePointerMove(createPointerMoveEvent([1, 2]));
    handler.handleClick(createClickEvent([1, 2]));
    handler.handlePointerMove(createPointerMoveEvent([2, 3]));

    const tentativeFeature = handler.getTentativeFeature();

    expect(tentativeFeature).toEqual({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [[1, 2], [2, 3]]
      }
    });
  });

  test('adds a new feature after two clicks', () => {
    const handler = new DrawLineStringHandler(featureCollection);

    handler.handlePointerMove(createPointerMoveEvent([1, 2]));
    const action1 = handler.handleClick(createClickEvent([1, 2]));
    handler.handlePointerMove(createPointerMoveEvent([2, 3]));
    const action2 = handler.handleClick(createClickEvent([2, 3]));

    expect(action1).toBeNull();
    expect(action2).toEqual({
      editType: 'addFeature',
      updatedData: {
        ...featureCollection,
        features: [
          ...featureCollection.features,
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [[1, 2], [2, 3]]
            }
          }
        ]
      },
      featureIndex: featureCollection.features.length,
      position: null,
      positionIndexes: null
    });
  });
});

describe('when single LineString selected', () => {
  test('extends LineString on click', () => {
    const handler = new DrawLineStringHandler(featureCollection);
    handler.setSelectedFeatureIndexes([lineStringFeatureIndex]);

    handler.handlePointerMove(createPointerMoveEvent([7, 8]));
    const action = handler.handleClick(createClickEvent([7, 8]));

    if (!action) {
      throw new Error('action should be defined');
    }
    expect(action.editType).toEqual('addPosition');
    expect(action.featureIndex).toEqual(lineStringFeatureIndex);
    expect(action.position).toEqual([7, 8]);
    expect(action.positionIndexes).toEqual([lineStringFeature.geometry.coordinates.length]);
    expect(action.updatedData.features[lineStringFeatureIndex]).toEqual({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [...lineStringFeature.geometry.coordinates, [7, 8]]
      }
    });
  });
});

describe('when multiple selection', () => {
  test('does nothing', () => {
    const handler = new DrawLineStringHandler(featureCollection);

    handler.setSelectedFeatureIndexes([1, 2]);

    handler.handlePointerMove(createPointerMoveEvent([7, 8]));
    const action = handler.handleClick(createClickEvent([7, 8]));

    expect(action).toBeNull();
  });
});

describe('when non-LineString selected', () => {
  test('does nothing', () => {
    const handler = new DrawLineStringHandler(featureCollection);

    const featureIndex = featureCollection.features.findIndex(
      f => f.geometry.type !== 'LineString'
    );
    handler.setSelectedFeatureIndexes([featureIndex]);

    handler.handlePointerMove(createPointerMoveEvent([7, 8]));
    const action = handler.handleClick(createClickEvent([7, 8]));

    expect(action).toBeNull();
  });
});
