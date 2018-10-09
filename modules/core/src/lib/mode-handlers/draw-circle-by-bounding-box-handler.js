// @flow

import circle from '@turf/circle';
import distance from '@turf/distance';
import type { PointerMoveEvent } from '../event-types.js';
import type { EditAction } from './mode-handler.js';
import { TwoClickPolygonHandler } from './two-click-polygon-handler.js';
import { getIntermediatePosition } from './mode-handler.js';

export class DrawCircleByBoundingBoxHandler extends TwoClickPolygonHandler {
  handlePointerMove(event: PointerMoveEvent): { editAction: ?EditAction, cancelMapPan: boolean } {
    const result = { editAction: null, cancelMapPan: false };
    const clickSequence = this.getClickSequence();

    if (clickSequence.length === 0) {
      // nothing to do yet
      return result;
    }

    const modeConfig = this.getModeConfig();
    let { options = {} } = modeConfig;
    if (options.steps < 16) {
      console.warn(`Minimum steps to draw a circle is 16 `); // eslint-disable-line no-console,no-undef
      options = {
        ...options,
        steps: 16
      };
    }
    const firstClickedPoint = clickSequence[0];
    const centerCoordinates = getIntermediatePosition(firstClickedPoint, event.groundCoords);
    const radius = Math.max(distance(firstClickedPoint, centerCoordinates), 0.001);
    this._setTentativeFeature(circle(centerCoordinates, radius, options));

    return result;
  }
}
