// @flow
import { TranslateHandler } from '../../../src/mode-handlers/translate-handler';
import type { FeatureCollection } from '../../../src/geojson-types.js';
import {
  createFeatureCollection,
  createPointerMoveEvent,
  featuresForSnappingTests,
  mockPickedHandle,
  mockNonPickedHandle
} from '../test-utils.js';

import {
  testModeHandlerHandlePointMove,
  testHandleStartDragging,
  testHandleStopDragging
} from './mode-handler-utils';

const modeName = 'translate';
const featureCollection: FeatureCollection = createFeatureCollection({
  mockGeoJsonProperties: true
});

const mockUpdatedFeature = {
  coordinates: [[[-122, 37], [-122.44252582524939, 37.987923255302974]]]
};

function mockFeatureCollectionState(features: any) {
  const handler = new TranslateHandler(features);
  handler.setSelectedFeatureIndexes([1]);
  return handler;
}

testModeHandlerHandlePointMove(modeName, TranslateHandler, featureCollection, '_isTranslatable');

testHandleStartDragging(
  modeName,
  TranslateHandler,
  featureCollection,
  '_isTranslatable',
  '_geometryBeforeTranslate'
);

testHandleStopDragging(modeName, TranslateHandler, featureCollection);

describe('translate-handler specific functions', () => {
  let handler;

  beforeEach(() => {
    handler = mockFeatureCollectionState(featuresForSnappingTests);
    handler._context = {
      layerManager: {
        pickObject: () => [{ object: mockNonPickedHandle }]
      }
    };
  });

  test('_getEditHandlePicks() - positive case', () => {
    handler.setModeConfig({ snapPixels: 5 });
    const picks = handler._getEditHandlePicks({
      screenCoords: [1, 1],
      pointerDownPicks: [{ isEditingHandle: true, object: mockPickedHandle }]
    });
    expect(picks.pickedHandle).toBeDefined();
    if (picks.pickedHandle) {
      expect(picks.pickedHandle.type).toEqual('snap');
    }
    expect(picks.potentialSnapHandle).toBeDefined();
    if (picks.potentialSnapHandle) {
      expect(picks.potentialSnapHandle.type).toEqual('intermediate');
    }
    expect(picks).toMatchSnapshot();
  });

  test('_getEditHandlePicks() - no pickedHandle', () => {
    handler.setModeConfig({ snapPixels: 5 });
    const picks = handler._getEditHandlePicks({ screenCoords: [1, 1] });
    expect(picks.pickedHandle).not.toBeDefined();
    expect(picks.potentialSnapHandle).toBeDefined();
    if (picks.potentialSnapHandle) {
      expect(picks.potentialSnapHandle.type).toEqual('intermediate');
    }
    expect(picks).toMatchSnapshot();
  });

  test('_updatePickedHandlePosition() - positive case', () => {
    handler._pickedHandle = {
      featureIndex: 0,
      position: [100, 100],
      positionIndexes: [0, 0],
      type: 'snap'
    };

    const initialPickedHandle = { ...handler._pickedHandle };

    handler._updatePickedHandlePosition(0, mockUpdatedFeature);
    expect(handler._pickedHandle).not.toEqual(initialPickedHandle);
    expect(handler._pickedHandle).toMatchSnapshot();
  });

  test('_updatePickedHandlePosition() - no _pickedHandle case', () => {
    handler._updatePickedHandlePosition(0, mockUpdatedFeature);
    expect(handler._pickedHandle).toBeFalsy();
  });

  test('_updatePickedHandlePosition() - featureIndex not equal to index', () => {
    handler._pickedHandle = {
      featureIndex: 0,
      position: [100, 100],
      positionIndexes: [0, 0],
      type: 'snap'
    };
    const initialPickedHandle = { ...handler._pickedHandle };

    handler._updatePickedHandlePosition(10, mockUpdatedFeature);
    expect(handler._pickedHandle).toEqual(initialPickedHandle);
  });

  test('_getNonPickedIntermediateHandles()', () => {
    const intermediateHandles = handler._getNonPickedIntermediateHandles();
    const areAllHandleTypesIntermediate = intermediateHandles.every(
      ({ type }) => type === 'intermediate'
    );
    expect(areAllHandleTypesIntermediate).toBeTruthy();
    expect(intermediateHandles).toMatchSnapshot();
  });

  test('getEditHandles()', () => {
    handler.setModeConfig({ enableSnapping: true });
    handler._pickedHandle = mockPickedHandle;

    const allHandles = handler.getEditHandles();
    expect(allHandles.length).toEqual(14);
    expect(allHandles).toMatchSnapshot();

    const snapHandles = allHandles.filter(({ type }) => type === 'snap');
    expect(snapHandles.length).toEqual(1);
    expect(snapHandles).toMatchSnapshot();

    const intermediateHandles = allHandles.filter(({ type }) => type === 'intermediate');
    expect(intermediateHandles.length).toEqual(13);
    expect(intermediateHandles).toMatchSnapshot();
  });

  test('getEditHandles() - no _pickedHandle', () => {
    handler.setModeConfig({ enableSnapping: true });
    const allHandles = handler.getEditHandles();
    expect(allHandles.length > 0).toBeTruthy();
    expect(allHandles).toMatchSnapshot();
  });

  test('getEditHandles() - enableSnapping not defined', () => {
    handler._pickedHandle = mockPickedHandle;

    const allHandles = handler.getEditHandles();
    expect(allHandles.length).toEqual(0);
  });

  test('_calculateDistanceAndDirection()', () => {
    const distanceAndDirection = handler._calculateDistanceAndDirection([1, 1], [100, 100]);
    expect(distanceAndDirection).toMatchSnapshot();
  });

  test('_shouldPerformSnap() - positive case', () => {
    const shouldPerformSnap = handler._shouldPerformSnap({
      pickedHandle: mockPickedHandle,
      potentialSnapHandle: mockNonPickedHandle
    });
    expect(shouldPerformSnap).toBeTruthy();
  });

  test('_shouldPerformSnap() - no potentialSnapHandle', () => {
    const shouldPerformSnap = handler._shouldPerformSnap({ pickedHandle: mockPickedHandle });
    expect(shouldPerformSnap).toBeFalsy();
  });

  test('_shouldPerformSnap() - no pickedHandles', () => {
    const shouldPerformSnap = handler._shouldPerformSnap();
    expect(shouldPerformSnap).toBeFalsy();
  });

  test('_performSnapIfRequired() - positive case', () => {
    expect(handler._isSnapped).toBeFalsy();
    handler.setSelectedFeatureIndexes([0]);
    handler._updatedData = handler.getImmutableFeatureCollection();
    handler._pickedHandle = mockPickedHandle;
    const initPickedHandle = { ...handler._pickedHandle };
    const initFeatures = { ...handler._updatedData };
    handler._performSnapIfRequired({
      pickedHandle: mockPickedHandle,
      potentialSnapHandle: mockNonPickedHandle
    });
    expect(initPickedHandle).not.toEqual(handler._pickedHandle);
    expect(handler._updatedData).not.toEqual(initFeatures);
    expect(handler._isSnapped).toBeTruthy();
    expect(handler).toMatchSnapshot();
  });

  test('_performSnapIfRequired() - already snapped', () => {
    handler._isSnapped = true;
    handler.setSelectedFeatureIndexes([0]);
    handler._updatedData = handler.getImmutableFeatureCollection();
    const initFeatures = { ...handler._updatedData };
    handler._performSnapIfRequired({
      pickedHandle: mockPickedHandle,
      potentialSnapHandle: mockNonPickedHandle
    });
    expect(handler._updatedData).toEqual(initFeatures);
    expect(handler._isSnapped).toBeTruthy();
  });

  test('_performSnapIfRequired() - no pickedHandles', () => {
    handler._isSnapped = true;
    handler.setSelectedFeatureIndexes([0]);
    handler._updatedData = handler.getImmutableFeatureCollection();
    const initFeatures = { ...handler._updatedData };
    handler._performSnapIfRequired();
    expect(handler._updatedData).toEqual(initFeatures);
    expect(handler._isSnapped).toBeTruthy();
  });

  test('_performSnapIfRequired() - no potentialSnapHandle', () => {
    handler._isSnapped = true;
    handler.setSelectedFeatureIndexes([0]);
    handler._updatedData = handler.getImmutableFeatureCollection();
    const initFeatures = { ...handler._updatedData };
    handler._performSnapIfRequired({ pickedHandle: mockPickedHandle });
    expect(handler._updatedData).toEqual(initFeatures);
    expect(handler._isSnapped).toBeTruthy();
  });

  test('_performUnsnapIfRequired() - positive case', () => {
    handler._isSnapped = true;
    handler._performUnsnapIfRequired({ pickedHandle: mockPickedHandle });
    expect(handler._isSnapped).toBeFalsy();
  });

  test('_performUnsnapIfRequired() - selected hasnt already been snapped', () => {
    handler._performUnsnapIfRequired({
      pickedHandle: mockPickedHandle,
      potentialSnapHandle: mockNonPickedHandle
    });
    expect(handler._isSnapped).toBeFalsy();
  });

  test('_performUnsnapIfRequired() - potentialSnapHandle is present', () => {
    handler._isSnapped = true;
    handler._performUnsnapIfRequired({
      pickedHandle: mockPickedHandle,
      potentialSnapHandle: mockNonPickedHandle
    });
    expect(handler._isSnapped).toBeTruthy();
  });

  test('_performTranslateIfRequired() - positive case', () => {
    handler.setSelectedFeatureIndexes([0]);
    handler._updatedData = handler.getImmutableFeatureCollection();
    const initFeatures = { ...handler._updatedData };

    handler._geometryBeforeTranslate = handler.getSelectedFeaturesAsFeatureCollection();
    handler._performTranslateIfRequired([1, 1], [2, 2]);
    expect(handler._updatedData).not.toEqual(initFeatures);
    expect(handler).toMatchSnapshot();
  });

  test('_performTranslateIfRequired() - is already snapped', () => {
    handler._isSnapped = true;
    handler.setSelectedFeatureIndexes([0]);
    handler._updatedData = handler.getImmutableFeatureCollection();
    const initFeatures = { ...handler._updatedData };

    handler._geometryBeforeTranslate = handler.getSelectedFeaturesAsFeatureCollection();
    handler._performTranslateIfRequired([1, 1], [2, 2]);
    expect(handler._updatedData).toEqual(initFeatures);
  });

  test(`handlePointerMove() - positive case`, () => {
    handler._geometryBeforeTranslate = handler.getSelectedFeaturesAsFeatureCollection();
    const moveEvent = createPointerMoveEvent([1, 1], [{ index: 0 }]);
    moveEvent.isDragging = true;
    moveEvent.pointerDownGroundCoords = [10, 10];
    // $FlowFixMe
    handler._getTranslateAction = jest.fn(() => ({ test: 'test' }));

    const result = handler.handlePointerMove(moveEvent);
    const expectedResult = {
      editAction: { test: 'test' },
      cancelMapPan: true
    };

    expect(handler._getTranslateAction.mock.calls.length).toEqual(1);
    expect(result).toEqual(expectedResult);
  });

  test('getCursor() - _isTranslatable is true', () => {
    handler._isTranslatable = true;
    const getCursorReturn = handler.getCursor({ isDragging: false });
    expect(getCursorReturn).toEqual('move');
  });

  test('getCursor() - _isTranslatable is false and isDragging is true', () => {
    handler._isTranslatable = false;
    const getCursorReturn = handler.getCursor({ isDragging: true });
    expect(getCursorReturn).toEqual('grabbing');
  });

  test('getCursor() - _isTranslatable is false and isDragging is false', () => {
    handler._isTranslatable = false;
    const getCursorReturn = handler.getCursor({ isDragging: false });
    expect(getCursorReturn).toEqual('grab');
  });

  test('_getTranslateAction() - positive case', () => {
    handler.setSelectedFeatureIndexes([0]);
    handler.setModeConfig({ enableSnapping: true, snapPixels: 5 });
    handler._updatedData = handler.getImmutableFeatureCollection();
    const initFeatures = { ...handler._updatedData };
    handler._geometryBeforeTranslate = handler.getSelectedFeaturesAsFeatureCollection();

    const translateAction = handler._getTranslateAction([1, 1], [100, 100], 'test-edit', {
      pickedHandle: mockPickedHandle,
      potentialSnapHandle: mockNonPickedHandle
    });
    expect(handler._updatedData).not.toEqual(initFeatures);
    expect(handler._isSnapped).toBeTruthy();
    expect(handler).toMatchSnapshot();
    expect(translateAction).toMatchSnapshot();
  });

  test('_getTranslateAction() - no pickedHandles', () => {
    handler.setSelectedFeatureIndexes([0]);
    handler.setModeConfig({ enableSnapping: true, snapPixels: 5 });
    handler._updatedData = handler.getImmutableFeatureCollection();
    const initFeatures = { ...handler._updatedData };
    handler._geometryBeforeTranslate = handler.getSelectedFeaturesAsFeatureCollection();

    const translateAction = handler._getTranslateAction([1, 1], [100, 100], 'test-edit');
    expect(handler._updatedData).not.toEqual(initFeatures);
    expect(handler._isSnapped).toBeFalsy();
    expect(handler).toMatchSnapshot();
    expect(translateAction).toMatchSnapshot();
  });

  test('_getTranslateAction() - no _geometryBeforeTranslate', () => {
    handler.setSelectedFeatureIndexes([0]);
    handler._updatedData = handler.getImmutableFeatureCollection();
    const initFeatures = { ...handler._updatedData };

    const translateAction = handler._getTranslateAction([1, 1], [100, 100], 'test-edit');
    expect(handler._updatedData).toEqual(initFeatures);
    expect(handler).toMatchSnapshot();
    expect(translateAction).toBeNull();
  });
});
