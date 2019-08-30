// @flow

import bboxPolygon from '@turf/bbox-polygon';
import type { PointerMoveEvent } from '../types.js';
import { type GeoJsonEditAction } from './geojson-edit-mode.js';
import { TwoClickPolygonMode } from './two-click-polygon-mode.js';

export class DrawRectangleMode extends TwoClickPolygonMode {
  handlePointerMoveAdapter(
    event: PointerMoveEvent
  ): { editAction: ?GeoJsonEditAction, cancelMapPan: boolean } {
    const result = { editAction: null, cancelMapPan: false };
    const clickSequence = this.getClickSequence();

    if (clickSequence.length === 0) {
      // nothing to do yet
      return result;
    }

    const corner1 = clickSequence[0];
    const corner2 = event.mapCoords;
    this._setTentativeFeature(bboxPolygon([corner1[0], corner1[1], corner2[0], corner2[1]]));

    return result;
  }
}
