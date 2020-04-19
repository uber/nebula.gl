/* eslint-env jest */

import { Position, FeatureCollection } from '@nebula.gl/edit-modes';
import {
  ModeProps,
  ClickEvent,
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  Pick,
} from '../src/types';

export const FeatureType = {
  POINT: 'Point',
  LINE_STRING: 'LineString',
  POLYGON: 'Polygon',
  MULTI_POINT: 'MultiPoint',
  MULTI_LINE_STRING: 'MultiLineString',
  MULTI_POLYGON: 'MultiPolygon',
};

const mockFeatures = {
  Point: {
    geoJson: {
      type: 'Feature',
      properties: {},
      geometry: { type: 'Point', coordinates: [1, 2] },
    },
    clickCoords: [1, 2],
  },
  LineString: {
    geoJson: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [1, 2],
          [2, 3],
          [3, 4],
        ],
      },
    },
    clickCoords: [1, 2],
  },
  Polygon: {
    geoJson: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          // exterior ring
          [
            [-1, -1],
            [1, -1],
            [1, 1],
            [-1, 1],
            [-1, -1],
          ],
          // hole
          [
            [-0.5, -0.5],
            [-0.5, 0.5],
            [0.5, 0.5],
            [0.5, -0.5],
            [-0.5, -0.5],
          ],
        ],
      },
    },
    clickCoords: [-0.5, -0.5],
  },
  MultiPoint: {
    geoJson: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'MultiPoint',
        coordinates: [
          [1, 2],
          [3, 4],
        ],
      },
    },
    clickCoords: [3, 4],
  },
  MultiLineString: {
    geoJson: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'MultiLineString',
        coordinates: [
          [
            [1, 2],
            [2, 3],
            [3, 4],
          ],
          [
            [5, 6],
            [6, 7],
            [7, 8],
          ],
        ],
      },
    },
    clickCoords: [6, 7],
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
            [
              [-1, -1],
              [1, -1],
              [1, 1],
              [-1, 1],
              [-1, -1],
            ],
            // hole  polygon 1
            [
              [-0.5, -0.5],
              [-0.5, 0.5],
              [0.5, 0.5],
              [0.5, -0.5],
              [-0.5, -0.5],
            ],
          ],
          [
            // exterior ring polygon 2
            [
              [2, -1],
              [4, -1],
              [4, 1],
              [2, 1],
              [2, -1],
            ],
          ],
        ],
      },
    },
    clickCoords: [1, 1],
  },
};

export const featuresForSnappingTests: FeatureCollection = {
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
            [-122.49485401280788, 37.987923255302974],
          ],
        ],
      },
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
            [-122.40814940182412, 37.97528325161274],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [-122.28103267622373, 37.98843664327903],
      },
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
            [-122.40908525092362, 37.85902221692065],
          ],
        ],
      },
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
            [-122.40682264287454, 38.13330760982133],
          ],
        ],
      },
    },
  ],
};

export const mockPickedHandle = {
  featureIndex: 0,
  position: [-122.49485401280788, 37.987923255302974],
  positionIndexes: [0, 0],
  type: 'snap',
};

export const mockNonPickedHandle = {
  featureIndex: 1,
  position: [-122.37737022011595, 37.97528325161274],
  positionIndexes: [0, 1],
  type: 'intermediate',
};

export const mockedGeoJsonProperties = { testString: 'hi', testNumber: 10 };

function createFeature(featureType: string, options?: { [K: string]: any }) {
  const feature = mockFeatures[featureType].geoJson;
  const { mockGeoJsonProperties } = options || {};
  if (mockGeoJsonProperties) {
    feature.properties = mockedGeoJsonProperties;
  }
  return feature;
}

export function createPointFeature(options?: { [K: string]: any }) {
  return createFeature(FeatureType.POINT, options);
}

export function createLineStringFeature(options?: { [K: string]: any }) {
  return createFeature(FeatureType.LINE_STRING, options);
}

export function createPolygonFeature(options?: { [K: string]: any }) {
  return createFeature(FeatureType.POLYGON, options);
}

export function createMultiPointFeature(options?: { [K: string]: any }) {
  return createFeature(FeatureType.MULTI_POINT, options);
}

export function createMultiLineStringFeature(options?: { [K: string]: any }) {
  return createFeature(FeatureType.MULTI_LINE_STRING, options);
}

export function createMultiPolygonFeature(options?: { [K: string]: any }) {
  return createFeature(FeatureType.MULTI_POLYGON, options);
}

export function getFeatureCollectionFeatures(options?: { [K: string]: any }) {
  return [
    createPointFeature(options),
    createLineStringFeature(options),
    createPolygonFeature(options),
    createMultiPointFeature(options),
    createMultiLineStringFeature(options),
    createMultiPolygonFeature(options),
  ];
}

export function createFeatureCollection(options?: { [K: string]: any }) {
  return {
    type: 'FeatureCollection',
    features: getFeatureCollectionFeatures(options),
  };
}

export function getMockFeatureDetails(featureType: string) {
  const featureCollectionIndex = getFeatureCollectionFeatures().findIndex(
    (feature) => feature.geometry.type === featureType
  );
  const featureDetails = mockFeatures[featureType];
  featureDetails.index = featureCollectionIndex;
  return featureDetails;
}

export function createClickEvent(mapCoords: Position, picks: Pick[] = []): ClickEvent {
  return {
    screenCoords: [-1, -1],
    mapCoords,
    picks,
    sourceEvent: null,
  };
}

export function createStartDraggingEvent(
  mapCoords: Position,
  pointerDownMapCoords: Position,
  picks: Pick[] = []
): StartDraggingEvent {
  return {
    screenCoords: [-1, -1],
    mapCoords,
    picks,
    pointerDownPicks: null,
    pointerDownScreenCoords: [-1, -1],
    pointerDownMapCoords,
    cancelPan: jest.fn(),
    sourceEvent: null,
  };
}

export function createStopDraggingEvent(
  mapCoords: Position,
  pointerDownMapCoords: Position,
  picks: Pick[] = []
): StopDraggingEvent {
  return {
    screenCoords: [-1, -1],
    mapCoords,
    picks,
    pointerDownPicks: null,
    pointerDownScreenCoords: [-1, -1],
    pointerDownMapCoords,
    sourceEvent: null,
  };
}

export function createPointerMoveEvent(mapCoords?: Position, picks?: Pick[]): PointerMoveEvent {
  return {
    screenCoords: [-1, -1],
    mapCoords,
    picks: picks || [],
    pointerDownPicks: null,
    pointerDownScreenCoords: null,
    pointerDownMapCoords: null,
    cancelPan: jest.fn(),
    sourceEvent: null,
  };
}

export function createFeatureCollectionProps(
  overrides: Partial<ModeProps<FeatureCollection>> = {}
): ModeProps<FeatureCollection> {
  return {
    // @ts-ignore
    data: createFeatureCollection(),
    selectedIndexes: [],
    // @ts-ignore
    lastPointerMoveEvent: createPointerMoveEvent(),
    modeConfig: null,
    onEdit: jest.fn(),
    onUpdateCursor: jest.fn(),
    ...overrides,
  };
}
