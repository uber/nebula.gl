// @flow

import { point as turfPoint } from '@turf/helpers';
import type { FeatureCollection } from '../../../geojson-types.js';
import { SnapHandler } from '../../../lib/mode-handlers/snap-handler.js';

export function mockFeatureCollectionState(polygon: any) {
  const handler = new SnapHandler(polygon);
  handler.setSelectedFeatureIndexes([1]);
  return handler;
}

const polygonsForSnappingTests: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-122.49485401280788, 37.987923255302974],
            [-122.44252582524939, 37.987923255302974],
            [-122.44252847887157, 37.93873205786406],
            [-122.49485666643005, 37.93873205786406],
            [-122.49485401280788, 37.987923255302974]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-122.40814940182412, 37.97528325161274],
            [-122.37737022011595, 37.97528325161274],
            [-122.37737142575622, 37.952934704562644],
            [-122.40815060746439, 37.952934704562644],
            [-122.40814940182412, 37.97528325161274]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [-122.28103267622373, 37.98843664327903]
      }
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-122.40908525092362, 37.85902221692065],
            [-122.34432261530361, 37.85902221692065],
            [-122.3442469760231, 37.8157115979288],
            [-122.40900961164311, 37.8157115979288],
            [-122.40908525092362, 37.85902221692065]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-122.40682264287454, 38.13330760982133],
            [-122.34143228624993, 38.13330760982133],
            [-122.34144710122638, 38.08906337516829],
            [-122.40683745785105, 38.08906337516829],
            [-122.40682264287454, 38.13330760982133]
          ]
        ]
      }
    }
  ]
};

