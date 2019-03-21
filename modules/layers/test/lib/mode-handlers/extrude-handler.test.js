// @flow
/* eslint-env jest */

import { ExtrudeHandler } from '../../../src/mode-handlers/extrude-handler';
import type {
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent
} from '../../../src/event-types.js';

let polygonFeature2;
let polygonFeature;
let multiPolygonFeature;

beforeEach(() => {
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

  polygonFeature2 = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-122.37655502796184, 37.73044693993899],
          [-122.33278003573427, 37.75078793941756],
          [-122.32752022385608, 37.72496727732805],
          [-122.35593643356474, 37.702697578614355],
          [-122.37655502796184, 37.73044693993899]
        ]
      ]
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
});

describe('coordinatesSize()', () => {
  it('gets coordinatesSize for polygon', () => {
    const features = new ExtrudeHandler({
      type: 'FeatureCollection',
      features: [polygonFeature]
    });
    features.setSelectedFeatureIndexes([0]);

    let actual = features.coordinatesSize([0, 2], 0);
    let expected = polygonFeature.geometry.coordinates[0].length;
    expect(actual).toEqual(expected);

    actual = features.coordinatesSize([1, 2], 0);
    expected = polygonFeature.geometry.coordinates[1].length;
    expect(actual).toEqual(expected);
  });

  it('gets coordinatesSize for multiPolygonFeature', () => {
    const features = new ExtrudeHandler({
      type: 'FeatureCollection',
      features: [multiPolygonFeature]
    });
    features.setSelectedFeatureIndexes([0]);

    let actual = features.coordinatesSize([0, 1, 2], 0);
    let expected = multiPolygonFeature.geometry.coordinates[0][1].length;
    expect(actual).toEqual(expected);

    actual = features.coordinatesSize([1, 0, 2], 0);
    expected = multiPolygonFeature.geometry.coordinates[1][0].length;
    expect(actual).toEqual(expected);
  });
});

describe('getBearing()', () => {
  it('get bearing', () => {
    const features = new ExtrudeHandler({
      type: 'FeatureCollection',
      features: [polygonFeature]
    });
    features.setSelectedFeatureIndexes([0]);

    const p1 = [-122.32695380624956, 37.81800998554937];
    const p2 = [-122.37396937847147, 37.83386913944292];
    const p3 = [-122.35696149110807, 37.79492394071639];

    let actual = features.getBearing(p1, p2);
    let expected = 293;
    expect(actual).toEqual(expected);

    actual = features.getBearing(p2, p3);
    expected = 160;
    expect(actual).toEqual(expected);
  });
});

describe('nextPositionIndexes()', () => {
  it('get next Position Indexes', () => {
    const features = new ExtrudeHandler({
      type: 'FeatureCollection',
      features: [polygonFeature]
    });
    features.setSelectedFeatureIndexes([0]);

    let actual = features.nextPositionIndexes([0, 0], 5);
    let expected = [0, 1];
    expect(actual).toEqual(expected);

    actual = features.nextPositionIndexes([0, 2], 5);
    expected = [0, 3];
    expect(actual).toEqual(expected);

    actual = features.nextPositionIndexes([0, 4], 5);
    expected = [0, 0];
    expect(actual).toEqual(expected);

    actual = features.nextPositionIndexes([1, 0, 2], 5);
    expected = [1, 0, 3];
    expect(actual).toEqual(expected);

    actual = features.nextPositionIndexes([1, 0, 4], 5);
    expected = [1, 0, 0];
    expect(actual).toEqual(expected);
  });
});

describe('prevPositionIndexes()', () => {
  it('get previous Position Indexes', () => {
    const features = new ExtrudeHandler({
      type: 'FeatureCollection',
      features: [polygonFeature]
    });
    features.setSelectedFeatureIndexes([0]);

    let actual = features.prevPositionIndexes([0, 0], 5);
    let expected = [0, 3];
    expect(actual).toEqual(expected);

    actual = features.prevPositionIndexes([0, 2], 5);
    expected = [0, 1];
    expect(actual).toEqual(expected);

    actual = features.prevPositionIndexes([0, 4], 5);
    expected = [0, 3];
    expect(actual).toEqual(expected);

    actual = features.prevPositionIndexes([1, 0, 2], 5);
    expected = [1, 0, 1];
    expect(actual).toEqual(expected);

    actual = features.prevPositionIndexes([1, 0, 0], 5);
    expected = [1, 0, 3];
    expect(actual).toEqual(expected);
  });
});

