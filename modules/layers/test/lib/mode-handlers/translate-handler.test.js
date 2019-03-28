// @flow
import { TranslateHandler } from '../../../src/mode-handlers/translate-handler';
import type { FeatureCollection } from '../../../src/geojson-types.js';
import {
  createFeatureCollection,
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

  test('calculateDistanceAndDirection()', () => {
    const distanceAndDirection = handler.calculateDistanceAndDirection([1, 1], [100, 100]);
    expect(distanceAndDirection).toMatchSnapshot();
  });

  test('performSnap()', () => {
    handler.setModeConfig({ enablePolygonSnapping: true });
    handler.setSelectedFeatureIndexes([0]);
    handler._pickedHandle = mockPickedHandle;
    handler._potentialNonPickedHandle = mockNonPickedHandle;
    handler._updatedData = handler.getImmutableFeatureCollection();

    handler.shouldPerformSnap();
    const mockCurrentPoint = [-122.49485401280788, 37.987923255302974];
    handler.performSnap(mockCurrentPoint, 10);

    expect(handler._snapAssociations).toEqual([[1], [0]]);
    expect(handler._unsnapMousePointStart).toEqual(mockCurrentPoint);
    expect(handler).toMatchSnapshot();
  });

  test('performUnsnap()', () => {
    handler.setModeConfig({ enablePolygonSnapping: true });
    handler.setSelectedFeatureIndexes([0]);
    handler._pickedHandle = mockPickedHandle;
    handler._potentialNonPickedHandle = mockNonPickedHandle;
    handler._updatedData = handler.getImmutableFeatureCollection();
    const mockCurrentPoint = [-122.49485401280788, 37.987923255302974];
    handler._unsnapMousePointStart = [1, 1];
    handler._snapAssociations = [[1], [0]];

    handler.performUnsnap(mockCurrentPoint, 1);
    expect(handler._snapAssociations).toEqual([[], []]);
    expect(handler).toMatchSnapshot();
  });

  test('performTranslate()', () => {
    const selectedIndex = 0;
    handler.setSelectedFeatureIndexes([selectedIndex]);
    handler._updatedData = handler.getImmutableFeatureCollection();
    handler._geometryBeforeTranslate = handler.getSelectedFeaturesAsFeatureCollection();

    const initialFeatures = handler._updatedData.getObject().features;
    const initialNonSelectedFeatures = initialFeatures.filter(
      (_, index) => index !== selectedIndex
    );

    handler.performTranslate(100, 20);
    const featuresAfterTranslate = handler._updatedData.getObject().features;
    const nonSelectedFeaturesAfterTranslate = featuresAfterTranslate.filter(
      (_, index) => index !== selectedIndex
    );

    expect(featuresAfterTranslate).not.toEqual(initialFeatures);
    expect(nonSelectedFeaturesAfterTranslate).toEqual(initialNonSelectedFeatures);
  });

  test('getTranslateAction()', () => {
    handler.setSelectedFeatureIndexes([0]);
    handler._updatedData = handler.getImmutableFeatureCollection();
    handler._geometryBeforeTranslate = handler.getSelectedFeaturesAsFeatureCollection();

    const translateAction = handler.getTranslateAction([1, 1], [100, 100], 'test-edit');
    expect(translateAction).toMatchSnapshot();
  });
});
