// @flow

import nearestPointOnLine from '@turf/nearest-point-on-line';
import { point, lineString as toLineString } from '@turf/helpers';
import { recursivelyTraverseNestedArrays } from '../utils.js';
import type { Position } from '../geojson-types.js';
import type {
  ClickEvent,
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent
} from '../event-types.js';
import type { EditAction, EditHandle } from './mode-handler.js';
import { ModeHandler, getPickedEditHandle, getEditHandlesForGeometry } from './mode-handler.js';

export class ModifyHandler extends ModeHandler {
  _lastPointerMovePicks: *;

  getEditHandles(picks?: Array<Object>, groundCoords?: Position): EditHandle[] {
    let handles = [];
    const { features } = this.featureCollection.getObject();

    for (const index of this._selectedFeatureIndexes) {
      if (index < features.length) {
        const { geometry } = features[index];
        handles.push(...getEditHandlesForGeometry(geometry, index));
      } else {
        console.warn(`selectedFeatureIndexes out of range ${index}`); // eslint-disable-line no-console,no-undef
      }
    }

    // intermediate edit handle
    if (picks && picks.length && groundCoords) {
      const existingEditHandle = picks.find(
        pick => pick.isEditingHandle && pick.object && pick.object.type === 'existing'
      );
      // don't show intermediate point when too close to an existing edit handle
      const featureAsPick = !existingEditHandle && picks.find(pick => !pick.isEditingHandle);

      // is the feature in the pick selected
      if (
        featureAsPick &&
        !featureAsPick.object.geometry.type.includes('Point') &&
        this._selectedFeatureIndexes.includes(featureAsPick.index)
      ) {
        let intermediatePoint = null;
        let positionIndexPrefix = [];
        const referencePoint = point(groundCoords);
        // process all lines of the (single) feature
        recursivelyTraverseNestedArrays(
          featureAsPick.object.geometry.coordinates,
          [],
          (lineString, prefix) => {
            const lineStringFeature = toLineString(lineString);
            const candidateIntermediatePoint = this.nearestPointOnLine(
              lineStringFeature,
              referencePoint
            );
            if (
              !intermediatePoint ||
              candidateIntermediatePoint.properties.dist < intermediatePoint.properties.dist
            ) {
              intermediatePoint = candidateIntermediatePoint;
              positionIndexPrefix = prefix;
            }
          }
        );
        // tack on the lone intermediate point to the set of handles
        if (intermediatePoint) {
          const {
            geometry: { coordinates: position },
            properties: { index }
          } = intermediatePoint;
          handles = [
            ...handles,
            {
              position,
              positionIndexes: [...positionIndexPrefix, index + 1],
              featureIndex: featureAsPick.index,
              type: 'intermediate'
            }
          ];
        }
      }
    }

    return handles;
  }

  // turf.js does not support elevation for nearestPointOnLine
  nearestPointOnLine(line: any, inPoint: any): any {
    // TODO: implement 3D nearestPointOnLine
    return nearestPointOnLine(line, inPoint);
  }

  handleClick(event: ClickEvent): ?EditAction {
    let editAction: ?EditAction = null;

    const clickedEditHandle = getPickedEditHandle(event.picks);

    if (clickedEditHandle && clickedEditHandle.featureIndex >= 0) {
      if (clickedEditHandle.type === 'existing') {
        let updatedData;
        try {
          updatedData = this.getImmutableFeatureCollection()
            .removePosition(clickedEditHandle.featureIndex, clickedEditHandle.positionIndexes)
            .getObject();
        } catch (ignored) {
          // This happens if user attempts to remove the last point
        }

        if (updatedData) {
          editAction = {
            updatedData,
            editType: 'removePosition',
            featureIndexes: [clickedEditHandle.featureIndex],
            editContext: {
              positionIndexes: clickedEditHandle.positionIndexes,
              position: clickedEditHandle.position
            }
          };
        }
      } else if (clickedEditHandle.type === 'intermediate') {
        const updatedData = this.getImmutableFeatureCollection()
          .addPosition(
            clickedEditHandle.featureIndex,
            clickedEditHandle.positionIndexes,
            clickedEditHandle.position
          )
          .getObject();

        if (updatedData) {
          editAction = {
            updatedData,
            editType: 'addPosition',
            featureIndexes: [clickedEditHandle.featureIndex],
            editContext: {
              positionIndexes: clickedEditHandle.positionIndexes,
              position: clickedEditHandle.position
            }
          };
        }
      }
    }
    return editAction;
  }

  handlePointerMove(event: PointerMoveEvent): { editAction: ?EditAction, cancelMapPan: boolean } {
    this._lastPointerMovePicks = event.picks;

    let editAction: ?EditAction = null;

    const editHandle = getPickedEditHandle(event.pointerDownPicks);

    if (event.isDragging && editHandle) {
      const updatedData = this.getImmutableFeatureCollection()
        .replacePosition(editHandle.featureIndex, editHandle.positionIndexes, event.groundCoords)
        .getObject();

      editAction = {
        updatedData,
        editType: 'movePosition',
        featureIndexes: [editHandle.featureIndex],
        editContext: {
          positionIndexes: editHandle.positionIndexes,
          position: event.groundCoords
        }
      };
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
      const updatedData = this.getImmutableFeatureCollection()
        .addPosition(editHandle.featureIndex, editHandle.positionIndexes, event.groundCoords)
        .getObject();

      editAction = {
        updatedData,
        editType: 'addPosition',
        featureIndexes: [editHandle.featureIndex],
        editContext: {
          positionIndexes: editHandle.positionIndexes,
          position: event.groundCoords
        }
      };
    }

    return editAction;
  }

  handleStopDragging(event: StopDraggingEvent): ?EditAction {
    let editAction: ?EditAction = null;

    const selectedFeatureIndexes = this.getSelectedFeatureIndexes();
    const editHandle = getPickedEditHandle(event.picks);
    if (selectedFeatureIndexes.length && editHandle) {
      const updatedData = this.getImmutableFeatureCollection()
        .replacePosition(editHandle.featureIndex, editHandle.positionIndexes, event.groundCoords)
        .getObject();

      editAction = {
        updatedData,
        editType: 'finishMovePosition',
        featureIndexes: [editHandle.featureIndex],
        editContext: {
          positionIndexes: editHandle.positionIndexes,
          position: event.groundCoords
        }
      };
    }

    return editAction;
  }

  getCursor({ isDragging }: { isDragging: boolean }): string {
    const picks = this._lastPointerMovePicks;

    if (picks && picks.length > 0) {
      const handlePicked = picks.some(pick => pick.isEditingHandle);
      if (handlePicked) {
        return 'cell';
      }
    }

    return isDragging ? 'grabbing' : 'grab';
  }
}
