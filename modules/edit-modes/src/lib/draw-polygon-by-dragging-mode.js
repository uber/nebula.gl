// @flow

import throttle from 'lodash.throttle';
import type {
  ClickEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  DraggingEvent,
  ModeProps
} from '../types.js';
import type { Polygon, FeatureCollection } from '../geojson-types.js';
import { getPickedEditHandle } from '../utils.js';
import { DrawPolygonMode } from './draw-polygon-mode';

type DraggingHandler = (event: DraggingEvent, props: ModeProps<FeatureCollection>) => void;

export class DrawPolygonByDraggingMode extends DrawPolygonMode {
  handleDraggingThrottled: ?DraggingHandler = null;

  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
    // No-op
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

    if (this.handleDraggingThrottled && this.handleDraggingThrottled.cancel) {
      this.handleDraggingThrottled.cancel();
    }

    if (clickSequence.length > 2) {
      // Complete the polygon.
      const polygonToAdd: Polygon = {
        type: 'Polygon',
        coordinates: [[...clickSequence, clickSequence[0]]]
      };

      this.resetClickSequence();

      const editAction = this.getAddFeatureOrBooleanPolygonAction(polygonToAdd, props);
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
