// @flow

import circle from '@turf/circle';
import distance from '@turf/distance';
import type { PointerMoveEvent } from '../types.js';
import { type GeoJsonEditAction } from './geojson-edit-mode.js';
import { TwoClickPolygonMode } from './two-click-polygon-mode.js';

export class DrawCircleFromCenterMode extends TwoClickPolygonMode {
  handlePointerMoveAdapter(
    event: PointerMoveEvent
  ): { editAction: ?GeoJsonEditAction, cancelMapPan: boolean } {
    const result = { editAction: null, cancelMapPan: false };
    const clickSequence = this.getClickSequence();

    if (clickSequence.length === 0) {
      // nothing to do yet
      return result;
    }

    const modeConfig = this.getModeConfig() || {};
    // Default turf value for circle is 64
    const { steps = 64 } = modeConfig;
    const options = { steps };

    if (steps < 4) {
      console.warn(`Minimum steps to draw a circle is 4 `); // eslint-disable-line no-console,no-undef
      options.steps = 4;
    }

    const centerCoordinates = clickSequence[0];
    const radius = Math.max(distance(centerCoordinates, event.mapCoords), 0.001);
    this._setTentativeFeature(circle(centerCoordinates, radius, options));

    return result;
  }
}
