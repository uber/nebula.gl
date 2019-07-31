// @flow

import type { Feature, FeatureCollection, Position } from '@nebula.gl/edit-modes';
import type { PointerMoveEvent, StartDraggingEvent, StopDraggingEvent } from '../event-types.js';
import type { EditHandle, EditAction } from './mode-handler.js';
import { ModeHandler, getPickedEditHandle, getEditHandlesForGeometry } from './mode-handler.js';

type HandlePicks = { pickedHandle?: EditHandle, potentialSnapHandle?: EditHandle };

// TODO edit-modes: delete handlers once EditMode fully implemented
export class SnappableHandler extends ModeHandler {
  _handler: ModeHandler;
  _editHandlePicks: ?HandlePicks;
  _startDragSnapHandlePosition: Position;
  _isSnapped: boolean;

  constructor(handler: ModeHandler) {
    super();
    this._handler = handler;
  }

  setFeatureCollection(featureCollection: FeatureCollection): void {
    this._handler.setFeatureCollection(featureCollection);
  }

  setModeConfig(modeConfig: any): void {
    this._modeConfig = modeConfig;
    this._handler.setModeConfig(modeConfig);
  }

  setSelectedFeatureIndexes(indexes: number[]): void {
    this._handler.setSelectedFeatureIndexes(indexes);
  }

  _getSnappedMouseEvent(event: Object, snapPoint: Position): PointerMoveEvent {
    return Object.assign({}, event, {
      groundCoords: snapPoint,
      pointerDownGroundCoords: this._startDragSnapHandlePosition
    });
  }

  _getEditHandlePicks(event: PointerMoveEvent): HandlePicks {
    const { picks } = event;

    const potentialSnapHandle = picks.find(
      pick => pick.object && pick.object.type === 'intermediate'
    );
    const handles = { potentialSnapHandle: potentialSnapHandle && potentialSnapHandle.object };

    const pickedHandle = getPickedEditHandle(event.pointerDownPicks);
    if (pickedHandle) {
      return { ...handles, pickedHandle };
    }

    return handles;
  }

  _updatePickedHandlePosition(editAction: EditAction) {
    const { pickedHandle } = this._editHandlePicks || {};

    if (pickedHandle && editAction) {
      const { featureIndexes, updatedData } = editAction;

      for (let i = 0; i < featureIndexes.length; i++) {
        const selectedIndex = featureIndexes[i];
        const updatedFeature = updatedData.features[selectedIndex];

        const { positionIndexes, featureIndex } = pickedHandle;
        if (selectedIndex >= 0 && featureIndex === selectedIndex) {
          const { coordinates } = updatedFeature.geometry;
          // $FlowFixMe
          pickedHandle.position = positionIndexes.reduce(
            (a: any[], b: number) => a[b],
            coordinates
          );
        }
      }
    }
  }

  // If additionalSnapTargets is present in modeConfig and is populated, this
  // method will return those features along with the features
  // that live in the current layer. Otherwise, this method will simply return the
  // features from the current layer
  _getSnapTargets(): Feature[] {
    let { additionalSnapTargets } = this.getModeConfig() || {};
    additionalSnapTargets = additionalSnapTargets || [];

    const features = [
      ...this._handler.featureCollection.getObject().features,
      ...additionalSnapTargets
    ];
    return features;
  }

  _getNonPickedIntermediateHandles(): EditHandle[] {
    const handles = [];
    const features = this._getSnapTargets();

    for (let i = 0; i < features.length; i++) {
      // Filter out the currently selected feature(s)
      const isCurrentIndexFeatureNotSelected =
        i < features.length && !this._handler.getSelectedFeatureIndexes().includes(i);

      if (isCurrentIndexFeatureNotSelected) {
        const { geometry } = features[i];
        handles.push(...getEditHandlesForGeometry(geometry, i, 'intermediate'));
      }
    }
    return handles;
  }

  // If no snap handle has been picked, only display the edit handles of the
  // selected feature. If a snap handle has been picked, display said snap handle
  // along with all snappable points on all non-selected features.
  getEditHandles(picks?: Array<Object>, groundCoords?: Position): any[] {
    const { enableSnapping } = this._modeConfig || {};
    const handles = this._handler.getEditHandles(picks, groundCoords);

    if (!enableSnapping) return handles;
    const { pickedHandle } = this._editHandlePicks || {};

    if (pickedHandle) {
      handles.push(...this._getNonPickedIntermediateHandles(), pickedHandle);
      return handles;
    }

    const { features } = this._handler.featureCollection.getObject();
    for (const index of this._handler.getSelectedFeatureIndexes()) {
      if (index < features.length) {
        const { geometry } = features[index];
        handles.push(...getEditHandlesForGeometry(geometry, index, 'snap'));
      }
    }

    return handles.filter(Boolean);
  }

  _performSnapIfRequired() {
    if (this._isSnapped) return;
    const { pickedHandle, potentialSnapHandle } = this._editHandlePicks || {};
    if (pickedHandle && potentialSnapHandle) {
      this._isSnapped = true;
    }
  }

  // Unsnapping only occurs after the user snaps two polygons but continues to drag the
  // cursor past the point of resistance.
  _performUnsnapIfRequired() {
    if (!this._isSnapped) return;

    const { potentialSnapHandle } = this._editHandlePicks || {};
    if (!potentialSnapHandle) {
      this._isSnapped = false;
    }
  }

  _getSnapAwareEvent(event: Object): Object {
    const { potentialSnapHandle } = this._editHandlePicks || {};

    return potentialSnapHandle && potentialSnapHandle.position
      ? this._getSnappedMouseEvent(event, potentialSnapHandle.position)
      : event;
  }

  handleStartDragging(event: StartDraggingEvent): ?EditAction {
    this._startDragSnapHandlePosition = (getPickedEditHandle(event.picks) || {}).position;
    return this._handler.handleStartDragging(event);
  }

  handleStopDragging(event: StopDraggingEvent): ?EditAction {
    const modeActionSummary = this._handler.handleStopDragging(this._getSnapAwareEvent(event));

    this._editHandlePicks = null;
    this._isSnapped = false;
    return modeActionSummary;
  }

  getCursor(event: { isDragging: boolean }): string {
    return this._handler.getCursor(event);
  }

  handlePointerMove(event: PointerMoveEvent): { editAction: ?EditAction, cancelMapPan: boolean } {
    const { enableSnapping } = this._handler.getModeConfig() || {};

    if (enableSnapping) {
      this._editHandlePicks = this._getEditHandlePicks(event);
      if (this._editHandlePicks) {
        this._performSnapIfRequired();
        this._performUnsnapIfRequired();
      }
    }

    const modeActionSummary = this._handler.handlePointerMove(this._getSnapAwareEvent(event));
    const { editAction } = modeActionSummary;
    if (editAction) {
      this._updatePickedHandlePosition(editAction);
    }

    return modeActionSummary;
  }
}
