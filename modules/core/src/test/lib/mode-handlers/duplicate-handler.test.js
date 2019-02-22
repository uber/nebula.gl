// @flow
import { DuplicateHandler } from '../../../lib/mode-handlers/duplicate-handler';
import type { FeatureCollection } from '../../../geojson-types.js';
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
});
