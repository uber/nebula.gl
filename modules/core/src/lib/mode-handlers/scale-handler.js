// @flow

import turfCentroid from '@turf/centroid';
import turfDistance from '@turf/distance';
import turfTransformScale from '@turf/transform-scale';
import type { Geometry, Position } from '../../geojson-types.js';
import type {
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  DeckGLPick
} from '../event-types.js';
import type { EditAction } from './mode-handler.js';
import { ModeHandler } from './mode-handler.js';

export class ScaleHandler extends ModeHandler {
  _isScalable: boolean;
  _geometryBeingScaled: ?Geometry;

  handlePointerMove(event: PointerMoveEvent): { editAction: ?EditAction, cancelMapPan: boolean } {
    let editAction: ?EditAction = null;

    this._isScalable =
      Boolean(this._geometryBeingScaled) || this.isSingleSelectionPicked(event.picks);

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
    const selectedFeatureIndexes = this.getSelectedFeatureIndexes();
    const geometryBefore = this.getSelectedGeometry();

    if (selectedFeatureIndexes.length !== 1 || !geometryBefore) {
      console.warn('scaling only supported for single feature selection'); // eslint-disable-line no-console,no-undef
    } else if (this._isScalable) {
      this._geometryBeingScaled = geometryBefore;
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

  isSingleSelectionPicked(picks: DeckGLPick[]): boolean {
    const selectedFeatureIndexes = this.getSelectedFeatureIndexes();
    const singleSelectedFeature =
      selectedFeatureIndexes.length === 1
        ? this.getFeatureCollection().features[selectedFeatureIndexes[0]]
        : null;

    return picks.some(p => p.object === singleSelectedFeature);
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
    const scaledFeature = turfTransformScale(this._geometryBeingScaled, factor);

    const featureIndex = this.getSelectedFeatureIndexes()[0];
    const updatedData = this.getImmutableFeatureCollection()
      .replaceGeometry(featureIndex, scaledFeature)
      .getObject();

    return {
      updatedData,
      editType,
      featureIndex,
      positionIndexes: null,
      position: null
    };
  }
}

function getScaleFactor(centroid: Position, startDragPoint: Position, currentPoint: Position) {
  const startDistance = turfDistance(centroid, startDragPoint);
  const endDistance = turfDistance(centroid, currentPoint);
  return endDistance / startDistance;
}