describe('isOrthogonal()', () => {
  it('is Orthogonal corner', () => {
    const features = new ExtrudeHandler({
      type: 'FeatureCollection',
      features: [polygonFeature2]
    });
    features.setSelectedFeatureIndexes([0]);

    let actual = features.isOrthogonal([0, 0], 0, 5);
    expect(actual).toEqual(true);

    actual = features.isOrthogonal([0, 2], 0, 5);
    expect(actual).toEqual(false);
  });
});

describe('getPointForPositionIndexes()', () => {
  it('get Point For Position Indexes -- polygon feature', () => {
    const features = new ExtrudeHandler({
      type: 'FeatureCollection',
      features: [polygonFeature2]
    });
    features.setSelectedFeatureIndexes([0]);

    let actual = features.getPointForPositionIndexes([0, 0], 0);
    let expected = polygonFeature2.geometry.coordinates[0][0];
    expect(actual).toEqual(expected);

    actual = features.getPointForPositionIndexes([0, 2], 0);
    expected = polygonFeature2.geometry.coordinates[0][2];
    expect(actual).toEqual(expected);
  });

  it('get Point For Position Indexes -- multiPolygonFeature', () => {
    const features = new ExtrudeHandler({
      type: 'FeatureCollection',
      features: [multiPolygonFeature]
    });
    features.setSelectedFeatureIndexes([0]);

    let actual = features.getPointForPositionIndexes([1, 0, 0], 0);
    let expected = multiPolygonFeature.geometry.coordinates[1][0][0];
    expect(actual).toEqual(expected);

    actual = features.getPointForPositionIndexes([0, 0, 2], 0);
    expected = multiPolygonFeature.geometry.coordinates[0][0][2];
    expect(actual).toEqual(expected);
  });
});

describe('handleStartDragging()', () => {
  it('handle Start Dragging', () => {
    const features = new ExtrudeHandler({
      type: 'FeatureCollection',
      features: [polygonFeature2]
    });
    features.setSelectedFeatureIndexes([0]);

    const startEvent: StartDraggingEvent = {
      picks: [
        {
          index: 0,
          object: {
            featureIndex: 0,
            type: 'intermediate',
            positionIndexes: [0, 1]
          },
          isEditingHandle: true
        }
      ],
      screenCoords: [0, 0],
      groundCoords: [0, 0],
      pointerDownScreenCoords: [0, 0],
      pointerDownGroundCoords: [0, 0],
      sourceEvent: null
    };
    const actual: any = features.handleStartDragging(startEvent);
    expect(actual.editType).toEqual('startExtruding');
    expect(actual.updatedData.features[0].geometry.coordinates[0].length).toEqual(
      polygonFeature2.geometry.coordinates[0].length + 1
    );
  });
});

describe('handleStopDragging()', () => {
  it('handle Stop Dragging', () => {
    const features = new ExtrudeHandler({
      type: 'FeatureCollection',
      features: [polygonFeature2]
    });
    features.setSelectedFeatureIndexes([0]);

    const event: StopDraggingEvent = {
      picks: [
        {
          index: 0,
          object: {
            featureIndex: 0,
            type: 'intermediate',
            positionIndexes: [0, 1]
          },
          isEditingHandle: true
        }
      ],
      screenCoords: [0, 0],
      groundCoords: [0, 0],
      pointerDownScreenCoords: [0, 0],
      pointerDownGroundCoords: [0, 0],
      sourceEvent: null
    };
    const actual: any = features.handleStopDragging(event);
    expect(actual.editType).toEqual('extruded');
    expect(actual.updatedData.features[0].geometry.coordinates[0].length).toEqual(
      polygonFeature2.geometry.coordinates[0].length
    );
  });
});

describe('handlePointerMove()', () => {
  it('handle Pointer Move', () => {
    const features = new ExtrudeHandler({
      type: 'FeatureCollection',
      features: [polygonFeature2]
    });
    features.setSelectedFeatureIndexes([0]);

    const event: PointerMoveEvent = {
      picks: [],
      isDragging: true,
      pointerDownPicks: [
        {
          index: 0,
          object: {
            featureIndex: 0,
            type: 'intermediate',
            positionIndexes: [0, 1]
          },
          isEditingHandle: true
        }
      ],
      screenCoords: [0, 0],
      groundCoords: [0, 0],
      pointerDownScreenCoords: [0, 0],
      pointerDownGroundCoords: [0, 0],
      sourceEvent: null
    };
    const actual: any = features.handlePointerMove(event);

    expect(actual.editAction.editType).toEqual('extruding');
    expect(actual.editAction.updatedData.features[0].geometry.coordinates[0].length).toEqual(
      polygonFeature2.geometry.coordinates[0].length
    );
  });
});
