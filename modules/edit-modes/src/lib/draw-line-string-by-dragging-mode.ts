import throttle from 'lodash.throttle';
import { DebouncedFunc } from 'lodash';
import {
  ClickEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  DraggingEvent,
  ModeProps,
} from '../types';
import { LineString, FeatureCollection } from '../geojson-types';
import { getPickedEditHandle } from '../utils';
import { DrawLineStringMode } from './draw-line-string-mode';

type DragHandler = (event: DraggingEvent, props: ModeProps<FeatureCollection>) => void;

type ThrottledDragHandler = DebouncedFunc<DragHandler>;

export class DrawLineStringByDraggingMode extends DrawLineStringMode {
  handleDraggingThrottled: ThrottledDragHandler | DragHandler | null | undefined = null;

  // Override the default behavior of DrawLineStringMode to not add a point when the user clicks on the map
  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
    return;
  }

  handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>) {
    event.cancelPan();
    if (props.modeConfig && props.modeConfig.throttleMs) {
      this.handleDraggingThrottled = throttle(this.handleDraggingAux, props.modeConfig.throttleMs);
    } else {
      this.handleDraggingThrottled = this.handleDraggingAux;
    }
  }

  handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>) {
    this.addClickSequence(event);
    const clickSequence = this.getClickSequence();
    if (this.handleDraggingThrottled && 'cancel' in this.handleDraggingThrottled) {
      this.handleDraggingThrottled.cancel();
    }

    if (clickSequence.length > 2) {
      const lineStringToAdd: LineString = {
        type: 'LineString',
        coordinates: clickSequence,
      };

      this.resetClickSequence();

      const editAction = this.getAddFeatureAction(lineStringToAdd, props.data);
      if (editAction) {
        props.onEdit(editAction);
      }
    }
  }

  handleDraggingAux(event: DraggingEvent, props: ModeProps<FeatureCollection>) {
    const { picks } = event;
    const clickedEditHandle = getPickedEditHandle(picks);

    if (!clickedEditHandle) {
      // Don't add another point right next to an existing one.
      this.addClickSequence(event);
    }
  }

  handleDragging(event: DraggingEvent, props: ModeProps<FeatureCollection>) {
    if (this.handleDraggingThrottled) {
      this.handleDraggingThrottled(event, props);
    }
  }
}
