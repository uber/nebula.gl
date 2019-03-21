// @flow
/* eslint-env jest */

import type { Position } from '../../geojson-types.js';
import type { ClickEvent, PointerMoveEvent, StopDraggingEvent } from '../../lib/event-types.js';

export const FeatureType = {
  POINT: 'Point',
  LINE_STRING: 'LineString',
  POLYGON: 'Polygon',
  MULTI_POINT: 'MultiPoint',
  MULTI_LINE_STRING: 'MultiLineString',
  MULTI_POLYGON: 'MultiPolygon'
};

const mockFeatures = {
  Point: {
    geoJson: {
      type: 'Feature',
      properties: {},
      geometry: { type: 'Point', coordinates: [1, 2] }
    },
    clickCoords: [1, 2]
  },
  LineString: {
    geoJson: {
      type: 'Feature',
      properties: {},
      geometry: { type: 'LineString', coordinates: [[1, 2], [2, 3], [3, 4]] }
    },
    clickCoords: [1, 2]
  },
  Polygon: {
    geoJson: {
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
    },
    clickCoords: [-0.5, -0.5]
  },
  MultiPoint: {
    geoJson: {
      type: 'Feature',
      properties: {},
      geometry: { type: 'MultiPoint', coordinates: [[1, 2], [3, 4]] }
    },
    clickCoords: [3, 4]
  },
  MultiLineString: {
    geoJson: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'MultiLineString',
        coordinates: [[[1, 2], [2, 3], [3, 4]], [[5, 6], [6, 7], [7, 8]]]
      }
    },
    clickCoords: [6, 7]
  },
  MultiPolygon: {
    geoJson: {
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
    },
    clickCoords: [1, 1]
  }
};

export const mockedGeoJsonProperties = { testString: 'hi', testNumber: 10 };

function createFeature(featureType: string, options: ?{ [key: string]: any }) {
  const feature = mockFeatures[featureType].geoJson;
  const { mockGeoJsonProperties } = options || {};
  if (mockGeoJsonProperties) {
    feature.properties = mockedGeoJsonProperties;
  }
  return feature;
}

export function createPointFeature(options: ?{ [key: string]: any }) {
  return createFeature(FeatureType.POINT, options);
}

export function createLineStringFeature(options: ?{ [key: string]: any }) {
  return createFeature(FeatureType.LINE_STRING, options);
}

export function createPolygonFeature(options: ?{ [key: string]: any }) {
  return createFeature(FeatureType.POLYGON, options);
}

export function createMultiPointFeature(options: ?{ [key: string]: any }) {
  return createFeature(FeatureType.MULTI_POINT, options);
}

export function createMultiLineStringFeature(options: ?{ [key: string]: any }) {
  return createFeature(FeatureType.MULTI_LINE_STRING, options);
}

export function createMultiPolygonFeature(options: ?{ [key: string]: any }) {
  return createFeature(FeatureType.MULTI_POLYGON, options);
}

export function getFeatureCollectionFeatures(options: ?{ [key: string]: any }) {
  return [
    createPointFeature(options),
    createLineStringFeature(options),
    createPolygonFeature(options),
    createMultiPointFeature(options),
    createMultiLineStringFeature(options),
    createMultiPolygonFeature(options)
  ];
}

export function createFeatureCollection(options: ?{ [key: string]: any }) {
  return {
    type: 'FeatureCollection',
    features: getFeatureCollectionFeatures(options)
  };
}

export function getMockFeatureDetails(featureType: string) {
  const featureCollectionIndex = getFeatureCollectionFeatures().findIndex(
    feature => feature.geometry.type === featureType
  );
  const featureDetails = mockFeatures[featureType];
  featureDetails.index = featureCollectionIndex;
  return featureDetails;
}

export function createClickEvent(groundCoords: Position, picks: any[] = []): ClickEvent {
  return {
    screenCoords: [-1, -1],
    groundCoords,
    picks,
    sourceEvent: null
  };
}

export function createPointerDragEvent(
  groundCoords: Position,
  pointerDownGroundCoords: Position,
  picks: any[] = []
): StopDraggingEvent {
  return {
    screenCoords: [-1, -1],
    groundCoords,
    picks,
    isDragging: true,
    pointerDownPicks: null,
    pointerDownScreenCoords: [-1, -1],
    pointerDownGroundCoords,
    sourceEvent: null
  };
}

export function createPointerMoveEvent(
  groundCoords: Position,
  picks: any[] = []
): PointerMoveEvent {
  return {
    screenCoords: [-1, -1],
    groundCoords,
    picks,
    isDragging: false,
    pointerDownPicks: null,
    pointerDownScreenCoords: null,
    pointerDownGroundCoords: null,
    sourceEvent: null
  };
}
