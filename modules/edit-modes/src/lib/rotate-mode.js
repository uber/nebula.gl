// @flow

import turfCentroid from '@turf/centroid';
import turfBearing from '@turf/bearing';
import turfTransformRotate from '@turf/transform-rotate';
import type { FeatureCollection, Position } from '@nebula.gl/edit-modes';
import type { PointerMoveEvent, StartDraggingEvent, StopDraggingEvent } from '../types.js';
import { BaseGeoJsonEditMode, type GeoJsonEditAction } from './geojson-edit-mode.js';

export class RotateMode extends BaseGeoJsonEditMode {
  _isRotatable: boolean;
  _geometryBeingRotated: ?FeatureCollection;

  handlePointerMoveAdapter(
    event: PointerMoveEvent
  ): { editAction: ?GeoJsonEditAction, cancelMapPan: boolean } {
    let editAction: ?GeoJsonEditAction = null;

    this._isRotatable = Boolean(this._geometryBeingRotated) || this.isSelectionPicked(event.picks);

    if (!this._isRotatable || !event.pointerDownMapCoords) {
      // Nothing to do
      return { editAction: null, cancelMapPan: false };
    }

    if (event.isDragging && this._geometryBeingRotated) {
      // Rotate the geometry
      editAction = this.getRotateAction(event.pointerDownMapCoords, event.mapCoords, 'rotating');
    }

    return { editAction, cancelMapPan: true };
  }

  handleStartDraggingAdapter(event: StartDraggingEvent): ?GeoJsonEditAction {
    if (!this._isRotatable) {
      return null;
    }

    this._geometryBeingRotated = this.getSelectedFeaturesAsFeatureCollection();
    return null;
  }

  handleStopDraggingAdapter(event: StopDraggingEvent): ?GeoJsonEditAction {
    let editAction: ?GeoJsonEditAction = null;

    if (this._geometryBeingRotated) {
      // Rotate the geometry
      editAction = this.getRotateAction(event.pointerDownMapCoords, event.mapCoords, 'rotated');
      this._geometryBeingRotated = null;
    }

    return editAction;
  }

  getCursorAdapter(): ?string {
    if (this._isRotatable) {
      // TODO: look at doing SVG cursors to get a better "rotate" cursor
      return 'move';
    }
    return null;
  }

  getRotateAction(
    startDragPoint: Position,
    currentPoint: Position,
    editType: string
  ): GeoJsonEditAction {
    const startPosition = startDragPoint;
    const centroid = turfCentroid(this._geometryBeingRotated);
    const angle = getRotationAngle(centroid, startPosition, currentPoint);

    const rotatedFeatures = turfTransformRotate(this._geometryBeingRotated, angle);

    let updatedData = this.getImmutableFeatureCollection();

    const selectedIndexes = this.getSelectedFeatureIndexes();
    for (let i = 0; i < selectedIndexes.length; i++) {
      const selectedIndex = selectedIndexes[i];
      const movedFeature = rotatedFeatures.features[i];
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

function getRotationAngle(centroid: Position, startDragPoint: Position, currentPoint: Position) {
  const bearing1 = turfBearing(centroid, startDragPoint);
  const bearing2 = turfBearing(centroid, currentPoint);
  return bearing2 - bearing1;
}
