// @flow

import type { Position, Feature, FeatureCollection } from '../geojson-types.js';
import type {
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  DraggingEvent,
  ModeProps,
  Pick,
  GuideFeatureCollection,
  EditHandleFeature
} from '../types.js';
import { getPickedEditHandle, getPickedEditHandles, getEditHandlesForGeometry } from '../utils.js';
import { BaseGeoJsonEditMode } from './geojson-edit-mode.js';

type MovementTypeEvent = PointerMoveEvent | StartDraggingEvent | StopDraggingEvent | DraggingEvent;

export class SnappableMode extends BaseGeoJsonEditMode {
  _handler: BaseGeoJsonEditMode;

  constructor(handler: BaseGeoJsonEditMode) {
    super();
    this._handler = handler;
  }

  _getSnappedMouseEvent<T: MovementTypeEvent>(
    event: T,
    snapSource: EditHandleFeature,
    snapTarget: EditHandleFeature
  ): T {
    return Object.assign(event, {
      mapCoords: snapTarget.geometry.coordinates,
      pointerDownMapCoords: snapSource && snapSource.geometry.coordinates
    });
  }

  _getPickedSnapTarget(picks: Pick[]): ?EditHandleFeature {
    return getPickedEditHandles(picks).find(
      handle => handle.properties.editHandleType === 'snap-target'
    );
  }

  _getPickedSnapSource(pointerDownPicks: ?(Pick[])): ?EditHandleFeature {
    return getPickedEditHandle(pointerDownPicks);
  }

  _getUpdatedSnapSourceHandle(
    snapSourceHandle: EditHandleFeature,
    data: FeatureCollection
  ): EditHandleFeature {
    const { featureIndex, positionIndexes } = snapSourceHandle.properties;
    const snapSourceFeature = data.features[featureIndex];

    // $FlowFixMe
    const snapSourceCoordinates: Position = positionIndexes.reduce(
      (a: any[], b: number) => a[b],
      snapSourceFeature.geometry.coordinates
    );

    return {
      ...snapSourceHandle,
      geometry: {
        type: 'Point',
        coordinates: snapSourceCoordinates
      }
    };
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

  _getSnapTargetHandles(props: ModeProps<FeatureCollection>): EditHandleFeature[] {
    const handles = [];
    const features = this._getSnapTargets(props);

    for (let i = 0; i < features.length; i++) {
      // Filter out the currently selected feature(s)
      const isCurrentIndexFeatureNotSelected = !props.selectedIndexes.includes(i);

      if (isCurrentIndexFeatureNotSelected) {
        const { geometry } = features[i];
        handles.push(...getEditHandlesForGeometry(geometry, i, 'snap-target'));
      }
    }
    return handles;
  }

  // If no snap handle has been picked, only display the edit handles of the
  // selected feature. If a snap handle has been picked, display said snap handle
  // along with all snappable points on all non-selected features.
  getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection {
    const { modeConfig, lastPointerMoveEvent } = props;
    const { enableSnapping } = modeConfig || {};

    const guides: GuideFeatureCollection = {
      type: 'FeatureCollection',
      features: [...this._handler.getGuides(props).features]
    };

    if (!enableSnapping) {
      return guides;
    }

    const snapSourceHandle: ?EditHandleFeature =
      lastPointerMoveEvent && this._getPickedSnapSource(lastPointerMoveEvent.pointerDownPicks);

    // They started dragging a handle
    // So render the picked handle (in its updated location) and all possible snap targets
    if (snapSourceHandle) {
      guides.features.push(
        ...this._getSnapTargetHandles(props),
        this._getUpdatedSnapSourceHandle(snapSourceHandle, props.data)
      );

      return guides;
    }

    // Render the possible snap source handles
    const { features } = props.data;
    for (const index of props.selectedIndexes) {
      if (index < features.length) {
        const { geometry } = features[index];
        guides.features.push(...getEditHandlesForGeometry(geometry, index, 'snap-source'));
      }
    }

    return guides;
  }

  _getSnapAwareEvent<T: MovementTypeEvent>(event: T, props: ModeProps<FeatureCollection>): T {
    const snapSource = this._getPickedSnapSource(props.lastPointerMoveEvent.pointerDownPicks);
    const snapTarget = this._getPickedSnapTarget(event.picks);

    return snapSource && snapTarget
      ? this._getSnappedMouseEvent(event, snapSource, snapTarget)
      : event;
  }

  handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>) {
    this._handler.handleStartDragging(event, props);
  }

  handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>) {
    this._handler.handleStopDragging(this._getSnapAwareEvent(event, props), props);
  }

  handleDragging(event: DraggingEvent, props: ModeProps<FeatureCollection>) {
    this._handler.handleDragging(this._getSnapAwareEvent(event, props), props);
  }

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>) {
    this._handler.handlePointerMove(this._getSnapAwareEvent(event, props), props);
  }
}
