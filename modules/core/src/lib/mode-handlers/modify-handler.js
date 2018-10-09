// @flow

import nearestPointOnLine from '@turf/nearest-point-on-line';
import turfTransformRotate from '@turf/transform-rotate';
import { point, lineString as toLineString } from '@turf/helpers';
import { recursivelyTraverseNestedArrays } from '../utils.js';
import type { Position } from '../../geojson-types.js';
import type {
  ClickEvent,
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent
} from '../event-types.js';
import type { EditAction, EditHandle } from './mode-handler.js';
import { ModeHandler, getPickedEditHandle, getEditHandlesForGeometry } from './mode-handler.js';

export class ModifyHandler extends ModeHandler {
  getEditHandles(picks?: Array<Object>, groundCoords?: Position): EditHandle[] {
    let handles = [];

    for (const index of this._selectedFeatureIndexes) {
      const geometry = this.featureCollection.getObject().features[index].geometry;
      handles = handles.concat(getEditHandlesForGeometry(geometry, index));
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
            const candidateIntermediatePoint = nearestPointOnLine(
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
  handleClick(event: ClickEvent): ?EditAction {
    let editAction: ?EditAction = null;

    const clickedEditHandle = getPickedEditHandle(event.picks);

    if (
      clickedEditHandle &&
      clickedEditHandle.type === 'existing' &&
      clickedEditHandle.featureIndex >= 0
    ) {
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
          featureIndex: clickedEditHandle.featureIndex,
          positionIndexes: clickedEditHandle.positionIndexes,
          position: null
        };
      }
    }

    // TODO: also check if clicked on intermediate handle. should probably addPosition

    return editAction;
  }

  handlePointerMove(event: PointerMoveEvent): { editAction: ?EditAction, cancelMapPan: boolean } {
    let editAction: ?EditAction = null;

    const editHandle = getPickedEditHandle(event.dragStartPicks);

    if (event.isDragging && editHandle) {
      const updatedData = this.getImmutableFeatureCollection()
        .replacePosition(editHandle.featureIndex, editHandle.positionIndexes, event.groundCoords)
        .getObject();

      editAction = {
        updatedData,
        editType: 'movePosition',
        featureIndex: editHandle.featureIndex,
        positionIndexes: editHandle.positionIndexes,
        position: event.groundCoords
      };
    }

    const modeConfig = this.getModeConfig();
    if (modeConfig && modeConfig.action === 'transformRotate') {
      let pivot;
      const selectedFeatureIndexes = this.getSelectedFeatureIndexes();
      const picks = event.picks;

      if (selectedFeatureIndexes.length === 0 || selectedFeatureIndexes.length > 1) {
        return { editAction: null, cancelMapPan: false };
      }

      if (modeConfig && modeConfig.usePickAsPivot) {
        // do nothing when mouse position far away from any point
        if (!picks || !picks.length || !picks[0].object.position) {
          return { editAction: null, cancelMapPan: false };
        }
        pivot = picks[0].object.position;
      } else {
        pivot = modeConfig.pivot;
      }
      const featureIndex = selectedFeatureIndexes[0];
      const geometry = this.getSelectedGeometry();
      const rotatedFeature = turfTransformRotate(geometry, 2, { pivot });

      const updatedData = this.getImmutableFeatureCollection()
        .replaceGeometry(featureIndex, rotatedFeature)
        .getObject();

      editAction = {
        updatedData,
        editType: 'transformPosition',
        featureIndex,
        positionIndexes: null,
        position: null
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
        featureIndex: editHandle.featureIndex,
        positionIndexes: editHandle.positionIndexes,
        position: event.groundCoords
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
        featureIndex: editHandle.featureIndex,
        positionIndexes: editHandle.positionIndexes,
        position: event.groundCoords
      };
    }

    return editAction;
  }
}
