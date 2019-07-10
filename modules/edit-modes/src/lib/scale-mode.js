// @flow

import turfCentroid from '@turf/centroid';
import turfDistance from '@turf/distance';
import turfTransformScale from '@turf/transform-scale';
import type { FeatureCollection, Position } from '@nebula.gl/edit-modes';
import type { PointerMoveEvent, StartDraggingEvent, StopDraggingEvent } from '../types.js';
import { BaseGeoJsonEditMode, type GeoJsonEditAction } from './geojson-edit-mode.js';

export class ScaleMode extends BaseGeoJsonEditMode {
  _isScalable: boolean;
  _geometryBeingScaled: ?FeatureCollection;

  handlePointerMoveAdapter(
    event: PointerMoveEvent
  ): { editAction: ?GeoJsonEditAction, cancelMapPan: boolean } {
    let editAction: ?GeoJsonEditAction = null;

    this._isScalable = Boolean(this._geometryBeingScaled) || this.isSelectionPicked(event.picks);

    if (!this._isScalable || !event.pointerDownMapCoords) {
      // Nothing to do
      return { editAction: null, cancelMapPan: false };
    }

    if (event.isDragging && this._geometryBeingScaled) {
      // Scale the geometry
      editAction = this.getScaleAction(event.pointerDownMapCoords, event.mapCoords, 'scaling');
    }

    return { editAction, cancelMapPan: true };
  }

  handleStartDraggingAdapter(event: StartDraggingEvent): ?GeoJsonEditAction {
    if (!this._isScalable) {
      return null;
    }

    this._geometryBeingScaled = this.getSelectedFeaturesAsFeatureCollection();
    return null;
  }

  handleStopDraggingAdapter(event: StopDraggingEvent): ?GeoJsonEditAction {
    let editAction: ?GeoJsonEditAction = null;

    if (this._geometryBeingScaled) {
      // Scale the geometry
      editAction = this.getScaleAction(event.pointerDownMapCoords, event.mapCoords, 'scaled');
      this._geometryBeingScaled = null;
    }

    return editAction;
  }

  getCursorAdapter(): ?string {
    if (this._isScalable) {
      // TODO: look at doing SVG cursors to get a better "scale" cursor
      return 'move';
    }
    return null;
  }

  getScaleAction(
    startDragPoint: Position,
    currentPoint: Position,
    editType: string
  ): GeoJsonEditAction {
    const startPosition = startDragPoint;
    const centroid = turfCentroid(this._geometryBeingScaled);
    const factor = getScaleFactor(centroid, startPosition, currentPoint);
    const scaledFeatures = turfTransformScale(this._geometryBeingScaled, factor, {
      origin: centroid
    });

    let updatedData = this.getImmutableFeatureCollection();

    const selectedIndexes = this.getSelectedFeatureIndexes();
    for (let i = 0; i < selectedIndexes.length; i++) {
      const selectedIndex = selectedIndexes[i];
      const movedFeature = scaledFeatures.features[i];
      updatedData = updatedData.replaceGeometry(selectedIndex, movedFeature.geometry);
    }

    return {
      updatedData: updatedData.getObject(),
      editType,
      featureIndexes: selectedIndexes,
      editContext: null
    };
  }
}

function getScaleFactor(centroid: Position, startDragPoint: Position, currentPoint: Position) {
  const startDistance = turfDistance(centroid, startDragPoint);
  const endDistance = turfDistance(centroid, currentPoint);
  return endDistance / startDistance;
}
