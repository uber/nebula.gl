// @flow

import type { FeatureCollection } from '@nebula.gl/geojson-modes';
import { TranslateHandler } from '../../../src/mode-handlers/translate-handler';
import { createFeatureCollection } from '../test-utils.js';

import {
  testModeHandlerHandlePointMove,
  testHandleStartDragging,
  testHandleStopDragging
} from './mode-handler-utils.js';

const modeName = 'translate';
const featureCollection: FeatureCollection = createFeatureCollection({
  mockGeoJsonProperties: true
});

testModeHandlerHandlePointMove(modeName, TranslateHandler, featureCollection, '_isTranslatable');

testHandleStartDragging(
  modeName,
  TranslateHandler,
  featureCollection,
  '_isTranslatable',
  '_geometryBeforeTranslate'
);

testHandleStopDragging(modeName, TranslateHandler, featureCollection);
