// @flow
/* eslint-env jest */
import { SplitPolygonHandler } from '../../../lib/mode-handlers/split-polygon-handler.js';
import type { EditAction } from '../../../lib/mode-handlers/mode-handler.js';
import {
  createFeatureCollection,
  createMultiPolygonFeature,
  createPolygonFeature,
  createClickEvent,
  createPointerMoveEvent
} from '../test-utils.js';

describe('Split Polygon Handler ', () => {
  test('sets tentative feature to a LineString after first click on Pointer move', () => {
    const featureCollection = createFeatureCollection();
    const handler = new SplitPolygonHandler(featureCollection);
    handler.setSelectedFeatureIndexes([2]);
    handler.handleClick(createClickEvent([1, 2]));
    handler.handlePointerMove(createPointerMoveEvent([2, 3]));
    const tentativeFeature = handler.getTentativeFeature();
    expect(tentativeFeature).toEqual({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [[1, 2], [2, 3]]
      }
    });
  });

  describe('should reset tentativeFeature on handleClick ', () => {
    test('when selectedGeometry is not selected ', () => {
      const featureCollection = createFeatureCollection();
      const handler = new SplitPolygonHandler(featureCollection);
      const action = handler.handleClick(createClickEvent([1, 2]));
      const tentativeFeature = handler.getTentativeFeature();
      expect(action).toBeNull();
      expect(tentativeFeature).toBeNull();
    });

    test('when clicked point is inside the polygon ', () => {
      const featureCollection = createFeatureCollection();
      const handler = new SplitPolygonHandler(featureCollection);
      handler.setSelectedFeatureIndexes([2]);
      const action1 = handler.handleClick(createClickEvent([-2, -2]));
      handler.handlePointerMove(createPointerMoveEvent([-1, -1]));
      const action = handler.handleClick(createClickEvent([-1, -1]));
      expect(action1).toBeNull();
      expect(action).toBeNull();
    });

    test('when lineString is outside the polygon ', () => {
      const featureCollection = createFeatureCollection();
      const handler = new SplitPolygonHandler(featureCollection);
      handler.setSelectedFeatureIndexes([2]);
      const action1 = handler.handleClick(createClickEvent([-2, -2]));
      handler.handlePointerMove(createPointerMoveEvent([-4, -4]));
      const action = handler.handleClick(createClickEvent([-4, -4]));
      expect(action1).toBeNull();
      expect(action).toBeNull();
    });

    test('when lineString is outside the polygon lock90Degree', () => {
      const featureCollection = createFeatureCollection();
      const handler = new SplitPolygonHandler(featureCollection);
      handler.setModeConfig({ lock90Degree: true });
      handler.setSelectedFeatureIndexes([2]);
      const action1 = handler.handleClick(createClickEvent([-2, -2]));
      handler.handlePointerMove(createPointerMoveEvent([-4, -4]));
      const action = handler.handleClick(createClickEvent([-4, -4]));
      expect(action1).toBeNull();
      expect(action).toMatchSnapshot();
    });
  });

  test('should split the polygon with holes and upgrade to MultiPolygon ', () => {
    const featureCollection = {
      type: 'FeatureCollection',
      features: [createPolygonFeature()]
    };
    const handler = new SplitPolygonHandler(featureCollection);
    handler.setModeConfig({});
    handler.setSelectedFeatureIndexes([0]);
    handler.handleClick(createClickEvent([-2, -2]));
    handler.handlePointerMove(createPointerMoveEvent([2, 3]));
    const action = handler.handleClick(createClickEvent([2, 3]));

    const expectedAction: EditAction = {
      updatedData: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'MultiPolygon',
              coordinates: [
                [
                  [
                    [-1, -1],
                    [1, -1],
                    [1, 1],
                    [0.4000000114992654, 1],
                    [1.149960793256355e-8, 0.5],
                    [0.5, 0.5],
                    [0.5, -0.5],
                    [-0.5, -0.5],
                    [-0.5, -0.1250000143750451],
                    [-1, -0.7500000143755803],
                    [-1, -1]
                  ]
                ],
                [
                  [
                    [-1, -0.7499999856244346],
                    [-0.5, -0.12499998562496802],
                    [-0.5, 0.5],
                    [-1.1499598773223596e-8, 0.5],
                    [0.3999999885007426, 1],
                    [-1, 1],
                    [-1, -0.7499999856244346]
                  ]
                ]
              ]
            }
          }
        ]
      },
      editType: 'split',
      featureIndexes: [0],
      editContext: null
    };

    expect(action).toEqual(expectedAction);
  });

  test('should split the multiPolygon ', () => {
    const featureCollection = {
      type: 'FeatureCollection',
      features: [createMultiPolygonFeature()]
    };
    const handler = new SplitPolygonHandler(featureCollection);
    handler.setModeConfig({});
    handler.setSelectedFeatureIndexes([0]);
    handler.handleClick(createClickEvent([-2, -2]));
    handler.handlePointerMove(createPointerMoveEvent([2, 3]));
    const action = handler.handleClick(createClickEvent([2, 3]));

    const expectedAction: EditAction = {
      updatedData: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'MultiPolygon',
              coordinates: [
                [
                  [
                    [-1, -1],
                    [1, -1],
                    [1, 1],
                    [0.4000000114992654, 1],
                    [1.149960793256355e-8, 0.5],
                    [0.5, 0.5],
                    [0.5, -0.5],
                    [-0.5, -0.5],
                    [-0.5, -0.1250000143750451],
                    [-1, -0.7500000143755803],
                    [-1, -1]
                  ]
                ],
                [
                  [
                    [-1, -0.7499999856244346],
                    [-0.5, -0.12499998562496802],
                    [-0.5, 0.5],
                    [-1.1499598773223596e-8, 0.5],
                    [0.3999999885007426, 1],
                    [-1, 1],
                    [-1, -0.7499999856244346]
                  ]
                ],
                [[[2, -1], [4, -1], [4, 1], [2, 1], [2, -1]]]
              ]
            }
          }
        ]
      },
      editType: 'split',
      featureIndexes: [0],
      editContext: null
    };

    expect(action).toEqual(expectedAction);
  });
});
