import { ModeProps, PointerMoveEvent, StopDraggingEvent } from '../types';
import { Position, FeatureCollection } from '../geojson-types';
import { getPickedEditHandle } from '../utils';
import { ModifyMode } from './modify-mode';

function defaultCalculateElevationChange({
  pointerDownScreenCoords,
  screenCoords,
}: {
  pointerDownScreenCoords: Position;
  screenCoords: Position;
}) {
  return 10 * (pointerDownScreenCoords[1] - screenCoords[1]);
}

export class ElevationMode extends ModifyMode {
  makeElevatedEvent(
    event: PointerMoveEvent | StopDraggingEvent,
    position: Position,
    props: ModeProps<FeatureCollection>
  ): Record<string, any> {
    const {
      minElevation = 0,
      maxElevation = 20000,
      calculateElevationChange = defaultCalculateElevationChange,
    } = props.modeConfig || {};

    if (!event.pointerDownScreenCoords) {
      return event;
    }

    // $FlowFixMe - really, I know it has something at index 2
    let elevation = position.length === 3 ? position[2] : 0;

    // calculateElevationChange is configurable because (at this time) modes are not aware of the viewport
    elevation += calculateElevationChange({
      pointerDownScreenCoords: event.pointerDownScreenCoords,
      screenCoords: event.screenCoords,
    });
    elevation = Math.min(elevation, maxElevation);
    elevation = Math.max(elevation, minElevation);

    return Object.assign({}, event, {
      mapCoords: [position[0], position[1], elevation],
    });
  }

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>) {
    const editHandle = getPickedEditHandle(event.pointerDownPicks);
    const position = editHandle ? editHandle.geometry.coordinates : event.mapCoords;
    // @ts-ignore
    super.handlePointerMove(this.makeElevatedEvent(event, position, props), props);
  }

  handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>) {
    const editHandle = getPickedEditHandle(event.picks);
    const position = editHandle ? editHandle.geometry.coordinates : event.mapCoords;
    // @ts-ignore
    super.handleStopDragging(this.makeElevatedEvent(event, position, props), props);
  }

  getCursor(event: PointerMoveEvent): string | null | undefined {
    let cursor = super.getCursor(event);
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
