// @flow
import { ScaleHandler } from '../../../src/mode-handlers/scale-handler';
import type { FeatureCollection } from '../../../src/geojson-types.js';
import { FeatureType, createFeatureCollection } from '../test-utils.js';

import {
  testModeHandlerHandlePointMove,
  testHandleStartDragging,
  testHandleStopDragging
} from './mode-handler-utils.js';

const modeName = 'scale';
const featureCollection: FeatureCollection = createFeatureCollection({
  mockGeoJsonProperties: true
});

testModeHandlerHandlePointMove(modeName, ScaleHandler, featureCollection, '_isScalable');

testHandleStartDragging(
  modeName,
  ScaleHandler,
  featureCollection,
  '_isScalable',
  '_geometryBeingScaled'
);

// Point features by nature cannot scale
testHandleStopDragging(
  modeName,
  ScaleHandler,
  featureCollection,
  featureType => ![FeatureType.POINT].includes(featureType)
);
