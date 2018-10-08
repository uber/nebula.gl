// @flow

import turfCentroid from '@turf/centroid';
import turfBearing from '@turf/bearing';
import turfTransformRotate from '@turf/transform-rotate';
import type { Geometry, Position } from '../../geojson-types.js';
import type { PointerMoveEvent, StartDraggingEvent, StopDraggingEvent } from '../event-types.js';
import type { EditAction } from './mode-handler.js';
import { ModeHandler } from './mode-handler.js';

export class RotateHandler extends ModeHandler {
  _geometryBeforeRotate: ?Geometry;

  handlePointerMove(event: PointerMoveEvent): { editAction: ?EditAction, cancelMapPan: boolean } {
    let editAction: ?EditAction = null;
    let cancelMapPan = false;

    const selectedFeatureIndexes = this.getSelectedFeatureIndexes();

    if (
      event.isDragging &&
      event.pointerDownGroundCoords &&
      this._geometryBeforeRotate &&
      selectedFeatureIndexes.length === 1
    ) {
      // Rotate the geometry
      editAction = this.getEditAction(event.pointerDownGroundCoords, event.groundCoords);
    }

    if (event.pointerDownGroundCoords && selectedFeatureIndexes.length === 1) {
      cancelMapPan = true;
    }

    return { editAction, cancelMapPan };
  }

  handleStartDragging(event: StartDraggingEvent): ?EditAction {
    const selectedFeatureIndexes = this.getSelectedFeatureIndexes();
    const geometryBefore = this.getSelectedGeometry();

    this._geometryBeforeRotate = geometryBefore;

    if (selectedFeatureIndexes.length !== 1 || !geometryBefore) {
      console.warn('rotation only supported for single feature selection'); // eslint-disable-line no-console,no-undef
    }

    return null;
  }

  handleStopDragging(event: StopDraggingEvent): ?EditAction {
    let editAction: ?EditAction = null;

    const selectedFeatureIndexes = this.getSelectedFeatureIndexes();
    if (
      event.pointerDownGroundCoords &&
      this._geometryBeforeRotate &&
      selectedFeatureIndexes.length === 1
    ) {
      // Rotate the geometry
      editAction = this.getEditAction(event.pointerDownGroundCoords, event.groundCoords);
      editAction.editType = 'rotated';
    }

    return editAction;
  }

  getEditAction(startDragPoint: Position, currentPoint: Position): EditAction {
    const startPosition = startDragPoint;
    const centroid = turfCentroid(this._geometryBeforeRotate);
    const angle = getRotationAngle(centroid, startPosition, currentPoint);
    const rotatedFeature = turfTransformRotate(this._geometryBeforeRotate, angle);

    const featureIndex = this.getSelectedFeatureIndexes()[0];
    const updatedData = this.getImmutableFeatureCollection()
      .replaceGeometry(featureIndex, rotatedFeature)
      .getObject();

    return {
      updatedData,
      editType: 'rotating',
      featureIndex,
      positionIndexes: null,
      position: null
    };
  }
}

function getRotationAngle(centroid: Position, startDragPoint: Position, currentPoint: Position) {
  const bearing1 = turfBearing(centroid, startDragPoint);
  const bearing2 = turfBearing(centroid, currentPoint);
  return bearing2 - bearing1;
}
