// @flow

import bboxPolygon from '@turf/bbox-polygon';
import type { PointerMoveEvent } from '../event-types.js';
import type { EditAction, EditContext } from '../editable-feature-collection.js';
import { TwoClickPolygon } from './two-click-polygon.js';

export class DrawRectangleHandler extends TwoClickPolygon {
  handlePointerMove(
    event: PointerMoveEvent,
    editContext: EditContext
  ): { editAction: ?EditAction, cancelMapPan: boolean } {
    const result = { editAction: null, cancelMapPan: false };
    if (this._clickSequence.length === 0) {
      // nothing to do yet
      return result;
    }

    const corner1 = this._clickSequence[0];
    const corner2 = event.groundCoords;
    editContext.tentativeFeature = bboxPolygon([corner1[0], corner1[1], corner2[0], corner2[1]]);

    return result;
  }
}
