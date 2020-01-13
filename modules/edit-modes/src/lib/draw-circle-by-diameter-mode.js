// @flow

import circle from '@turf/circle';
import distance from '@turf/distance';
import type { Position, Polygon, FeatureOf } from '../geojson-types.js';
import { getIntermediatePosition } from './geojson-edit-mode.js';
import { TwoClickPolygonMode } from './two-click-polygon-mode.js';

export class DrawCircleByDiameterMode extends TwoClickPolygonMode {
  getTwoClickPolygon(coord1: Position, coord2: Position, modeConfig: any): FeatureOf<Polygon> {
    // Default turf value for circle is 64
    const { steps = 64 } = modeConfig || {};
    const options = { steps };

    if (steps < 4) {
      console.warn(`Minimum steps to draw a circle is 4 `); // eslint-disable-line no-console,no-undef
      options.steps = 4;
    }

    const centerCoordinates = getIntermediatePosition(coord1, coord2);
    const radius = Math.max(distance(coord1, centerCoordinates), 0.001);

    return circle(centerCoordinates, radius, options);
  }
}
