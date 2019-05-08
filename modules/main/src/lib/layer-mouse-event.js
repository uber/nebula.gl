// @flow
import type { Position } from 'geojson-types';

export default class LayerMouseEvent {
  canceled: boolean;
  // original item that this event is related to
  data: Object;
  // internal nebula info about the object
  metadata: Object;
  // the mouse [lng,lat] raycasted onto the ground
  groundPoint: Position;
  // browser event
  nativeEvent: MouseEvent;
  // reference to nebula
  nebula: Object;

  constructor(nativeEvent: MouseEvent, { data, groundPoint, nebula, metadata }: Object) {
    this.nativeEvent = nativeEvent;

    this.data = data;
    this.groundPoint = groundPoint;
    this.nebula = nebula;
    this.metadata = metadata;
  }

  stopPropagation() {
    this.nativeEvent.stopPropagation();
    this.canceled = true;
  }
}
