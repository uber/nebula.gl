// @flow

import circle from '@turf/circle';
import distance from '@turf/distance';
import type { PointerMoveEvent } from '../event-types.js';
import type { EditAction } from './mode-handler.js';
import { TwoClickPolygonHandler } from './two-click-polygon-handler.js';

export class DrawCircleFromCenterHandler extends TwoClickPolygonHandler {
  handlePointerMove(event: PointerMoveEvent): { editAction: ?EditAction, cancelMapPan: boolean } {
    const result = { editAction: null, cancelMapPan: false };
    const clickSequence = this.getClickSequence();

    if (clickSequence.length === 0) {
      // nothing to do yet
      return result;
    }

    const centerCoordinates = clickSequence[0];
    const radius = Math.max(distance(centerCoordinates, event.groundCoords), 0.001);
    this._setTentativeFeature(circle(centerCoordinates, radius));

    return result;
  }
}
