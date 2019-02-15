// @flow
import type { FeatureCollection } from '../../../geojson-types.js';

import {
  createPointerDragEvent,
  createPointerMoveEvent,
  getMockFeatureDetails,
  FeatureType
} from '../test-utils.js';

export function mockHandleStartDragging(
  handler: { [key: string]: any },
  eventOptions: { [key: string]: any }
) {
  const { clickCoordinates, moveCoordinates, picksIndex } = eventOptions;
  const dragEvent = createPointerDragEvent(clickCoordinates, moveCoordinates, [
    { index: picksIndex }
  ]);
  return handler.handleStartDragging(dragEvent);
}

export function mockHandlePointerMove(
  handler: { [key: string]: any },
  eventOptions: { [key: string]: any }
) {
  const { clickCoordinates, picksIndex } = eventOptions;
  const moveEvent = createPointerMoveEvent(clickCoordinates, [{ index: picksIndex }]);
  return handler.handlePointerMove(moveEvent);
}

export function mockHandleStopDragging(
  handler: { [key: string]: any },
  eventOptions: { [key: string]: any }
) {
  const { clickCoordinates, moveCoordinates, picksIndex } = eventOptions;
  const dragEvent = createPointerDragEvent(clickCoordinates, moveCoordinates, [
    { index: picksIndex }
  ]);
  return handler.handleStopDragging(dragEvent);
}

export function mockFeatureMove(
  handler: { [key: string]: any },
  eventOptions: { [key: string]: any }
) {
  mockHandlePointerMove(handler, eventOptions);
  const startDraggingResult = mockHandleStartDragging(handler, eventOptions);
  const pointerMoveResult = mockHandlePointerMove(handler, eventOptions);
  const stopDraggingResult = mockHandleStopDragging(handler, eventOptions);
  return {
    startDraggingResult,
    pointerMoveResult,
    stopDraggingResult
  };
}

export function testModeHandlerHandlePointMove(
  modeName: string,
  HandlerClass: any,
  featureCollection: FeatureCollection,
  isActionEnabledName: string
) {
  describe('handlePointerMove()', () => {
    Object.values(FeatureType).forEach(featureType => {
      if (typeof featureType === 'string') {
        test(`${modeName} mode active when mouse is over selected ${featureType} feature`, () => {
          const handler = new HandlerClass(featureCollection);
          const { clickCoords, index } = getMockFeatureDetails(featureType);
          handler.setSelectedFeatureIndexes([index]);
          mockHandlePointerMove(handler, {
            clickCoordinates: clickCoords,
            picksIndex: index
          });
          expect(handler[isActionEnabledName]).toBeTruthy();
        });
      }
    });

    test(`${modeName} mode active when mouse is over a multi-selected feature`, () => {
      const handler = new HandlerClass(featureCollection);
      const { clickCoords, index } = getMockFeatureDetails(FeatureType.MULTI_LINE_STRING);
      const { index: secondIndex } = getMockFeatureDetails(FeatureType.POLYGON);
      handler.setSelectedFeatureIndexes([index, secondIndex]);
      mockHandlePointerMove(handler, {
        clickCoordinates: clickCoords,
        picksIndex: index
      });
      expect(handler[isActionEnabledName]).toBeTruthy();
    });

    test(`${modeName} - no action when mouse is over non selected polygon`, () => {
      const handler = new HandlerClass(featureCollection);
      const { clickCoords, index } = getMockFeatureDetails(FeatureType.POLYGON);
      handler.setSelectedFeatureIndexes([index + 1]);
      const { editAction, cancelMapPan } = mockHandlePointerMove(handler, {
        clickCoordinates: clickCoords,
        picksIndex: index
      });
      expect(handler[isActionEnabledName]).toBeFalsy();
      expect(editAction).toBeNull();
      expect(cancelMapPan).toBeFalsy();
    });

    test(`${modeName} - no action when mouse isn't over any feature`, () => {
      const handler = new HandlerClass(featureCollection);
      const { clickCoords, index } = getMockFeatureDetails(FeatureType.POLYGON);
      handler.setSelectedFeatureIndexes([index]);
      const { editAction, cancelMapPan } = mockHandlePointerMove(handler, {
        clickCoordinates: clickCoords
      });
      expect(handler[isActionEnabledName]).toBeFalsy();
      expect(editAction).toBeNull();
      expect(cancelMapPan).toBeFalsy();
    });

    test(`${modeName} - no action when mouse is not over multi-selected selected feature`, () => {
      const handler = new HandlerClass(featureCollection);
      const { clickCoords, index: nonSelectedIndex } = getMockFeatureDetails(
        FeatureType.MULTI_LINE_STRING
      );
      const { index: firstIndex } = getMockFeatureDetails(FeatureType.POLYGON);
      const { index: secondIndex } = getMockFeatureDetails(FeatureType.POINT);
      handler.setSelectedFeatureIndexes([firstIndex, secondIndex]);
      const { editAction, cancelMapPan } = mockHandlePointerMove(handler, {
        clickCoordinates: clickCoords,
        picksIndex: nonSelectedIndex
      });
      expect(handler[isActionEnabledName]).toBeFalsy();
      expect(editAction).toBeNull();
      expect(cancelMapPan).toBeFalsy();
    });
  });
}

