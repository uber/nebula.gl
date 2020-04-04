import bearing from '@turf/bearing';
import { generatePointsParallelToLinePoints } from '../utils';
import { PointerMoveEvent, StartDraggingEvent, StopDraggingEvent } from '../event-types';
import { EditAction, getPickedEditHandle } from './mode-handler';

import { ModifyHandler } from './modify-handler';

// TODO edit-modes: delete handlers once EditMode fully implemented
export class ExtrudeHandler extends ModifyHandler {
  isPointAdded = false;
  handlePointerMove(
    event: PointerMoveEvent
  ): { editAction: EditAction | null | undefined; cancelMapPan: boolean } {
    this._lastPointerMovePicks = event.picks;

    let editAction: EditAction | null | undefined = null;

    const editHandle = getPickedEditHandle(event.pointerDownPicks);

    if (event.isDragging && editHandle) {
      const size = this.coordinatesSize(editHandle.positionIndexes, editHandle.featureIndex);
      const positionIndexes = this.isPointAdded
        ? this.nextPositionIndexes(editHandle.positionIndexes, size)
        : editHandle.positionIndexes;
      // p1 and p1 are end points for edge
      const p1 = this.getPointForPositionIndexes(
        this.prevPositionIndexes(positionIndexes, size),
        editHandle.featureIndex
      );
      const p2 = this.getPointForPositionIndexes(positionIndexes, editHandle.featureIndex);
      if (p1 && p2) {
        // p3 and p4 are end points for moving (extruding) edge
        const [p3, p4] = generatePointsParallelToLinePoints(p1, p2, event.groundCoords);

        const updatedData = this.getImmutableFeatureCollection()
          .replacePosition(
            editHandle.featureIndex,
            this.prevPositionIndexes(positionIndexes, size),
            p4
          )
          .replacePosition(editHandle.featureIndex, positionIndexes, p3)
          .getObject();

        editAction = {
          updatedData,
          editType: 'extruding',
          featureIndexes: [editHandle.featureIndex],
          editContext: {
            positionIndexes: this.nextPositionIndexes(editHandle.positionIndexes, size),
            position: p3,
          },
        };
      }
    }

    // Cancel map panning if pointer went down on an edit handle
    const cancelMapPan = Boolean(editHandle);

    return { editAction, cancelMapPan };
  }

  handleStartDragging(event: StartDraggingEvent): EditAction | null | undefined {
    let editAction: EditAction | null | undefined = null;

    const selectedFeatureIndexes = this.getSelectedFeatureIndexes();

    const editHandle = getPickedEditHandle(event.picks);
    if (selectedFeatureIndexes.length && editHandle && editHandle.type === 'intermediate') {
      const size = this.coordinatesSize(editHandle.positionIndexes, editHandle.featureIndex);
      // p1 and p1 are end points for edge
      const p1 = this.getPointForPositionIndexes(
        this.prevPositionIndexes(editHandle.positionIndexes, size),
        editHandle.featureIndex
      );
      const p2 = this.getPointForPositionIndexes(
        editHandle.positionIndexes,
        editHandle.featureIndex
      );

      if (p1 && p2) {
        let updatedData = this.getImmutableFeatureCollection();
        if (!this.isOrthogonal(editHandle.positionIndexes, editHandle.featureIndex, size)) {
          updatedData = updatedData.addPosition(
            editHandle.featureIndex,
            editHandle.positionIndexes,
            p2
          );
        }
        if (
          !this.isOrthogonal(
            this.prevPositionIndexes(editHandle.positionIndexes, size),
            editHandle.featureIndex,
            size
          )
        ) {
          updatedData = updatedData.addPosition(
            editHandle.featureIndex,
            editHandle.positionIndexes,
            p1
          );
          this.isPointAdded = true;
        }

        editAction = {
          updatedData: updatedData.getObject(),
          editType: 'startExtruding',
          featureIndexes: [editHandle.featureIndex],
          editContext: {
            positionIndexes: editHandle.positionIndexes,
            position: p1,
          },
        };
      }
    }

    return editAction;
  }

