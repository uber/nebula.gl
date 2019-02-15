// @flow
import { TranslateHandler } from '../../../lib/mode-handlers/translate-handler';
import type { FeatureCollection } from '../../../geojson-types.js';
import { createFeatureCollection } from '../test-utils.js';

import {
  testModeHandlerHandlePointMove,
  testHandleStartDragging,
  testHandleStopDragging
} from './mode-handler-utils';

const modeName = 'translate';
const featureCollection: FeatureCollection = createFeatureCollection();

testModeHandlerHandlePointMove(modeName, TranslateHandler, featureCollection, '_isTranslatable');

testHandleStartDragging(
  modeName,
  TranslateHandler,
  featureCollection,
  '_isTranslatable',
  handler => handler._geometryBeforeTranslate
);

testHandleStopDragging(modeName, TranslateHandler, featureCollection);
