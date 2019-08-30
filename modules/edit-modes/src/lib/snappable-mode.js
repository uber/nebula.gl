// @flow

import type { Feature, FeatureCollection, Position } from '../geojson-types.js';
import type {
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  ModeProps
} from '../types.js';
import type { EditHandle, GeoJsonEditAction } from './geojson-edit-mode.js';
import {
  BaseGeoJsonEditMode,
  getPickedEditHandle,
  getPickedEditHandles,
  getEditHandlesForGeometry
} from './geojson-edit-mode.js';

type HandlePicks = { pickedHandle?: EditHandle, potentialSnapHandle?: EditHandle };

export class SnappableMode extends BaseGeoJsonEditMode {
  _handler: BaseGeoJsonEditMode;
  _editHandlePicks: ?HandlePicks;
  _startDragSnapHandlePosition: Position;

  constructor(handler: BaseGeoJsonEditMode) {
    super();
    this._handler = handler;
  }

  _getSnappedMouseEvent(event: Object, snapPoint: Position): PointerMoveEvent {
    return Object.assign({}, event, {
      mapCoords: snapPoint,
      pointerDownMapCoords: this._startDragSnapHandlePosition
    });
  }

  _getEditHandlePicks(event: PointerMoveEvent): HandlePicks {
    const { picks } = event;

    const potentialSnapHandle = getPickedEditHandles(picks).find(
      handle => handle.type === 'intermediate'
    );
    const handles = { potentialSnapHandle };

    const pickedHandle = getPickedEditHandle(event.pointerDownPicks);
    if (pickedHandle) {
      return { ...handles, pickedHandle };
    }

    return handles;
  }

  _updatePickedHandlePosition(editAction: GeoJsonEditAction) {
    const { pickedHandle } = this._editHandlePicks || {};

    if (pickedHandle && editAction) {
      const { editContext, updatedData } = editAction;
      const { featureIndexes } = editContext;

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
  _getSnapTargets(props: ModeProps<FeatureCollection>): Feature[] {
    let { additionalSnapTargets } = props.modeConfig || {};
    additionalSnapTargets = additionalSnapTargets || [];

    const features = [...props.data.features, ...additionalSnapTargets];
    return features;
  }

  _getNonPickedIntermediateHandles(props: ModeProps<FeatureCollection>): EditHandle[] {
    const handles = [];
    const features = this._getSnapTargets(props);

    for (let i = 0; i < features.length; i++) {
      // Filter out the currently selected feature(s)
      const isCurrentIndexFeatureNotSelected = !props.selectedIndexes.includes(i);

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
  getEditHandlesAdapter(
    picks: ?Array<Object>,
    mapCoords: ?Position,
    props: ModeProps<FeatureCollection>
  ): any[] {
    const { enableSnapping } = props.modeConfig || {};
    const handles = [...this._handler.getEditHandlesAdapter(picks, mapCoords, props)];

    if (!enableSnapping) return handles;
    const { pickedHandle } = this._editHandlePicks || {};

    if (pickedHandle) {
      handles.push(...this._getNonPickedIntermediateHandles(props), pickedHandle);
      return handles;
    }

    const { features } = props.data;
    for (const index of props.selectedIndexes) {
      if (index < features.length) {
        const { geometry } = features[index];
        handles.push(...getEditHandlesForGeometry(geometry, index, 'snap'));
      }
    }

    return handles.filter(Boolean);
  }

  _getSnapAwareEvent(event: Object): Object {
    const { potentialSnapHandle } = this._editHandlePicks || {};

    return potentialSnapHandle && potentialSnapHandle.position
      ? this._getSnappedMouseEvent(event, potentialSnapHandle.position)
      : event;
  }

  handleStartDraggingAdapter(
    event: StartDraggingEvent,
    props: ModeProps<FeatureCollection>
  ): ?GeoJsonEditAction {
    this._startDragSnapHandlePosition = (getPickedEditHandle(event.picks) || {}).position;
    return this._handler.handleStartDraggingAdapter(event, props);
  }

  handleStopDraggingAdapter(
    event: StopDraggingEvent,
    props: ModeProps<FeatureCollection>
  ): ?GeoJsonEditAction {
    const modeActionSummary = this._handler.handleStopDraggingAdapter(
      this._getSnapAwareEvent(event),
      props
    );

    this._editHandlePicks = null;
    return modeActionSummary;
  }

  getCursorAdapter(props: ModeProps<FeatureCollection>): ?string {
    return this._handler.getCursorAdapter(props);
  }

  handlePointerMoveAdapter(
    event: PointerMoveEvent,
    props: ModeProps<FeatureCollection>
  ): { editAction: ?GeoJsonEditAction, cancelMapPan: boolean } {
    const { enableSnapping } = props.modeConfig || {};

    if (enableSnapping) {
      this._editHandlePicks = this._getEditHandlePicks(event);
    }

    const modeActionSummary = this._handler.handlePointerMoveAdapter(
      this._getSnapAwareEvent(event),
      props
    );
    const { editAction } = modeActionSummary;
    if (editAction) {
      this._updatePickedHandlePosition(editAction);
    }

    return modeActionSummary;
  }
}