  handleStopDragging(event: StopDraggingEvent): EditAction | null | undefined {
    let editAction: EditAction | null | undefined = null;

    const selectedFeatureIndexes = this.getSelectedFeatureIndexes();
    const editHandle = getPickedEditHandle(event.picks);
    if (selectedFeatureIndexes.length && editHandle) {
      const size = this.coordinatesSize(editHandle.positionIndexes, editHandle.featureIndex);
      const positionIndexes = this.isPointAdded
        ? this.nextPositionIndexes(editHandle.positionIndexes, size)
        : editHandle.positionIndexes;
      // p1 and p1 are end points for edge
      const p1 = this.getPointForPositionIndexes(
        this.prevPositionIndexes(positionIndexes, size),
        editHandle.featureIndex
      );
      const p2 = this.getPointForPositionIndexes(positionIndexes, editHandle.featureIndex);

      if (p1 && p2) {
        // p3 and p4 are end points for new moved (extruded) edge
        const [p3, p4] = generatePointsParallelToLinePoints(p1, p2, event.groundCoords);

        const updatedData = this.getImmutableFeatureCollection()
          .replacePosition(
            editHandle.featureIndex,
            this.prevPositionIndexes(positionIndexes, size),
            p4
          )
          .replacePosition(editHandle.featureIndex, positionIndexes, p3)
          .getObject();

        editAction = {
          updatedData,
          editType: 'extruded',
          featureIndexes: [editHandle.featureIndex],
          editContext: {
            positionIndexes: editHandle.positionIndexes,
            position: p3,
          },
        };
      }
    }
    this.isPointAdded = false;

    return editAction;
  }

  coordinatesSize(positionIndexes: number[], featureIndex: number) {
    let size = 0;
    const feature = this.getImmutableFeatureCollection().getObject().features[featureIndex];
    const coordinates: any = feature.geometry.coordinates;
    // for Multi polygons, length will be 3
    if (positionIndexes.length === 3) {
      const [a, b] = positionIndexes;
      if (coordinates.length && coordinates[a].length) {
        size = coordinates[a][b].length;
      }
    } else {
      const [b] = positionIndexes;
      if (coordinates.length && coordinates[b].length) {
        size = coordinates[b].length;
      }
    }
    return size;
  }

  getBearing(p1: any, p2: any) {
    const angle = bearing(p1, p2);
    if (angle < 0) {
      return Math.floor(360 + angle);
    }
    return Math.floor(angle);
  }

  isOrthogonal(positionIndexes: number[], featureIndex: number, size: number) {
    if (positionIndexes[positionIndexes.length - 1] === size - 1) {
      positionIndexes[positionIndexes.length - 1] = 0;
    }
    const prevPoint = this.getPointForPositionIndexes(
      this.prevPositionIndexes(positionIndexes, size),
      featureIndex
    );
    const nextPoint = this.getPointForPositionIndexes(
      this.nextPositionIndexes(positionIndexes, size),
      featureIndex
    );
    const currentPoint = this.getPointForPositionIndexes(positionIndexes, featureIndex);
    const prevAngle = this.getBearing(currentPoint, prevPoint);
    const nextAngle = this.getBearing(currentPoint, nextPoint);
    return [89, 90, 91, 269, 270, 271].includes(Math.abs(prevAngle - nextAngle));
  }

  nextPositionIndexes(positionIndexes: number[], size: number): number[] {
    const next = [...positionIndexes];
    if (next.length) {
      next[next.length - 1] = next[next.length - 1] === size - 1 ? 0 : next[next.length - 1] + 1;
    }
    return next;
  }

  prevPositionIndexes(positionIndexes: number[], size: number): number[] {
    const prev = [...positionIndexes];
    if (prev.length) {
      prev[prev.length - 1] = prev[prev.length - 1] === 0 ? size - 2 : prev[prev.length - 1] - 1;
    }
    return prev;
  }

  getPointForPositionIndexes(positionIndexes: number[], featureIndex: number) {
    let p1;
    const feature = this.getImmutableFeatureCollection().getObject().features[featureIndex];
    const coordinates: any = feature.geometry.coordinates;
    // for Multi polygons, length will be 3
    if (positionIndexes.length === 3) {
      const [a, b, c] = positionIndexes;
      if (coordinates.length && coordinates[a].length) {
        p1 = coordinates[a][b][c];
      }
    } else {
      const [b, c] = positionIndexes;
      if (coordinates.length && coordinates[b].length) {
        p1 = coordinates[b][c];
      }
    }
    return p1;
  }
}
