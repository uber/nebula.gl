// @flow
import { DuplicateHandler } from '../../../src/mode-handlers/duplicate-handler';
import type { FeatureCollection } from '../../../src/geojson-types.js';
import {
  FeatureType,
  createFeatureCollection,
  getMockFeatureDetails,
  mockedGeoJsonProperties
} from '../test-utils.js';
import {
  testModeHandlerHandlePointMove,
  mockHandlePointerMove,
  mockHandleStartDragging
} from './mode-handler-utils';

const modeName = 'duplicate';
const featureCollection: FeatureCollection = createFeatureCollection({
  mockGeoJsonProperties: true
});

testModeHandlerHandlePointMove(modeName, DuplicateHandler, featureCollection, '_isTranslatable');

function countFeatureTypesInCollection(collection, featureType) {
  const { features } = collection;
  return features.filter(feature => feature.geometry.type === featureType).length;
}

function testDuplicatingSingleFeature(featureType) {
  test(`duplicate single selected ${featureType} feature`, () => {
    const handler = new DuplicateHandler(featureCollection);
    const { clickCoords, index } = getMockFeatureDetails(featureType);
    const nonDupedFeatureTypes = Object.values(FeatureType).filter(type => type !== featureType);
    handler.setSelectedFeatureIndexes([index]);
    handler._isTranslatable = true;
    const moveCoordinates = clickCoords.map(coord => coord + 0.5);
    const { updatedData } = mockHandleStartDragging(handler, {
      clickCoordinates: clickCoords,
      moveCoordinates,
      picksIndex: index
    });
    // Ensure selected feature was duplicated
    expect(countFeatureTypesInCollection(updatedData, featureType)).toEqual(2);
    // Ensure non-selected features were not duplicated
    nonDupedFeatureTypes.forEach(type => {
      const featureTypeCount = countFeatureTypesInCollection(updatedData, type);
      expect(featureTypeCount).toEqual(1);
    });
  });
}

describe('handleStartDragging()', () => {
  Object.values(FeatureType).forEach(featureType => {
    if (typeof featureType === 'string') {
      testDuplicatingSingleFeature(featureType);
    }
  });

  test('duplicate multi-selected features (multipolygon and polygon)', () => {
    const handler = new DuplicateHandler(featureCollection);
    const multiPolygonDetails = getMockFeatureDetails(FeatureType.MULTI_POLYGON);
    const polygonDetails = getMockFeatureDetails(FeatureType.POLYGON);
    const nonDupedFeatureTypes = Object.values(FeatureType).filter(
      featureType => ![FeatureType.MULTI_POLYGON, FeatureType.POLYGON].includes(featureType)
    );
    handler.setSelectedFeatureIndexes([multiPolygonDetails.index, polygonDetails.index]);
    handler._isTranslatable = true;

    const moveCoordinates = multiPolygonDetails.clickCoords.map(coord => coord + 0.5);
    const { updatedData } = mockHandleStartDragging(handler, {
      clickCoordinates: multiPolygonDetails.clickCoords,
      moveCoordinates,
      picksIndex: multiPolygonDetails.index
    });
    // Ensure selected feature was duplicated
    expect(countFeatureTypesInCollection(updatedData, FeatureType.MULTI_POLYGON)).toEqual(2);
    expect(countFeatureTypesInCollection(updatedData, FeatureType.POLYGON)).toEqual(2);
    // Ensure non-selected features were not duplicated
    nonDupedFeatureTypes.forEach(featureType => {
      const featureTypeCount = countFeatureTypesInCollection(updatedData, featureType);
      expect(featureTypeCount).toEqual(1);
    });
  });

  test('Single duplicated feature retains user supplied geoJson properties', () => {
    const handler = new DuplicateHandler(featureCollection);
    const { index, clickCoords } = getMockFeatureDetails(FeatureType.POLYGON);
    handler.setSelectedFeatureIndexes([index]);
    handler._isTranslatable = true;

    const moveCoordinates = clickCoords.map(coord => coord + 0.5);
    const mockMouseOptions = {
      clickCoordinates: clickCoords,
      moveCoordinates,
      picksIndex: index
    };
    mockHandlePointerMove(handler, mockMouseOptions);
    const editAction = mockHandleStartDragging(handler, mockMouseOptions);
    expect(editAction).toBeDefined();
    if (editAction) {
      const { updatedData, featureIndexes } = editAction;
      const dupledPoly = updatedData.features[featureIndexes[0]];
      expect(dupledPoly.properties).toEqual(mockedGeoJsonProperties);
    }
  });

  test('Multiple duplicated features retain user supplied geoJson properties (multipolygon and polygon)', () => {
    const handler = new DuplicateHandler(featureCollection);
    const poly = getMockFeatureDetails(FeatureType.POLYGON);
    const multiPoly = getMockFeatureDetails(FeatureType.MULTI_POLYGON);
    handler.setSelectedFeatureIndexes([poly.index, multiPoly.index]);
    handler._isTranslatable = true;

    const moveCoordinates = poly.clickCoords.map(coord => coord + 0.5);
    const mockMouseOptions = {
      clickCoordinates: poly.clickCoords,
      moveCoordinates,
      picksIndex: poly.index
    };
    mockHandlePointerMove(handler, mockMouseOptions);
    const editAction = mockHandleStartDragging(handler, mockMouseOptions);
    expect(editAction).toBeDefined();
    if (editAction) {
      const { updatedData, featureIndexes } = editAction;
      const dupledPoly = updatedData.features[featureIndexes[0]];
      const dupedMultiPoly = updatedData.features[featureIndexes[1]];
      expect(dupledPoly.properties).toEqual(mockedGeoJsonProperties);
      expect(dupedMultiPoly.properties).toEqual(mockedGeoJsonProperties);
    }
  });
});
