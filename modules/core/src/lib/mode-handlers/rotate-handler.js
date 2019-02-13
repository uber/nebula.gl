// @flow

import turfCentroid from '@turf/centroid';
import turfBearing from '@turf/bearing';
import turfTransformRotate from '@turf/transform-rotate';
import type { Geometry, Position } from '../../geojson-types.js';
import type {
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  DeckGLPick
} from '../event-types.js';
import type { EditAction } from './mode-handler.js';
import { ModeHandler } from './mode-handler.js';

export class RotateHandler extends ModeHandler {
  _isRotatable: boolean;
  _geometryBeingRotated: ?Geometry;

  handlePointerMove(event: PointerMoveEvent): { editAction: ?EditAction, cancelMapPan: boolean } {
    let editAction: ?EditAction = null;

    this._isRotatable =
      Boolean(this._geometryBeingRotated) || this.isSingleSelectionPicked(event.picks);

    if (!this._isRotatable || !event.pointerDownGroundCoords) {
      // Nothing to do
      return { editAction: null, cancelMapPan: false };
    }

    if (event.isDragging && this._geometryBeingRotated) {
      // Rotate the geometry
      editAction = this.getRotateAction(
        event.pointerDownGroundCoords,
        event.groundCoords,
        'rotating'
      );
    }

    return { editAction, cancelMapPan: true };
  }

  handleStartDragging(event: StartDraggingEvent): ?EditAction {
    const selectedFeatureIndexes = this.getSelectedFeatureIndexes();
    const geometryBefore = this.getSelectedGeometry();

    if (selectedFeatureIndexes.length !== 1 || !geometryBefore) {
      console.warn('rotation only supported for single feature selection'); // eslint-disable-line no-console,no-undef
    } else if (this._isRotatable) {
      this._geometryBeingRotated = geometryBefore;
    }

    return null;
  }

  handleStopDragging(event: StopDraggingEvent): ?EditAction {
    let editAction: ?EditAction = null;

    if (this._geometryBeingRotated) {
      // Rotate the geometry
      editAction = this.getRotateAction(
        event.pointerDownGroundCoords,
        event.groundCoords,
        'rotated'
      );
      this._geometryBeingRotated = null;
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
    if (this._isRotatable) {
      // TODO: look at doing SVG cursors to get a better "rotate" cursor
      return 'move';
    }
    return isDragging ? 'grabbing' : 'grab';
  }

  getRotateAction(startDragPoint: Position, currentPoint: Position, editType: string): EditAction {
    const startPosition = startDragPoint;
    const centroid = turfCentroid(this._geometryBeingRotated);
    const angle = getRotationAngle(centroid, startPosition, currentPoint);
    const rotatedFeature = turfTransformRotate(this._geometryBeingRotated, angle);

    const featureIndex = this.getSelectedFeatureIndexes()[0];
    const updatedData = this.getImmutableFeatureCollection()
      .replaceGeometry(featureIndex, rotatedFeature)
      .getObject();

    return {
      updatedData,
      editType,
      featureIndexes: [featureIndex],
      editContext: null
    };
  }
}

function getRotationAngle(centroid: Position, startDragPoint: Position, currentPoint: Position) {
  const bearing1 = turfBearing(centroid, startDragPoint);
  const bearing2 = turfBearing(centroid, currentPoint);
  return bearing2 - bearing1;
}
