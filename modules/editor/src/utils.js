// @flow
import uuid from 'uuid/v4';
// import type { GeoJsonFeature } from './types.js';

export const NEW_PREFIX = '__NEW__';

export function newFeatureId(): string {
  return `${NEW_PREFIX}${uuid()}`;
}
