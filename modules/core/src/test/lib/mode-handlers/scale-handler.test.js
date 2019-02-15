// @flow
import { ScaleHandler } from '../../../lib/mode-handlers/scale-handler';
import type { FeatureCollection } from '../../../geojson-types.js';
import { FeatureType, createFeatureCollection } from '../test-utils.js';

import {
  testModeHandlerHandlePointMove,
  testHandleStartDragging,
  testHandleStopDragging
} from './mode-handler-utils';

const modeName = 'scale';
const featureCollection: FeatureCollection = createFeatureCollection();

testModeHandlerHandlePointMove(modeName, ScaleHandler, featureCollection, '_isScalable');

testHandleStartDragging(
  modeName,
  ScaleHandler,
  featureCollection,
  '_isScalable',
  handler => handler._geometryBeingScaled
);

// Point features by nature cannot scale
testHandleStopDragging(
  modeName,
  ScaleHandler,
  featureCollection,
  featureType => ![FeatureType.POINT].includes(featureType)
);
