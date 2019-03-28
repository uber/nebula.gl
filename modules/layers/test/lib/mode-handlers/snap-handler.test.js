// @flow

import { featuresForSnappingTests, mockPickedHandle, mockNonPickedHandle } from '../test-utils';
import { SnapHandler } from '../../../src/mode-handlers/snap-handler.js';

function mockFeatureCollectionState(features: any) {
  const handler = new SnapHandler(features);
  handler.setSelectedFeatureIndexes([1]);
  return handler;
}

const mockPointHandle = {
  featureIndex: 2,
  position: [-122.28103267622373, 37.98843664327903],
  positionIndexes: [0],
  type: 'snap'
};

const mockUpdatedFeature = {
  coordinates: [[[-122, 37], [-122.44252582524939, 37.987923255302974]]]
};

describe('polygon snapping', () => {
  let handler;

  beforeEach(() => {
    handler = mockFeatureCollectionState(featuresForSnappingTests);
  });

  test('setPickedHandle() - valid handle', () => {
    handler.setPickedHandle(mockPickedHandle);
    expect(handler._pickedHandle).toEqual(mockPickedHandle);
  });

  test('setPickedHandle() - null handle', () => {
    handler.setPickedHandle(null);
    expect(handler._pickedHandle).toEqual(null);
  });

  test('clearCachedHandles()', () => {
    handler.setPickedHandle(mockPickedHandle);
    expect(handler._pickedHandle).toEqual(mockPickedHandle);
    handler._potentialNonPickedHandle = mockNonPickedHandle;
    handler.clearCachedHandles();
    expect(handler._pickedHandle).toEqual(null);
    expect(handler._potentialNonPickedHandle).toEqual(null);
  });

  test('updatePickedHandlePosition() - positive case', () => {
    handler.setPickedHandle(mockPickedHandle);
    expect(handler._pickedHandle).toEqual(mockPickedHandle);
    const initialPickedHandle = handler._pickedHandle;

    handler.updatePickedHandlePosition(0, mockUpdatedFeature);
    expect(handler._pickedHandle).toEqual(initialPickedHandle);
    expect(handler._pickedHandle).toMatchSnapshot();
  });

  test('updatePickedHandlePosition() - no _pickedHandle case', () => {
    handler.updatePickedHandlePosition(0, mockUpdatedFeature);
    expect(handler._pickedHandle).toBeFalsy();
  });

  test('getFeatureFromHandle() - positive case', () => {
    const feature = handler.getFeatureFromHandle(mockPickedHandle);
    const { featureIndex } = mockPickedHandle;
    const { features } = handler.featureCollection.getObject();
    expect(feature).toEqual(features[featureIndex]);
  });

  test('getFeatureFromHandle() - no handle specified', () => {
    const feature = handler.getFeatureFromHandle(null);
    expect(feature).toEqual(null);
  });

  test('getFeatureFromHandle() - featureIndex out of bounds', () => {
    const mockHandleCopy = { ...mockPickedHandle };
    mockHandleCopy.featureIndex = 100;
    const feature = handler.getFeatureFromHandle(mockHandleCopy);
    expect(feature).toEqual(null);
  });

  test('_getNonPickedIntermediateHandles() - positive case single selected', () => {
    const selectedIndexes = [0];
    handler.setSelectedFeatureIndexes(selectedIndexes);
    const editHandles = handler._getNonPickedIntermediateHandles();
    expect(editHandles.length > 0).toBeTruthy();

    const selectedIndexInEditHandles = editHandles.filter(({ featureIndex }) =>
      selectedIndexes.includes(featureIndex)
    );
    expect(selectedIndexInEditHandles.length).toEqual(0);
    expect(editHandles).toMatchSnapshot();
  });

  test('_getNonPickedIntermediateHandles() - positive case multiple selected', () => {
    const selectedIndexes = [0, 1];
    handler.setSelectedFeatureIndexes(selectedIndexes);
    const editHandles = handler._getNonPickedIntermediateHandles();
    expect(editHandles.length > 0).toBeTruthy();

    const selectedIndexInEditHandles = editHandles.filter(({ featureIndex }) =>
      selectedIndexes.includes(featureIndex)
    );
    expect(selectedIndexInEditHandles.length).toEqual(0);
    expect(editHandles).toMatchSnapshot();
  });

  test('_getNonPickedIntermediateHandles() - array out of bounds', () => {
    const selectedIndexes = [100];
    handler.setSelectedFeatureIndexes(selectedIndexes);
    const editHandles = handler._getNonPickedIntermediateHandles();
    expect(editHandles.length > 0).toBeTruthy();
    expect(editHandles).toMatchSnapshot();
  });

  test('getEditHandles()', () => {
    handler.setModeConfig({ enablePolygonSnapping: true });
    handler._pickedHandle = mockPickedHandle;
    handler._potentialNonPickedHandle = mockNonPickedHandle;

    const allHandles = handler.getEditHandles();
    expect(allHandles.length).toEqual(15);
    expect(allHandles).toMatchSnapshot();

    const snapHandles = allHandles.filter(({ type }) => type === 'snap');
    expect(snapHandles.length).toEqual(1);
    expect(snapHandles).toMatchSnapshot();

    const intermediateHandles = allHandles.filter(({ type }) => type === 'intermediate');
    expect(intermediateHandles.length).toEqual(14);
    expect(intermediateHandles).toMatchSnapshot();
  });

  test('getEditHandles() - no _pickedHandle', () => {
    handler.setModeConfig({ enablePolygonSnapping: true });
    const allHandles = handler.getEditHandles();
    expect(allHandles.length > 0).toBeTruthy();
    expect(allHandles).toMatchSnapshot();
  });

  test('getEditHandles() - no _potentialNonPickedHandle', () => {
    handler.setModeConfig({ enablePolygonSnapping: true });
    handler._pickedHandle = mockPickedHandle;
    const allHandles = handler.getEditHandles();
    expect(allHandles.length > 0).toBeTruthy();
    expect(allHandles).toMatchSnapshot();
  });

  test('getEditHandles() - enablePolygonSnapping not defined', () => {
    handler._pickedHandle = mockPickedHandle;
    handler._potentialNonPickedHandle = mockNonPickedHandle;

    const allHandles = handler.getEditHandles();
    expect(allHandles.length).toEqual(0);
  });

  test('getEditHandles() - _potentialNonPickedHandle is from a point feature', () => {
    handler.setModeConfig({ enablePolygonSnapping: true });
    handler._pickedHandle = mockPickedHandle;
    handler._potentialNonPickedHandle = mockPointHandle;
    const allHandles = handler.getEditHandles();
    expect(allHandles.length > 0).toBeTruthy();
    expect(allHandles).toMatchSnapshot();
  });

  test('_getNearestPolygonIndexes()', () => {
    const numberOfPolygonsToTrack = 3;
    handler._pickedHandle = mockPickedHandle;
    const nearestPolygons = handler._getNearestPolygonIndexes({ numberOfPolygonsToTrack });
    expect(nearestPolygons.length).toEqual(numberOfPolygonsToTrack);
    expect(nearestPolygons).toEqual([0, 3, 2]);
  });

  test('_getNearestPolygonIndexes() - no options provided', () => {
    handler._pickedHandle = mockPickedHandle;
    const nearestPolygons = handler._getNearestPolygonIndexes();
    expect(nearestPolygons).toEqual([0]);
  });

  test('_getNearestPolygonIndexes() - no _pickedHandle', () => {
    const nearestPolygons = handler._getNearestPolygonIndexes();
    expect(nearestPolygons).toEqual([]);
  });

  test('getSnapStrengthModifier()', () => {
    handler._pickedHandle = mockPickedHandle;
    const snapStrengthModifier = handler.getSnapStrengthModifier();
    expect(snapStrengthModifier).toMatchSnapshot();
  });

  test('getSnapStrengthModifier() - no _pickedHandle', () => {
    const snapStrengthModifier = handler.getSnapStrengthModifier();
    expect(snapStrengthModifier).toEqual(1);
  });

  test('_hasSelectedBeenSnapped() - positive case', () => {
    handler.setSelectedFeatureIndexes([0]);
    handler.cacheSnapAssociates(0, 5);
    expect(handler._hasSelectedBeenSnapped()).toBeTruthy();
  });

  test('_hasSelectedBeenSnapped() - negative case', () => {
    handler.setSelectedFeatureIndexes([0]);
    expect(handler._hasSelectedBeenSnapped()).toBeFalsy();
  });

  test('_hasSelectedBeenSnapped() - no selection', () => {
    expect(handler._hasSelectedBeenSnapped()).toBeFalsy();
  });

  test('shouldPerformSnap() - positive case', () => {
    handler.setModeConfig({ enablePolygonSnapping: true });
    handler._pickedHandle = mockPickedHandle;
    handler._potentialNonPickedHandle = mockNonPickedHandle;
    expect(handler.shouldPerformSnap()).toBeTruthy();
  });

  test('shouldPerformSnap() - enablePolygonSnapping is false', () => {
    handler.setModeConfig({ enablePolygonSnapping: false });
    expect(handler.shouldPerformSnap()).toBeFalsy();
  });

  test('shouldPerformSnap() - nonPicked already snapped to picked', () => {
    handler.setModeConfig({ enablePolygonSnapping: false });
    handler._pickedHandle = mockPickedHandle;
    handler._potentialNonPickedHandle = mockNonPickedHandle;
    handler.cacheSnapAssociates(0, 1);
    expect(handler.shouldPerformSnap()).toBeFalsy();
  });

  test('shouldPerformUnsnap() - positive case', () => {
    const [selectedIndex] = handler.getSelectedFeatureIndexes();
    handler.cacheSnapAssociates(selectedIndex, 5);
    handler.setModeConfig({ enablePolygonSnapping: true });
    expect(handler.shouldPerformUnsnap()).toBeTruthy();
  });

  test('shouldPerformUnsnap() - is not already snapped', () => {
    handler.setModeConfig({ enablePolygonSnapping: true });
    expect(handler.shouldPerformUnsnap()).toBeFalsy();
  });

  test('shouldPerformStandardModeAction() - selected has not been snapped', () => {
    expect(handler.shouldPerformStandardModeAction()).toBeTruthy();
  });

  test('shouldPerformStandardModeAction() - selected is already snapped', () => {
    handler.setSelectedFeatureIndexes([0]);
    handler.cacheSnapAssociates(0, 1);
    expect(handler.shouldPerformStandardModeAction()).toBeFalsy();
  });

  test('_cacheClosestNonPickedHandle() - positive case', () => {
    handler._pickedHandle = mockPickedHandle;
    expect(handler._potentialNonPickedHandle).not.toBeDefined();
    expect(handler._potentialSnapDistance).not.toBeDefined();

    handler._cacheClosestNonPickedHandle();
    expect(handler._potentialNonPickedHandle).toBeDefined();
    expect(handler._potentialNonPickedHandle).toMatchSnapshot();

    expect(handler._potentialSnapDistance).toBeDefined();
    expect(handler._potentialSnapDistance).toMatchSnapshot();
  });

  test('_cacheClosestNonPickedHandle() - no _pickedHandle', () => {
    handler._cacheClosestNonPickedHandle();
    expect(handler._potentialNonPickedHandle).not.toBeDefined();
    expect(handler._potentialSnapDistance).not.toBeDefined();
  });

  test('cacheSnapAssociates() - one snap association', () => {
    handler.cacheSnapAssociates(5, 8);
    expect(handler._snapAssociations[5]).toEqual([8]);
    expect(handler._snapAssociations[8]).toEqual([5]);
  });

  test('cacheSnapAssociates() - multiple snap associations', () => {
    handler.cacheSnapAssociates(5, 8);
    handler.cacheSnapAssociates(5, 9);
    expect(handler._snapAssociations[5]).toEqual([8, 9]);
    expect(handler._snapAssociations[8]).toEqual([5]);
    expect(handler._snapAssociations[9]).toEqual([5]);
  });

  test('getSnapAssociates()', () => {
    handler.cacheSnapAssociates(5, 8);
    handler.cacheSnapAssociates(5, 9);
    expect(handler.getSnapAssociates(5)).toEqual([8, 9]);
  });

  test('clearSnapAssociates() - positive case', () => {
    handler.cacheSnapAssociates(5, 8);
    handler.cacheSnapAssociates(5, 9);
    expect(handler.getSnapAssociates(5)).toEqual([8, 9]);
    handler.clearSnapAssociates(8, 5);
    expect(handler._snapAssociations[5]).toEqual([9]);
    expect(handler._snapAssociations[9]).toEqual([5]);
    expect(handler._snapAssociations[8]).toEqual([]);
  });

  test('clearSnapAssociates() - not already snapped', () => {
    handler.clearSnapAssociates(8, 0);
    expect(handler._snapAssociations).toEqual([]);
  });

  test('calculateSnapIfWithinThreshold() - single selection', () => {
    handler._pickedHandle = mockPickedHandle;
    handler._potentialNonPickedHandle = mockNonPickedHandle;
    handler._potentialSnapDistance = 0.1;
    const snapCalculations = handler.calculateSnapIfWithinThreshold(1);
    expect(snapCalculations).toBeDefined();
    if (snapCalculations) {
      expect(snapCalculations.length).toEqual(1);
    }
    expect(snapCalculations).toMatchSnapshot();
  });

  test('calculateSnapIfWithinThreshold() - multiple selection', () => {
    handler.setSelectedFeatureIndexes([0, 2]);
    handler._pickedHandle = mockPickedHandle;
    handler._potentialNonPickedHandle = mockNonPickedHandle;
    handler._potentialSnapDistance = 0.1;
    const snapCalculations = handler.calculateSnapIfWithinThreshold(1);
    expect(snapCalculations).toBeDefined();
    if (snapCalculations) {
      expect(snapCalculations.length).toEqual(2);
    }
    expect(snapCalculations).toMatchSnapshot();
  });

  test('calculateSnapIfWithinThreshold() - no _pickedHandle', () => {
    handler.setSelectedFeatureIndexes([0, 2]);
    handler._potentialNonPickedHandle = mockNonPickedHandle;
    handler._potentialSnapDistance = 0.1;
    const snapCalculations = handler.calculateSnapIfWithinThreshold(1);
    expect(snapCalculations).toEqual(null);
  });

  test('calculateSnapIfWithinThreshold() - has _potentialNonPickedHandle', () => {
    handler.setSelectedFeatureIndexes([0, 2]);
    handler._pickedHandle = mockPickedHandle;
    handler._potentialSnapDistance = 0.1;
    const snapCalculations = handler.calculateSnapIfWithinThreshold(1);
    expect(snapCalculations).toEqual(null);
  });

  test('calculateSnapIfWithinThreshold() - has _pickedHandle but not within threshold', () => {
    handler.setSelectedFeatureIndexes([0, 2]);
    handler._pickedHandle = mockPickedHandle;
    handler._potentialNonPickedHandle = mockNonPickedHandle;
    handler._potentialSnapDistance = 100;
    const snapCalculations = handler.calculateSnapIfWithinThreshold(1);
    expect(snapCalculations).toEqual(null);
  });
});
