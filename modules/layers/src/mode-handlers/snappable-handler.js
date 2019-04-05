// @flow

import type { FeatureCollection, Position } from '../geojson-types.js';
import type { PointerMoveEvent, StartDraggingEvent, StopDraggingEvent } from '../event-types.js';
import type { EditHandle, EditAction } from './mode-handler.js';
import { ModeHandler, getPickedEditHandle, getEditHandlesForGeometry } from './mode-handler';

const DEFAULT_SNAP_PIXELS = 5;

type HandlePicks = { pickedHandle?: EditHandle, potentialSnapHandle?: EditHandle };

export class SnappableHandler extends ModeHandler {
  _handler: ModeHandler;
  _editHandlePicks: ?HandlePicks;
  _isSnapped: boolean;

  constructor(handler: ModeHandler) {
    super();
    this._handler = handler;
  }

  setFeatureCollection(featureCollection: FeatureCollection): void {
    this._handler.setFeatureCollection(featureCollection);
  }

  setModeConfig(modeConfig: any): void {
    this._handler.setModeConfig(modeConfig);
  }

  setSelectedFeatureIndexes(indexes: number[]): void {
    this._handler.setSelectedFeatureIndexes(indexes);
  }

  setDeckGlContext(context: Object) {
    this._handler.setDeckGlContext(context);
  }

  _getSnappedMouseEvent(event: Object, snapPoint: Position): PointerMoveEvent {
    const snapPointScreenCoords = this._handler._context.viewport.project(snapPoint);
    event.groundCoords = snapPoint;
    event.screenCoords = snapPointScreenCoords;

    return event;
  }

  _getEditHandlePicks(event: PointerMoveEvent): HandlePicks {
    const { screenCoords } = event;
    const { snapPixels } = this._handler.getModeConfig() || {};

    const picks = this._handler._context.layerManager.pickObject({
      x: screenCoords[0],
      y: screenCoords[1],
      mode: 'query',
      layerIds: ['geojson-point-edit-handles'],
      radius: snapPixels || DEFAULT_SNAP_PIXELS,
      viewports: [this._handler._context.viewport],
      depth: 2
    });

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
        if (selectedIndex >= 0 && featureIndex !== selectedIndex) return;

        const { coordinates } = updatedFeature.geometry;
        // $FlowFixMe
        (pickedHandle || {}).position = positionIndexes.reduce(
          (a: any[], b: number) => a[b],
          coordinates
        );
      }
    }
  }

  _getNonPickedIntermediateHandles(): EditHandle[] {
    const handles = [];
    const { features } = this._handler.featureCollection.getObject();

    for (let i = 0; i < features.length; i++) {
      if (!this._handler.getSelectedFeatureIndexes().includes(i) && i < features.length) {
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
    const { enableSnapping } = this._handler.getModeConfig() || {};
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

  _shouldPerformSnap() {
    if (!this._editHandlePicks) return false;
    const { pickedHandle, potentialSnapHandle } = this._editHandlePicks || {};
    return pickedHandle && potentialSnapHandle;
  }

  _performSnapIfRequired() {
    if (this._isSnapped || !this._editHandlePicks || !this._shouldPerformSnap()) return;
    const { pickedHandle, potentialSnapHandle } = this._editHandlePicks || {};
    if (!pickedHandle || !potentialSnapHandle) return;

    this._isSnapped = true;
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
    this._editHandlePicks = this._getEditHandlePicks(event);
    const { enableSnapping } = this._handler.getModeConfig() || {};

    if (enableSnapping && this._editHandlePicks) {
      this._performSnapIfRequired();
      this._performUnsnapIfRequired();
    }

    const modeActionSummary = this._handler.handlePointerMove(this._getSnapAwareEvent(event));
    const { editAction } = modeActionSummary;
    if (editAction) {
      this._updatePickedHandlePosition(editAction);
    }

    return modeActionSummary;
  }
}
