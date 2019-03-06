// @flow
/* eslint-env jest */

import { ModeHandler } from '../../../src/mode-handlers/mode-handler.js';
import type { FeatureCollection } from '../../../geojson-types.js';
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

const polygonWithInnerRing = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [-122.51552705327066, 37.771461121222295],
        [-122.47012273204086, 37.77342862160346],
        [-122.45887898548045, 37.77471764518967],
        [-122.4570760666428, 37.76644036576543],
        [-122.46171088672446, 37.765761859152995],
        [-122.46325587621311, 37.76644036576543],
        [-122.51423916746319, 37.76399771282799],
        [-122.51449684613294, 37.76725456548338],
        [-122.51552705327066, 37.771461121222295]
      ],
      [
        [-122.51226541853708, 37.770239887756205],
        [-122.46068133438803, 37.77302155685456],
        [-122.45939356324106, 37.76759381272022],
        [-122.46308433343108, 37.76847584825267],
        [-122.51235098786708, 37.76569400814939],
        [-122.51226541853708, 37.770239887756205]
      ]
    ]
  }
};

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

describe('polygon snapping', () => {
  let handler;

  beforeEach(() => {
    handler = mockFeatureCollectionState(polygonsForSnappingTests);
  });
  test('getNearestPolygonIndexes()', () => {
    const numberToTrack = 3;
    const nearestPolygons = handler.getNearestPolygonIndexes({ numberToTrack });
    expect(nearestPolygons.length).toEqual(numberToTrack);
    expect(nearestPolygons).toEqual([0, 3, 4]);
  });

  test('getPolygonOuterRing()', () => {
    const outerRing = handler.getPolygonOuterRing(polygonWithInnerRing);
    expect(outerRing).toMatchSnapshot();
  });

  test('getPolygonPointsClosestToAzimuth()', () => {
    const polyPoints = handler.getPolygonPointsClosestToAzimuth(polygonWithInnerRing, {
      numberToTrack: 2,
      azimuth: 280
    });
    expect(polyPoints.length).toEqual(2);
    expect(polyPoints).toMatchSnapshot();
  });

  test('getPolygonEdgeDetailsFromAzimuth()', () => {
    const edgeDetails = handler.getPolygonEdgeDetailsFromAzimuth(polygonWithInnerRing, 280);
    expect(edgeDetails).toMatchSnapshot();
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
    const edgeLength = 12;
    const snapStrengthModifier = handler.getSnapStrengthModifier(edgeLength);
    const expectedValue = Math.pow(edgeLength / 2, 0.8);
    expect(snapStrengthModifier).toEqual(expectedValue);
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
    expect(handler.shouldPerformSnap({ enablePolygonSnapping: true })).toBeTruthy();
  });

  test('shouldPerformSnap() - many selected polygons', () => {
    handler.setSelectedFeatureIndexes([0, 1]);
    expect(handler.shouldPerformSnap({ enablePolygonSnapping: true })).toBeFalsy();
  });

  test('shouldPerformSnap() - no selected features', () => {
    handler.setSelectedFeatureIndexes([]);
    expect(handler.shouldPerformSnap({ enablePolygonSnapping: true })).toBeFalsy();
  });

  test('shouldPerformSnap() - selected point', () => {
    handler.setSelectedFeatureIndexes([2]);
    expect(handler.shouldPerformSnap({ enablePolygonSnapping: true })).toBeFalsy();
  });

  test('shouldPerformSnap() - is already snapped', () => {
    const [selectedIndex] = handler.getSelectedFeatureIndexes();
    handler.cacheSnapAssociates(selectedIndex, 5);
    expect(handler.shouldPerformSnap({ enablePolygonSnapping: true })).toBeFalsy();
  });

  test('shouldPerformSnap() - enablePolygonSnapping is false', () => {
    expect(handler.shouldPerformSnap({ enablePolygonSnapping: false })).toBeFalsy();
  });

  test('shouldPerformUnsnap() - positive case', () => {
    const [selectedIndex] = handler.getSelectedFeatureIndexes();
    handler.cacheSnapAssociates(selectedIndex, 5);
    expect(handler.shouldPerformUnsnap({ enablePolygonSnapping: true })).toBeTruthy();
  });

  test('shouldPerformUnsnap() - many polygons selected', () => {
    handler.setSelectedFeatureIndexes([0, 1]);
    expect(handler.shouldPerformUnsnap({ enablePolygonSnapping: true })).toBeFalsy();
  });

  test('shouldPerformUnsnap() - no selected features', () => {
    handler.setSelectedFeatureIndexes([]);
    expect(handler.shouldPerformUnsnap({ enablePolygonSnapping: true })).toBeFalsy();
  });

  test('shouldPerformUnsnap() - selected point', () => {
    handler.setSelectedFeatureIndexes([2]);
    expect(handler.shouldPerformUnsnap({ enablePolygonSnapping: true })).toBeFalsy();
  });

  test('shouldPerformUnsnap() - is not already snapped', () => {
    expect(handler.shouldPerformUnsnap({ enablePolygonSnapping: true })).toBeFalsy();
  });

  test('shouldPerformSnap() - enablePolygonSnapping is false', () => {
    expect(handler.shouldPerformSnap({ enablePolygonSnapping: false })).toBeFalsy();
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

  test('calculateDistanceAndDirection()', () => {
    const mouseDragDetails = handler.calculateDistanceAndDirection(
      [-122.28103267622373, 37.98843664327903],
      [-122.40908525092362, 37.85902221692065]
    );
    expect(mouseDragDetails).toMatchSnapshot();
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
