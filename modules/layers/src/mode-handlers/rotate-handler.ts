import turfCentroid from '@turf/centroid';
import turfBearing from '@turf/bearing';
import turfTransformRotate from '@turf/transform-rotate';
import { FeatureCollection, Position } from '@nebula.gl/edit-modes';
import { PointerMoveEvent, StartDraggingEvent, StopDraggingEvent } from '../event-types';
import { EditAction, ModeHandler } from './mode-handler';

// TODO edit-modes: delete handlers once EditMode fully implemented
export class RotateHandler extends ModeHandler {
  _isRotatable: boolean;
  _geometryBeingRotated: FeatureCollection | null | undefined;

  handlePointerMove(
    event: PointerMoveEvent
  ): { editAction: EditAction | null | undefined; cancelMapPan: boolean } {
    let editAction: EditAction | null | undefined = null;

    this._isRotatable = Boolean(this._geometryBeingRotated) || this.isSelectionPicked(event.picks);

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

  handleStartDragging(event: StartDraggingEvent): EditAction | null | undefined {
    if (!this._isRotatable) {
      return null;
    }

    this._geometryBeingRotated = this.getSelectedFeaturesAsFeatureCollection();
    return null;
  }

  handleStopDragging(event: StopDraggingEvent): EditAction | null | undefined {
    let editAction: EditAction | null | undefined = null;

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
    // @ts-ignore
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
      editContext: null,
    };
  }
}

function getRotationAngle(centroid: Position, startDragPoint: Position, currentPoint: Position) {
  const bearing1 = turfBearing(centroid, startDragPoint);
  const bearing2 = turfBearing(centroid, currentPoint);
  return bearing2 - bearing1;
}
