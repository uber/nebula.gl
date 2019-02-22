// @flow
import type { FeatureCollection } from '../../../geojson-types.js';

import {
  createPointerDragEvent,
  createPointerMoveEvent,
  getMockFeatureDetails,
  FeatureType,
  mockedGeoJsonProperties
} from '../test-utils.js';

export function mockHandleStartDragging(
  handler: { [key: string]: any },
  eventOptions: { [key: string]: any }
) {
  const { clickCoordinates, moveCoordinates, picks } = eventOptions;
  const dragEvent = createPointerDragEvent(clickCoordinates, moveCoordinates, picks);
  return handler.handleStartDragging(dragEvent);
}

export function mockHandlePointerMove(
  handler: { [key: string]: any },
  eventOptions: { [key: string]: any }
) {
  const { clickCoordinates, picks } = eventOptions;
  const moveEvent = createPointerMoveEvent(clickCoordinates, picks);
  return handler.handlePointerMove(moveEvent);
}

export function mockHandleStopDragging(
  handler: { [key: string]: any },
  eventOptions: { [key: string]: any }
) {
  const { clickCoordinates, moveCoordinates, picks } = eventOptions;
  const dragEvent = createPointerDragEvent(clickCoordinates, moveCoordinates, picks);
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
          const { clickCoords, index, geoJson } = getMockFeatureDetails(featureType);
          handler.setSelectedFeatureIndexes([index]);
          mockHandlePointerMove(handler, {
            clickCoordinates: clickCoords,
            picks: [{ index, object: geoJson }]
          });
          expect(handler[isActionEnabledName]).toBeTruthy();
        });
      }
    });

    test(`${modeName} - no action when mouse is over non selected polygon`, () => {
      const handler = new HandlerClass(featureCollection);
      const { clickCoords, index, geoJson } = getMockFeatureDetails(FeatureType.POLYGON);
      handler.setSelectedFeatureIndexes([index + 1]);
      const { editAction, cancelMapPan } = mockHandlePointerMove(handler, {
        clickCoordinates: clickCoords,
        picks: [{ index, object: geoJson }]
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
  });
}

export function testHandleStartDragging(
  modeName: string,
  HandlerClass: any,
  featureCollection: FeatureCollection,
  isActionEnabledName: string,
  getGeometryBeforeActionName: string
) {
  describe('handleStartDragging()', () => {
    test(`${modeName} mode - initial geometry is assigned under valid conditions`, () => {
      const handler = new HandlerClass(featureCollection);
      const { clickCoords, index, geoJson } = getMockFeatureDetails(FeatureType.POINT);
      handler.setSelectedFeatureIndexes([index]);
      handler[isActionEnabledName] = true;
      const moveCoordinates = clickCoords.map(coord => coord + 0.5);
      mockHandleStartDragging(handler, {
        clickCoordinates: clickCoords,
        moveCoordinates,
        picks: [{ index, object: geoJson }]
      });
      expect(handler[getGeometryBeforeActionName]).toBeDefined();
    });

    test(`${modeName} mode - initial geometry is not assigned under invalid conditions`, () => {
      const handler = new HandlerClass(featureCollection);
      const { clickCoords, index, geoJson } = getMockFeatureDetails(FeatureType.POINT);
      handler.setSelectedFeatureIndexes([index]);
      handler[isActionEnabledName] = false;
      const moveCoordinates = clickCoords.map(coord => coord + 0.5);
      mockHandleStartDragging(handler, {
        clickCoordinates: clickCoords,
        moveCoordinates,
        picks: [{ index, object: geoJson }]
      });
      expect(handler[getGeometryBeforeActionName]).toBeUndefined();
    });
  });
}

export function testHandleStopDragging(
  modeName: string,
  HandlerClass: any,
  featureCollection: FeatureCollection,
  featureFilter: (...args: Array<any>) => any = feature => feature
) {
  function testHandleStopDraggingForFeatureType(featureType: string) {
    test(`${modeName} mode action - single selected ${featureType} feature`, () => {
      const handler = new HandlerClass(featureCollection);
      const { geoJson, clickCoords, index } = getMockFeatureDetails(featureType);
      handler.setSelectedFeatureIndexes([index]);
      const moveCoordinates = clickCoords.map(coord => coord + 0.5);
      const initialFeatureCoords = geoJson.geometry.coordinates;

      const { stopDraggingResult: editAction } = mockFeatureMove(handler, {
        clickCoordinates: clickCoords,
        moveCoordinates,
        picks: [{ index, object: geoJson }]
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

  describe('handleStopDragging()', () => {
    Object.values(FeatureType)
      .filter(featureFilter)
      .forEach(featureType => {
        if (typeof featureType === 'string') {
          testHandleStopDraggingForFeatureType(featureType);
        }
      });

    test(`${modeName} mode action - geoJson properties are preserved after mode action`, () => {
      const handler = new HandlerClass(featureCollection);
      const { clickCoords, index, geoJson} = getMockFeatureDetails(FeatureType.POLYGON);
      handler.setSelectedFeatureIndexes([index]);
      const moveCoordinates = clickCoords.map(coord => coord + 0.5);
      const { stopDraggingResult: editAction } = mockFeatureMove(handler, {
        clickCoordinates: clickCoords,
        moveCoordinates,
        picks: [{ index, object: geoJson }]
      });
      expect(editAction).toBeDefined();
      if (editAction) {
        const { updatedData } = editAction;
        const movedFeature = updatedData.features[index];
        expect(movedFeature.properties).toEqual(mockedGeoJsonProperties);
      }
    });
  });
}
