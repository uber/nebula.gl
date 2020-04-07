import { Position } from '@nebula.gl/edit-modes';
import { PointerMoveEvent, StopDraggingEvent } from '../event-types';
import { EditAction, getPickedEditHandle } from './mode-handler';

import { ModifyHandler } from './modify-handler';

function defaultCalculateElevationChange({
  pointerDownScreenCoords,
  screenCoords,
}: {
  pointerDownScreenCoords: Position;
  screenCoords: Position;
}) {
  return 10 * (pointerDownScreenCoords[1] - screenCoords[1]);
}

// TODO edit-modes: delete handlers once EditMode fully implemented
export class ElevationHandler extends ModifyHandler {
  makeElevatedEvent(
    event: PointerMoveEvent | StopDraggingEvent,
    position: Position
  ): Record<string, any> {
    if (!event.pointerDownScreenCoords) {
      return event;
    }

    const {
      minElevation = 0,
      maxElevation = 20000,
      calculateElevationChange = defaultCalculateElevationChange,
    } = this._modeConfig || {};

    // $FlowFixMe - really, I know it has something at index 2
    let elevation = position.length === 3 ? position[2] : 0;

    // calculateElevationChange is configurable becase (at this time) modes are not aware of the viewport
    elevation += calculateElevationChange({
      pointerDownScreenCoords: event.pointerDownScreenCoords,
      screenCoords: event.screenCoords,
    });
    elevation = Math.min(elevation, maxElevation);
    elevation = Math.max(elevation, minElevation);

    return Object.assign({}, event, {
      groundCoords: [position[0], position[1], elevation],
    });
  }

  handlePointerMove(
    event: PointerMoveEvent
  ): { editAction: EditAction | null | undefined; cancelMapPan: boolean } {
    const editHandle = getPickedEditHandle(event.pointerDownPicks);
    const position = editHandle ? editHandle.position : event.groundCoords;
    // @ts-ignore
    return super.handlePointerMove(this.makeElevatedEvent(event, position));
  }

  handleStopDragging(event: StopDraggingEvent): EditAction | null | undefined {
    const editHandle = getPickedEditHandle(event.picks);
    const position = editHandle ? editHandle.position : event.groundCoords;
    // @ts-ignore
    return super.handleStopDragging(this.makeElevatedEvent(event, position));
  }

  getCursor(params: { isDragging: boolean }): string {
    let cursor = super.getCursor(params);
    if (cursor === 'cell') {
      cursor = 'ns-resize';
    }
    return cursor;
  }

  static calculateElevationChangeWithViewport(
    viewport: any,
    {
      pointerDownScreenCoords,
      screenCoords,
    }: {
      pointerDownScreenCoords: Position;
      screenCoords: Position;
    }
  ): number {
    // Source: https://gis.stackexchange.com/a/127949/111804
    const metersPerPixel =
      (156543.03392 * Math.cos((viewport.latitude * Math.PI) / 180)) / Math.pow(2, viewport.zoom);

    return (metersPerPixel * (pointerDownScreenCoords[1] - screenCoords[1])) / 2;
  }
}
