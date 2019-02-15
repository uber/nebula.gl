// @flow
import { RotateHandler } from '../../../lib/mode-handlers/rotate-handler';
import type { FeatureCollection } from '../../../geojson-types.js';
import { FeatureType, createFeatureCollection } from '../test-utils.js';

import {
  testModeHandlerHandlePointMove,
  testHandleStartDragging,
  testHandleStopDragging
} from './mode-handler-utils';

const modeName = 'rotate';
const featureCollection: FeatureCollection = createFeatureCollection();

testModeHandlerHandlePointMove(modeName, RotateHandler, featureCollection, '_isRotatable');

testHandleStartDragging(
  modeName,
  RotateHandler,
  featureCollection,
  '_isRotatable',
  handler => handler._geometryBeingRotated
);

// Rotating a point feature will not change coordinates
testHandleStopDragging(
  modeName,
  RotateHandler,
  featureCollection,
  featureType => ![FeatureType.POINT].includes(featureType)
);
