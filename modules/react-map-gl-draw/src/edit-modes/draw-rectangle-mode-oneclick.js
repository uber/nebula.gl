// @flow

import type {
  FeatureCollection,
  StartDraggingEvent,
  StopDraggingEvent
} from '@nebula.gl/edit-modes';
import type { ModeProps } from '../types';

import DrawRectangleMode from './draw-rectangle-mode';

export default class DrawRectangleModeOneclick extends DrawRectangleMode {
  handleStartDragging = (event: StartDraggingEvent, props: ModeProps<FeatureCollection>) => {
    const tentativeFeature = this.getTentativeFeature();
    if (!tentativeFeature) {
      this._initTentativeFeature(event, props);
    }
  };

  handleStopDragging = (event: StopDraggingEvent, props: ModeProps<FeatureCollection>) => {
    const tentativeFeature = this.getTentativeFeature();
    if (tentativeFeature) {
      this._commitTentativeFeature(event, props);
    }
  };

  handlePan = (event: StartDraggingEvent, props: ModeProps<FeatureCollection>) => {
    const tentativeFeature = this.getTentativeFeature();
    if (tentativeFeature) {
      event.sourceEvent.stopImmediatePropagation();
    }
  };
}
