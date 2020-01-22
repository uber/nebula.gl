// @flow
/* eslint-env jest */

import turfArea from '@turf/area';
import type { Feature, FeatureCollection } from '@nebula.gl/edit-modes';
import { DrawRectangleMode } from '../../src/lib/draw-rectangle-mode.js';
import {
  createFeatureCollectionProps,
  createFeatureCollection,
  createClickEvent,
  createPointerMoveEvent,
  createStartDraggingEvent,
  createStopDraggingEvent
} from '../test-utils.js';
import type { GeoJsonEditAction } from '../../src/lib/geojson-edit-mode.js';

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

describe('dragToDraw=false', () => {
  it('sets tentative feature to a Polygon after first click', () => {
    const mode = new DrawRectangleMode();

    const props = createFeatureCollectionProps();
    props.lastPointerMoveEvent = createPointerMoveEvent([1, 2]);
    mode.handleClick(createClickEvent([1, 2]), props);
    props.lastPointerMoveEvent = createPointerMoveEvent([2, 3]);

    const tentativeFeature = mode.getTentativeGuide(props);

    if (!tentativeFeature) {
      throw new Error('Should have tentative feature');
    }

    expect(tentativeFeature.geometry).toEqual({
      type: 'Polygon',
      coordinates: [[[1, 2], [2, 2], [2, 3], [1, 3], [1, 2]]]
    });
  });

  it('adds a new feature after two clicks', () => {
    const mode = new DrawRectangleMode();

    const props = createFeatureCollectionProps();
    props.lastPointerMoveEvent = createPointerMoveEvent([1, 2]);
    mode.handleClick(createClickEvent([1, 2]), props);
    props.lastPointerMoveEvent = createPointerMoveEvent([2, 3]);
    mode.handleClick(createClickEvent([2, 3]), props);

    const expectedAction2: GeoJsonEditAction = {
      editType: 'addFeature',
      updatedData: {
        ...props.data,
        features: [
          ...props.data.features,
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
      editContext: {
        featureIndexes: [featureCollection.features.length]
      }
    };

    expect(props.onEdit).toHaveBeenCalledTimes(1);
    expect(props.onEdit.mock.calls[0][0]).toEqual(expectedAction2);
  });
});

describe('dragToDraw=true', () => {
  it('sets tentative feature to a Polygon after start dragging', () => {
    const mode = new DrawRectangleMode();

    const props = createFeatureCollectionProps({
      modeConfig: {
        dragToDraw: true
      }
    });
    props.lastPointerMoveEvent = createPointerMoveEvent([1, 2]);
    mode.handleStartDragging(createStartDraggingEvent([1, 2], [1, 2]), props);
    props.lastPointerMoveEvent = createPointerMoveEvent([2, 3]);

    const tentativeFeature = mode.getTentativeGuide(props);

    if (!tentativeFeature) {
      throw new Error('Should have tentative feature');
    }

    expect(tentativeFeature.geometry).toEqual({
      type: 'Polygon',
      coordinates: [[[1, 2], [2, 2], [2, 3], [1, 3], [1, 2]]]
    });
  });

  it('adds a new feature after stop dragging', () => {
    const mode = new DrawRectangleMode();

    const props = createFeatureCollectionProps({
      modeConfig: {
        dragToDraw: true
      }
    });
    props.lastPointerMoveEvent = createPointerMoveEvent([1, 2]);
    mode.handleStartDragging(createStartDraggingEvent([1, 2], [1, 2]), props);
    props.lastPointerMoveEvent = createPointerMoveEvent([2, 3]);
    mode.handleStopDragging(createStopDraggingEvent([2, 3], [2, 3]), props);

    const expectedAction2: GeoJsonEditAction = {
      editType: 'addFeature',
      updatedData: {
        ...props.data,
        features: [
          ...props.data.features,
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
      editContext: {
        featureIndexes: [featureCollection.features.length]
      }
    };

    expect(props.onEdit).toHaveBeenCalledTimes(1);
    expect(props.onEdit.mock.calls[0][0]).toEqual(expectedAction2);
  });
});

describe('modeConfig.booleanOperation', () => {
  describe('union', () => {
    test('unions shapes', () => {
      const mode = new DrawRectangleMode();

      const props = createFeatureCollectionProps({
        selectedIndexes: [polygonFeatureIndex],
        modeConfig: { booleanOperation: 'union' }
      });

      const areaBefore = turfArea(featureCollection.features[polygonFeatureIndex]);

      props.lastPointerMoveEvent = createPointerMoveEvent([0, 0]);
      mode.handleClick(createClickEvent([0, 0]), props);
      props.lastPointerMoveEvent = createPointerMoveEvent([2, 2]);
      mode.handleClick(createClickEvent([2, 2]), props);

      expect(props.onEdit).toHaveBeenCalledTimes(1);

      const action = props.onEdit.mock.calls[0][0];
      const areaAfter = turfArea(action.updatedData.features[polygonFeatureIndex]);

      expect(areaAfter).toBeGreaterThan(areaBefore);
    });
  });

  describe('difference', () => {
    test('subtracts geometry', () => {
      const mode = new DrawRectangleMode();

      const props = createFeatureCollectionProps({
        selectedIndexes: [polygonFeatureIndex],
        modeConfig: { booleanOperation: 'difference' }
      });

      const areaBefore = turfArea(featureCollection.features[polygonFeatureIndex]);

      props.lastPointerMoveEvent = createPointerMoveEvent([0, 0]);
      mode.handleClick(createClickEvent([0, 0]), props);
      props.lastPointerMoveEvent = createPointerMoveEvent([2, 2]);
      mode.handleClick(createClickEvent([2, 2]), props);

      expect(props.onEdit).toHaveBeenCalledTimes(1);

      const action = props.onEdit.mock.calls[0][0];
      const areaAfter = turfArea(action.updatedData.features[polygonFeatureIndex]);

      expect(areaAfter).toBeLessThan(areaBefore);
    });
  });

  describe('intersection', () => {
    test('subtracts geometry', () => {
      const mode = new DrawRectangleMode();

      const props = createFeatureCollectionProps({
        selectedIndexes: [polygonFeatureIndex],
        modeConfig: { booleanOperation: 'intersection' }
      });

      const areaBefore = turfArea(featureCollection.features[polygonFeatureIndex]);

      props.lastPointerMoveEvent = createPointerMoveEvent([0, 0]);
      mode.handleClick(createClickEvent([0, 0]), props);
      props.lastPointerMoveEvent = createPointerMoveEvent([2, 2]);
      mode.handleClick(createClickEvent([2, 2]), props);

      expect(props.onEdit).toHaveBeenCalledTimes(1);

      const action = props.onEdit.mock.calls[0][0];
      const areaAfter = turfArea(action.updatedData.features[polygonFeatureIndex]);

      expect(areaAfter).toBeLessThan(areaBefore);
    });
  });
});
