// @flow

import { featureCollection } from '@turf/helpers';
import { getPickedEditHandle } from '../utils';
import type {
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  DraggingEvent,
  ModeProps
} from '../types.js';
import type { FeatureCollection } from '../geojson-types.js';
import { BaseGeoJsonEditMode } from './geojson-edit-mode';
import { TranslateMode } from './translate-mode';
import { ScaleMode } from './scale-mode';
import { RotateMode } from './rotate-mode';

export class TransformMode extends BaseGeoJsonEditMode {
  _transformMode: ?string;
  _editModes: Object = {
    scale: new ScaleMode({ isCompositionMode: true }),
    rotate: new RotateMode({ isCompositionMode: true }),
    translate: new TranslateMode({ isCompositionMode: true })
  };

  getGuides(props: ModeProps<FeatureCollection>) {
    const { rotate, scale } = this._editModes;
    const scaleGuides = rotate.getIsRotating() ? [] : scale.getGuides(props).features;
    const rotateGuides = rotate
      .getGuides(props)
      .features.filter(feature => feature.geometry.type !== 'Polygon');

    return featureCollection([...scaleGuides, ...rotateGuides]);
  }

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>) {
    let isCursorUpdated = false;
    Object.values(this._editModes).forEach(mode => {
      if (!mode) {
        return;
      }

      if (typeof mode.handlePointerMove === 'function') {
        mode.handlePointerMove(event, props);
      }
      if (typeof mode.updateCursor === 'function') {
        if (!isCursorUpdated) {
          isCursorUpdated = mode.updateCursor(props);
        }
      }
    });

    if (!isCursorUpdated) {
      props.onUpdateCursor(null);
    }
  }

  handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>) {
    const { picks, pointerDownPicks } = event;
    const editHandle = getPickedEditHandle(picks);
    if (editHandle) {
      this._transformMode = editHandle.properties.editHandleType;
    } else if (this.isSelectionPicked(pointerDownPicks || picks, props)) {
      this._transformMode = 'translate';
    } else {
      this._transformMode = null;
    }

    const transformMode = this._editModes[this._transformMode];
    if (transformMode) {
      transformMode.handleStartDragging(event, props);
    }
  }

  handleDragging(event: DraggingEvent, props: ModeProps<FeatureCollection>) {
    const transformMode = this._editModes[this._transformMode || ''];
    if (transformMode) {
      transformMode.handleDragging(event, props);
    }
  }

  handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>) {
    const transformMode = this._editModes[this._transformMode || ''];
    if (transformMode) {
      transformMode.handleStopDragging(event, props);
    }
    this._transformMode = null;
  }
}
