// @flow
import type { PointerMoveEvent, StopDraggingEvent } from '../event-types.js';
import type { Position } from '../geojson-types.js';
import type { EditAction } from './mode-handler.js';
import { getPickedEditHandle } from './mode-handler.js';
import { ModifyHandler } from './modify-handler.js';

export class ElevationHandler extends ModifyHandler {
  makeElevatedEvent(event: PointerMoveEvent | StopDraggingEvent, position: Position): Object {
    const { min = 0, max = 20000 } = this._modeConfig || {};

    const [, yBot] = this._context.viewport.project([position[0], position[1], 0]);
    const [, yTop] = this._context.viewport.project([position[0], position[1], 1000]);
    const [, y] = event.screenCoords;

    let elevation = ((yBot - y) * 1000.0) / (yBot - yTop);
    elevation = Math.min(elevation, max);
    elevation = Math.max(elevation, min);

    return Object.assign({}, event, {
      groundCoords: [position[0], position[1], elevation]
    });
  }

  handlePointerMove(event: PointerMoveEvent): { editAction: ?EditAction, cancelMapPan: boolean } {
    const editHandle = getPickedEditHandle(event.pointerDownPicks);
    const position = editHandle ? editHandle.position : event.groundCoords;
    return super.handlePointerMove(this.makeElevatedEvent(event, position));
  }

  handleStopDragging(event: StopDraggingEvent): ?EditAction {
    const editHandle = getPickedEditHandle(event.picks);
    const position = editHandle ? editHandle.position : event.groundCoords;
    return super.handleStopDragging(this.makeElevatedEvent(event, position));
  }

  getCursor(params: { isDragging: boolean }): string {
    let cursor = super.getCursor(params);
    if (cursor === 'cell') {
      cursor = 'ns-resize';
    }
    return cursor;
  }
}
