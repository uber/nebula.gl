// @flow

import type { StartDraggingEvent, StopDraggingEvent, ModeProps } from '../types.js';
import type { Polygon, FeatureCollection } from '../geojson-types.js';
import { getPickedEditHandle } from '../utils.js';
import { DrawPolygonMode } from './draw-polygon-mode';
import throttle from 'lodash.throttle';

export class DrawPolygonByDraggingMode extends DrawPolygonMode {
  handleClick() {
    // No-op
  }

  handleStartDragging(event: StartDraggingEvent) {
    this.isDragging = true;
    event.cancelPan();
  }

  handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>) {
    this.addClickSequence(event);
    const clickSequence = this.getClickSequence();

    if (clickSequence.length > 2) {
      // Complete the polygon.
      const polygonToAdd: Polygon = {
        type: 'Polygon',
        coordinates: [[...clickSequence, clickSequence[0]]]
      };

      this.resetClickSequence();
      this.isDragging = false;

      const editAction = this.getAddFeatureOrBooleanPolygonAction(polygonToAdd, props);
      if (editAction) {
        props.onEdit(editAction);
      }
    }
  }

  handleDraggingAux(event: DraggingEvent) {
    const { picks } = event;
    const clickedEditHandle = getPickedEditHandle(picks);

    if (!clickedEditHandle && this.isDragging) {
      // Don't add another point right next to an existing one.
      // Also ensure that dragging has not yet ended,
      // since the function call may have been delayed due to throttling.
      this.addClickSequence(event);
    }
  }

  handleDragging(event: DraggingEvent, props: ModeProps<FeatureCollection>) {
    // If the drag handler has not yet been bound,
    // check the throttle config option and then bind it.
    if (!this.handleDraggingBound) {
      if (props.modeConfig && props.modeConfig.throttleMs) {
        this.handleDraggingBound = throttle(this.handleDraggingAux, props.modeConfig.throttleMs);
      } else {
        this.handleDraggingBound = this.handleDraggingAux;
      }
    }
    this.handleDraggingBound(event);
  }
}