describe('polygon snapping', () => {
  let handler;

  beforeEach(() => {
    handler = mockFeatureCollectionState(polygonsForSnappingTests);
  });

  test('getSnapEditHandleFromPoint()', () => {
    const snapHandle = handler.getSnapEditHandleFromPoint(turfPoint([1, 2]));
    const expectedSnapHandle = {
      position: [1, 2],
      type: 'intermediate',
      featureIndex: -1,
      positionIndexes: [-1]
    };
    expect(snapHandle).toEqual(expectedSnapHandle);
  });

  test('shouldRenderSnapHandles() - many polygons selected', () => {
    handler.setSelectedFeatureIndexes([0, 1]);
    expect(handler.shouldRenderSnapHandles()).toBeFalsy();
  });

  test('shouldRenderSnapHandles() - point selected', () => {
    handler.setSelectedFeatureIndexes([2]);
    expect(handler.shouldRenderSnapHandles()).toBeFalsy();
  });

  test('shouldRenderSnapHandles() - no feature selected', () => {
    handler.setSelectedFeatureIndexes([]);
    expect(handler.shouldRenderSnapHandles()).toBeFalsy();
  });

  test('shouldRenderSnapHandles() - enablePolygonSnapping and _renderSnapEditHandles are false', () => {
    expect(handler.shouldRenderSnapHandles()).toBeFalsy();
  });

  test('shouldRenderSnapHandles() - positive case', () => {
    handler.setModeConfig({ enablePolygonSnapping: true });
    handler.setSelectedFeatureIndexes([0]);
    handler._renderSnapEditHandles = true;
    expect(handler.shouldRenderSnapHandles()).toBeTruthy();
  });

  test('getEditHandles()', () => {
    handler.setModeConfig({ enablePolygonSnapping: true });
    handler.setSelectedFeatureIndexes([0]);
    handler._renderSnapEditHandles = true;
    handler._selectedSnapPoint = turfPoint([1, 2]);
    handler._nonSelectedSnapPoint = turfPoint([2, 3]);
    const editHandles = handler.getEditHandles();
    expect(editHandles.length).toEqual(2);
    expect(editHandles).toMatchSnapshot();
  });

  test('getNearestPolygonIndexes()', () => {
    const numberToTrack = 3;
    const nearestPolygons = handler.getNearestPolygonIndexes({ numberToTrack });
    expect(nearestPolygons.length).toEqual(numberToTrack);
    expect(nearestPolygons).toEqual([0, 3, 4]);
  });

  test('isSinglePolygonSelected() - many polygons selected', () => {
    handler.setSelectedFeatureIndexes([0, 1]);
    expect(handler.isSinglePolygonSelected()).toBeFalsy();
  });

  test('isSinglePolygonSelected() - point selected', () => {
    handler.setSelectedFeatureIndexes([2]);
    expect(handler.isSinglePolygonSelected()).toBeFalsy();
  });

  test('isSinglePolygonSelected() - no feature selected', () => {
    handler.setSelectedFeatureIndexes([]);
    expect(handler.isSinglePolygonSelected()).toBeFalsy();
  });

  test('isSinglePolygonSelected() - one polygon selected', () => {
    expect(handler.isSinglePolygonSelected()).toBeTruthy();
  });

  test('getSnapStrengthModifier()', () => {
    handler.setSelectedFeatureIndexes([0]);
    const snapStrengthModifier = handler.getSnapStrengthModifier();
    expect(snapStrengthModifier).toMatchSnapshot();
  });

  test('hasSelectedBeenSnapped() - positive case', () => {
    const [selectedIndex] = handler.getSelectedFeatureIndexes();
    handler.cacheSnapAssociates(selectedIndex, 5);
    expect(handler.hasSelectedBeenSnapped()).toBeTruthy();
  });

  test('hasSelectedBeenSnapped() - negative case', () => {
    expect(handler.hasSelectedBeenSnapped()).toBeFalsy();
  });

  test('shouldPerformSnap() - positive case', () => {
    handler.setModeConfig({ enablePolygonSnapping: true });
    expect(handler.shouldPerformSnap()).toBeTruthy();
  });

  test('shouldPerformSnap() - many selected polygons', () => {
    handler.setSelectedFeatureIndexes([0, 1]);
    handler.setModeConfig({ enablePolygonSnapping: true });
    expect(handler.shouldPerformSnap()).toBeFalsy();
  });

  test('shouldPerformSnap() - no selected features', () => {
    handler.setSelectedFeatureIndexes([]);
    handler.setModeConfig({ enablePolygonSnapping: true });
    expect(handler.shouldPerformSnap()).toBeFalsy();
  });

  test('shouldPerformSnap() - selected point', () => {
    handler.setSelectedFeatureIndexes([2]);
    handler.setModeConfig({ enablePolygonSnapping: true });
    expect(handler.shouldPerformSnap()).toBeFalsy();
  });

  test('shouldPerformSnap() - is already snapped', () => {
    const [selectedIndex] = handler.getSelectedFeatureIndexes();
    handler.cacheSnapAssociates(selectedIndex, 5);
    handler.setModeConfig({ enablePolygonSnapping: true });
    expect(handler.shouldPerformSnap()).toBeFalsy();
  });

  test('shouldPerformSnap() - enablePolygonSnapping is false', () => {
    handler.setModeConfig({ enablePolygonSnapping: false });
    expect(handler.shouldPerformSnap()).toBeFalsy();
  });

  test('shouldPerformUnsnap() - positive case', () => {
    const [selectedIndex] = handler.getSelectedFeatureIndexes();
    handler.cacheSnapAssociates(selectedIndex, 5);
    handler.setModeConfig({ enablePolygonSnapping: true });
    expect(handler.shouldPerformUnsnap()).toBeTruthy();
  });

  test('shouldPerformUnsnap() - many polygons selected', () => {
    handler.setSelectedFeatureIndexes([0, 1]);
    handler.setModeConfig({ enablePolygonSnapping: true });
    expect(handler.shouldPerformUnsnap()).toBeFalsy();
  });

  test('shouldPerformUnsnap() - no selected features', () => {
    handler.setSelectedFeatureIndexes([]);
    handler.setModeConfig({ enablePolygonSnapping: true });
    expect(handler.shouldPerformUnsnap()).toBeFalsy();
  });

  test('shouldPerformUnsnap() - selected point', () => {
    handler.setSelectedFeatureIndexes([2]);
    handler.setModeConfig({ enablePolygonSnapping: true });
    expect(handler.shouldPerformUnsnap()).toBeFalsy();
  });

  test('shouldPerformUnsnap() - is not already snapped', () => {
    handler.setModeConfig({ enablePolygonSnapping: true });
    expect(handler.shouldPerformUnsnap()).toBeFalsy();
  });

  test('shouldPerformUnsnap() - enablePolygonSnapping is false', () => {
    handler.setModeConfig({ enablePolygonSnapping: false });
    expect(handler.shouldPerformSnap()).toBeFalsy();
  });

  test('shouldPerformStandardModeAction() - selected has not been snapped', () => {
    expect(handler.shouldPerformStandardModeAction()).toBeTruthy();
  });

  test('shouldPerformStandardModeAction() - multiple polygons selected', () => {
    handler.setSelectedFeatureIndexes([0, 1]);
    expect(handler.shouldPerformStandardModeAction()).toBeTruthy();
  });

  test('shouldPerformSnap() - selected point', () => {
    handler.setSelectedFeatureIndexes([2]);
    expect(handler.shouldPerformStandardModeAction()).toBeTruthy();
  });

  test('shouldPerformSnap() - selected polygon as been snapped', () => {
    const [selectedIndex] = handler.getSelectedFeatureIndexes();
    handler.cacheSnapAssociates(selectedIndex, 5);
    expect(handler.shouldPerformStandardModeAction()).toBeFalsy();
  });

  test('getSnapDetailsFromCandidates()', () => {
    const snapDetails = handler.getSnapDetailsFromCandidates([0, 3, 4]);
    expect(snapDetails).toMatchSnapshot();
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

  test('clearSnapAssociates()', () => {
    handler.cacheSnapAssociates(5, 8);
    handler.cacheSnapAssociates(5, 9);
    expect(handler.getSnapAssociates(5)).toEqual([8, 9]);
    handler.clearSnapAssociates(8);
    expect(handler._snapAssociations[5]).toEqual([9]);
    expect(handler._snapAssociations[9]).toEqual([5]);
    expect(handler._snapAssociations[8]).toEqual([]);
  });

  test('calculateSnapMove() - polygon distance within threshold', () => {
    const snapDetails = {
      index: 0,
      nonSelectedSnapPoint: {
        geometry: {
          coordinates: [-122.4425271525049, 37.96332765658352],
          type: 'Point'
        },
        properties: {},
        type: 'Feature'
      },
      selectedSnapEdgeLength: 2.4850484845856666,
      selectedSnapPoint: {
        geometry: {
          coordinates: [-122.40815000473599, 37.964108978087694],
          type: 'Point'
        },
        properties: {},
        type: 'Feature'
      },
      snapDistance: 0.1
    };

    const snapMove = handler.calculateSnapMove(snapDetails, 0.1);
    const originalPolygon = polygonsForSnappingTests.features[snapDetails.index];
    expect(snapMove).toBeDefined();
    if (snapMove) {
      expect(originalPolygon).not.toEqual(snapMove.movedPolygon);
      expect(snapMove).toMatchSnapshot();
    }
  });

  test('calculateSnapMove() - polygon distance exceeds threshold', () => {
    const snapDetails = {
      index: 0,
      nonSelectedSnapPoint: {
        geometry: {
          coordinates: [-122.4425271525049, 37.96332765658352],
          type: 'Point'
        },
        properties: {},
        type: 'Feature'
      },
      selectedSnapEdgeLength: 2.4850484845856666,
      selectedSnapPoint: {
        geometry: {
          coordinates: [-122.40815000473599, 37.964108978087694],
          type: 'Point'
        },
        properties: {},
        type: 'Feature'
      },
      snapDistance: 5
    };

    const snapMove = handler.calculateSnapMove(snapDetails, 0.1);
    expect(snapMove).toBeNull();
  });
});
