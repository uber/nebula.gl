// @flow

import { generatePointsParallelToLinePoints } from '../utils';
import type { PointerMoveEvent, StartDraggingEvent, StopDraggingEvent } from '../event-types.js';
import type { EditAction } from './mode-handler.js';
import { getPickedEditHandle } from './mode-handler.js';
import { ModifyHandler } from './modify-handler';

export class ExtrudeHandler extends ModifyHandler {
  handlePointerMove(event: PointerMoveEvent): { editAction: ?EditAction, cancelMapPan: boolean } {
    this._lastPointerMovePicks = event.picks;

    let editAction: ?EditAction = null;

    const editHandle = getPickedEditHandle(event.pointerDownPicks);

    if (event.isDragging && editHandle) {
      // p1 and p1 are end points for edge
      const p1 = this.getPointForPositionIndexes(
        editHandle.positionIndexes,
        editHandle.featureIndex
      );
      const p2 = this.getPointForPositionIndexes(
        this.nextPositionIndexes(editHandle.positionIndexes),
        editHandle.featureIndex
      );
      if (p1 && p2) {
        // p3 and p4 are end points for moving (extruding) edge
        const [p3, p4] = generatePointsParallelToLinePoints(p1, p2, event.groundCoords);

        const updatedData = this.getImmutableFeatureCollection()
          .replacePosition(editHandle.featureIndex, editHandle.positionIndexes, p4)
          .replacePosition(
            editHandle.featureIndex,
            this.nextPositionIndexes(editHandle.positionIndexes),
            p3
          )
          .getObject();

        editAction = {
          updatedData,
          editType: 'moveEdge',
          featureIndex: editHandle.featureIndex,
          positionIndexes: this.nextPositionIndexes(editHandle.positionIndexes),
          position: p3
        };
      }
    }

    // Cancel map panning if pointer went down on an edit handle
    const cancelMapPan = Boolean(editHandle);

    return { editAction, cancelMapPan };
  }

  handleStartDragging(event: StartDraggingEvent): ?EditAction {
    let editAction: ?EditAction = null;

    const selectedFeatureIndexes = this.getSelectedFeatureIndexes();

    const editHandle = getPickedEditHandle(event.picks);
    if (selectedFeatureIndexes.length && editHandle && editHandle.type === 'intermediate') {
      // p1 and p1 are end points for edge
      const p1 = this.getPointForPositionIndexes(
        this.prevPositionIndexes(editHandle.positionIndexes),
        editHandle.featureIndex
      );
      const p2 = this.getPointForPositionIndexes(
        editHandle.positionIndexes,
        editHandle.featureIndex
      );
      if (p1 && p2) {
        const updatedData = this.getImmutableFeatureCollection()
          .addPosition(editHandle.featureIndex, editHandle.positionIndexes, p2)
          .addPosition(editHandle.featureIndex, editHandle.positionIndexes, p1)
          .getObject();

        editAction = {
          updatedData,
          editType: 'addEdge',
          featureIndex: editHandle.featureIndex,
          positionIndexes: editHandle.positionIndexes,
          position: p1
        };
      }
    }

    return editAction;
  }

  handleStopDragging(event: StopDraggingEvent): ?EditAction {
    let editAction: ?EditAction = null;

    const selectedFeatureIndexes = this.getSelectedFeatureIndexes();
    const editHandle = getPickedEditHandle(event.picks);
    if (selectedFeatureIndexes.length && editHandle) {
      // p1 and p1 are end points for edge
      const p1 = this.getPointForPositionIndexes(
        editHandle.positionIndexes,
        editHandle.featureIndex
      );
      const p2 = this.getPointForPositionIndexes(
        this.nextPositionIndexes(editHandle.positionIndexes),
        editHandle.featureIndex
      );

      if (p1 && p2) {
        // p3 and p4 are end points for new moved (extruded) edge
        const [p3, p4] = generatePointsParallelToLinePoints(p1, p2, event.groundCoords);

        const updatedData = this.getImmutableFeatureCollection()
          .replacePosition(editHandle.featureIndex, editHandle.positionIndexes, p4)
          .replacePosition(
            editHandle.featureIndex,
            this.nextPositionIndexes(editHandle.positionIndexes),
            p3
          )
          .getObject();

        editAction = {
          updatedData,
          editType: 'finishMoveEdge',
          featureIndex: editHandle.featureIndex,
          positionIndexes: editHandle.positionIndexes,
          position: p3
        };
      }
    }

    return editAction;
  }

  nextPositionIndexes(positionIndexes: number[]): number[] {
    const next = [...positionIndexes];
    if (next.length) {
      next[next.length - 1] += 1;
    }
    return next;
  }

  prevPositionIndexes(positionIndexes: number[]): number[] {
    const prev = [...positionIndexes];
    if (prev.length) {
      prev[prev.length - 1] -= 1;
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
