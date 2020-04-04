import bboxPolygon from '@turf/bbox-polygon';
import { PointerMoveEvent } from '../event-types';
import { EditAction } from './mode-handler';
import { TwoClickPolygonHandler } from './two-click-polygon-handler';

// TODO edit-modes: delete handlers once EditMode fully implemented
export class DrawRectangleHandler extends TwoClickPolygonHandler {
  handlePointerMove(
    event: PointerMoveEvent
  ): { editAction: EditAction | null | undefined; cancelMapPan: boolean } {
    const result = { editAction: null, cancelMapPan: false };
    const clickSequence = this.getClickSequence();

    if (clickSequence.length === 0) {
      // nothing to do yet
      return result;
    }

    const corner1 = clickSequence[0];
    const corner2 = event.groundCoords;
    // @ts-ignore
    this._setTentativeFeature(bboxPolygon([corner1[0], corner1[1], corner2[0], corner2[1]]));

    return result;
  }
}
