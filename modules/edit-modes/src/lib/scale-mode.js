// @flow

import turfCentroid from '@turf/centroid';
import turfDistance from '@turf/distance';
import turfTransformScale from '@turf/transform-scale';
import type { FeatureCollection, Position } from '../geojson-types.js';
import type {
  ModeProps,
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  DraggingEvent
} from '../types.js';
import { BaseGeoJsonEditMode, type GeoJsonEditAction } from './geojson-edit-mode.js';
import { ImmutableFeatureCollection } from './immutable-feature-collection.js';

export class ScaleMode extends BaseGeoJsonEditMode {
  _isScalable: boolean;
  _geometryBeingScaled: ?FeatureCollection;

  handleDragging(event: DraggingEvent, props: ModeProps<FeatureCollection>) {
    if (!this._isScalable) {
      // Nothing to do
      return;
    }

    if (this._geometryBeingScaled) {
      // Scale the geometry
      props.onEdit(
        this.getScaleAction(event.pointerDownMapCoords, event.mapCoords, 'scaling', props)
      );
    }

    event.cancelPan();
  }

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>) {
    this._isScalable = this.isSelectionPicked(event.pointerDownPicks || event.picks, props);

    this.updateCursor(props);
  }

  handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>) {
    if (!this._isScalable) {
      return;
    }

    this._geometryBeingScaled = this.getSelectedFeaturesAsFeatureCollection(props);
  }

  handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>) {
    if (this._geometryBeingScaled) {
      // Scale the geometry
      props.onEdit(
        this.getScaleAction(event.pointerDownMapCoords, event.mapCoords, 'scaled', props)
      );
      this._geometryBeingScaled = null;
    }
  }

  updateCursor(props: ModeProps<FeatureCollection>) {
    if (this._isScalable) {
      // TODO: look at doing SVG cursors to get a better "scale" cursor
      props.onUpdateCursor('move');
    } else {
      props.onUpdateCursor(null);
    }
  }

  getScaleAction(
    startDragPoint: Position,
    currentPoint: Position,
    editType: string,
    props: ModeProps<FeatureCollection>
  ): GeoJsonEditAction {
    const startPosition = startDragPoint;
    const centroid = turfCentroid(this._geometryBeingScaled);
    const factor = getScaleFactor(centroid, startPosition, currentPoint);
    const scaledFeatures = turfTransformScale(this._geometryBeingScaled, factor, {
      origin: centroid
    });

    let updatedData = new ImmutableFeatureCollection(props.data);

    const selectedIndexes = props.selectedIndexes;
    for (let i = 0; i < selectedIndexes.length; i++) {
      const selectedIndex = selectedIndexes[i];
      const movedFeature = scaledFeatures.features[i];
      updatedData = updatedData.replaceGeometry(selectedIndex, movedFeature.geometry);
    }

    return {
      updatedData: updatedData.getObject(),
      editType,
      editContext: {
        featureIndexes: selectedIndexes
      }
    };
  }
}

function getScaleFactor(centroid: Position, startDragPoint: Position, currentPoint: Position) {
  const startDistance = turfDistance(centroid, startDragPoint);
  const endDistance = turfDistance(centroid, currentPoint);
  return endDistance / startDistance;
}
