// @flow

import turfCentroid from '@turf/centroid';
import turfDistance from '@turf/distance';
import turfTransformScale from '@turf/transform-scale';
import {
  convertFeatureListToFeatureCollection,
  convertFeatureCollectionToFeatureList
} from '../utils';
import type { FeatureCollection, Position } from '../../geojson-types.js';
import type { PointerMoveEvent, StartDraggingEvent, StopDraggingEvent } from '../event-types.js';
import type { EditAction } from './mode-handler.js';
import { ModeHandler } from './mode-handler.js';

export class ScaleHandler extends ModeHandler {
  _isScalable: boolean;
  _geometryBeingScaled: ?FeatureCollection;

  handlePointerMove(event: PointerMoveEvent): { editAction: ?EditAction, cancelMapPan: boolean } {
    let editAction: ?EditAction = null;

    this._isScalable = Boolean(this._geometryBeingScaled) || this.isSelectionPicked(event.picks);

    if (!this._isScalable || !event.pointerDownGroundCoords) {
      // Nothing to do
      return { editAction: null, cancelMapPan: false };
    }

    if (event.isDragging && this._geometryBeingScaled) {
      // Scale the geometry
      editAction = this.getScaleAction(
        event.pointerDownGroundCoords,
        event.groundCoords,
        'scaling'
      );
    }

    return { editAction, cancelMapPan: true };
  }

  handleStartDragging(event: StartDraggingEvent): ?EditAction {
    const geometryBefore = this.getSelectedGeometries();
    const combinedGeometry = convertFeatureListToFeatureCollection(geometryBefore);

    if (this._isScalable) {
      this._geometryBeingScaled = combinedGeometry;
    }

    return null;
  }

  handleStopDragging(event: StopDraggingEvent): ?EditAction {
    let editAction: ?EditAction = null;

    if (this._geometryBeingScaled) {
      // Scale the geometry
      editAction = this.getScaleAction(event.pointerDownGroundCoords, event.groundCoords, 'scaled');
      this._geometryBeingScaled = null;
    }

    return editAction;
  }

  getCursor({ isDragging }: { isDragging: boolean }): string {
    if (this._isScalable) {
      // TODO: look at doing SVG cursors to get a better "scale" cursor
      return 'move';
    }
    return isDragging ? 'grabbing' : 'grab';
  }

  getScaleAction(startDragPoint: Position, currentPoint: Position, editType: string): EditAction {
    const startPosition = startDragPoint;
    const centroid = turfCentroid(this._geometryBeingScaled);
    const factor = getScaleFactor(centroid, startPosition, currentPoint);
    const scaledFeature = turfTransformScale(this._geometryBeingScaled, factor, {
      origin: centroid
    });

    const scaledFeatures = convertFeatureCollectionToFeatureList(scaledFeature);
    const featureIndexes = [];
    let updatedData = this.getImmutableFeatureCollection();
    for (const feature of scaledFeatures) {
      const { index } = feature.properties;
      updatedData = updatedData.replaceGeometry(index, feature);
      featureIndexes.push(index);
    }

    return {
      updatedData: updatedData.getObject(),
      editType,
      featureIndexes,
      editContext: null
    };
  }
}

function getScaleFactor(centroid: Position, startDragPoint: Position, currentPoint: Position) {
  const startDistance = turfDistance(centroid, startDragPoint);
  const endDistance = turfDistance(centroid, currentPoint);
  return endDistance / startDistance;
}