export function testHandleStartDragging(
  modeName: string,
  HandlerClass: any,
  featureCollection: FeatureCollection,
  isActionEnabledName: string,
  getGeometryBeforeAction: (...args: Array<any>) => any
) {
  describe('handleStartDragging()', () => {
    test(`${modeName} mode - initial geometry is assigned under valid conditions`, () => {
      const handler = new HandlerClass(featureCollection);
      const { clickCoords, index } = getMockFeatureDetails(FeatureType.POINT);
      handler.setSelectedFeatureIndexes([index]);
      handler[isActionEnabledName] = true;
      const moveCoordinates = clickCoords.map(coord => coord + 0.5);
      mockHandleStartDragging(handler, {
        clickCoordinates: clickCoords,
        moveCoordinates,
        picksIndex: index
      });
      expect(getGeometryBeforeAction(handler)).toBeDefined();
    });

    test(`${modeName} mode - initial geometry is not assigned under invalid conditions`, () => {
      const handler = new HandlerClass(featureCollection);
      const { clickCoords, index } = getMockFeatureDetails(FeatureType.POINT);
      handler.setSelectedFeatureIndexes([index]);
      handler[isActionEnabledName] = false;
      const moveCoordinates = clickCoords.map(coord => coord + 0.5);
      mockHandleStartDragging(handler, {
        clickCoordinates: clickCoords,
        moveCoordinates,
        picksIndex: index
      });
      expect(getGeometryBeforeAction(handler)).toBeUndefined();
    });
  });
}

export function testHandleStopDragging(
  modeName: string,
  HandlerClass: any,
  featureCollection: FeatureCollection,
  featureFilter: (...args: Array<any>) => any = feature => feature
) {
  describe('handleStopDragging()', () => {
    Object.values(FeatureType)
      .filter(featureFilter)
      .forEach(featureType => {
        if (typeof featureType === 'string') {
          test(`${modeName} mode action - single selected ${featureType} feature`, () => {
            const handler = new HandlerClass(featureCollection);
            const { geoJson, clickCoords, index } = getMockFeatureDetails(featureType);
            handler.setSelectedFeatureIndexes([index]);
            // eslint-disable-next-line max-nested-callbacks
            const moveCoordinates = clickCoords.map(coord => coord + 0.5);
            const initialFeatureCoords = geoJson.geometry.coordinates;

            const { stopDraggingResult: editAction } = mockFeatureMove(handler, {
              clickCoordinates: clickCoords,
              moveCoordinates,
              picksIndex: index
            });
            expect(editAction).toBeDefined();
            if (editAction) {
              const { updatedData, featureIndexes } = editAction;
              expect(featureIndexes.length).toBe(1);
              expect(featureIndexes.includes(index)).toBeTruthy();
              const movedFeature = updatedData.features[index];
              const movedFeatureCoords = movedFeature.geometry.coordinates;
              // Ensure feature coordinates changed after mode action was performed
              expect(movedFeatureCoords).not.toEqual(initialFeatureCoords);
            }
          });
        }
      });

    test(`${modeName} mode action - multiple selected features (multipolygon and point)`, () => {
      const handler = new HandlerClass(featureCollection);
      const multiPolygonDetails = getMockFeatureDetails(FeatureType.MULTI_POLYGON);
      const pointDetails = getMockFeatureDetails(FeatureType.POINT);
      handler.setSelectedFeatureIndexes([multiPolygonDetails.index, pointDetails.index]);

      const { geoJson, clickCoords } = multiPolygonDetails;
      const initialMultiPolygonCoords = geoJson.geometry.coordinates;
      const initialPointCoords = pointDetails.geoJson.geometry.coordinates;
      const moveCoordinates = clickCoords.map(coord => coord + 0.5);

      const { stopDraggingResult: editAction } = mockFeatureMove(handler, {
        clickCoordinates: clickCoords,
        moveCoordinates,
        picksIndex: multiPolygonDetails.index
      });
      expect(editAction).toBeDefined();
      if (editAction) {
        const { updatedData, featureIndexes } = editAction;
        expect(featureIndexes.length).toBe(2);
        expect(featureIndexes.includes(multiPolygonDetails.index)).toBeTruthy();
        expect(featureIndexes.includes(pointDetails.index)).toBeTruthy();

        const movedMultiPolygonFeature = updatedData.features[multiPolygonDetails.index];
        const movedMultiPolygonType = movedMultiPolygonFeature.geometry.type;
        expect(movedMultiPolygonType).toBe(FeatureType.MULTI_POLYGON);
        const movedPointFeature = updatedData.features[pointDetails.index];
        const movedPointType = movedPointFeature.geometry.type;
        expect(movedPointType).toBe(FeatureType.POINT);

        const movedMultiPolygonCoords = movedMultiPolygonFeature.geometry.coordinates;
        const movedPointCoords = movedPointFeature.geometry.coordinates;
        // Ensure feature coordinates changed after mode action was performed
        expect(movedMultiPolygonCoords).not.toEqual(initialMultiPolygonCoords);
        expect(movedPointCoords).not.toEqual(initialPointCoords);
      }
    });
  });
}
