// @flow

import nearestPointOnLine from '@turf/nearest-point-on-line';
import { point, lineString as toLineString } from '@turf/helpers';
import { recursivelyTraverseNestedArrays } from '../utils.js';
import type { Position, FeatureCollection } from '../geojson-types.js';
import type {
  ModeProps,
  ClickEvent,
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent
} from '../types.js';
import {
  BaseGeoJsonEditMode,
  getPickedEditHandle,
  getPickedEditHandles,
  getPickedExistingEditHandle,
  getPickedIntermediateEditHandle,
  getEditHandlesForGeometry,
  type GeoJsonEditAction,
  type EditHandle
} from './geojson-edit-mode.js';

export class ModifyMode extends BaseGeoJsonEditMode {
  getEditHandlesAdapter(
    picks: ?Array<Object>,
    mapCoords: ?Position,
    props: ModeProps<FeatureCollection>
  ): EditHandle[] {
    this.setFeatureCollection(props.data);
    let handles = [];
    const { features } = this.getFeatureCollection();

    for (const index of this.getSelectedFeatureIndexes(props)) {
      if (index < features.length) {
        const { geometry } = features[index];
        handles.push(...getEditHandlesForGeometry(geometry, index));
      } else {
        console.warn(`selectedFeatureIndexes out of range ${index}`); // eslint-disable-line no-console,no-undef
      }
    }

    // intermediate edit handle
    if (picks && picks.length && mapCoords) {
      const existingEditHandle = getPickedExistingEditHandle(picks);
      // don't show intermediate point when too close to an existing edit handle
      const featureAsPick = !existingEditHandle && picks.find(pick => !pick.isGuide);

      // is the feature in the pick selected
      if (
        featureAsPick &&
        !featureAsPick.object.geometry.type.includes('Point') &&
        this.getSelectedFeatureIndexes(props).includes(featureAsPick.index)
      ) {
        let intermediatePoint = null;
        let positionIndexPrefix = [];
        const referencePoint = point(mapCoords);
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

  handleClickAdapter(event: ClickEvent): ?GeoJsonEditAction {
    let editAction: ?GeoJsonEditAction = null;

    const pickedExistingHandle = getPickedExistingEditHandle(event.picks);
    const pickedIntermediateHandle = getPickedIntermediateEditHandle(event.picks);

    if (pickedExistingHandle) {
      let updatedData;
      try {
        updatedData = this.getImmutableFeatureCollection()
          .removePosition(pickedExistingHandle.featureIndex, pickedExistingHandle.positionIndexes)
          .getObject();
      } catch (ignored) {
        // This happens if user attempts to remove the last point
      }

      if (updatedData) {
        editAction = {
          updatedData,
          editType: 'removePosition',
          editContext: {
            featureIndexes: [pickedExistingHandle.featureIndex],
            positionIndexes: pickedExistingHandle.positionIndexes,
            position: pickedExistingHandle.position
          }
        };
      }
    } else if (pickedIntermediateHandle) {
      const updatedData = this.getImmutableFeatureCollection()
        .addPosition(
          pickedIntermediateHandle.featureIndex,
          pickedIntermediateHandle.positionIndexes,
          pickedIntermediateHandle.position
        )
        .getObject();

      if (updatedData) {
        editAction = {
          updatedData,
          editType: 'addPosition',
          editContext: {
            featureIndexes: [pickedIntermediateHandle.featureIndex],
            positionIndexes: pickedIntermediateHandle.positionIndexes,
            position: pickedIntermediateHandle.position
          }
        };
      }
    }
    return editAction;
  }

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>): void {
    this.setFeatureCollection(props.data);
    let editAction: ?GeoJsonEditAction = null;

    const editHandle = getPickedEditHandle(event.pointerDownPicks);

    if (event.isDragging && editHandle) {
      const updatedData = this.getImmutableFeatureCollection()
        .replacePosition(editHandle.featureIndex, editHandle.positionIndexes, event.mapCoords)
        .getObject();

      editAction = {
        updatedData,
        editType: 'movePosition',
        editContext: {
          featureIndexes: [editHandle.featureIndex],
          positionIndexes: editHandle.positionIndexes,
          position: event.mapCoords
        }
      };

      props.onEdit(editAction);
    }

    const cursor = this.getCursor(event);
    props.onUpdateCursor(cursor);

    // Cancel map panning if pointer went down on an edit handle
    const cancelMapPan = Boolean(editHandle);
    if (cancelMapPan) {
      event.sourceEvent.stopPropagation();
    }
  }

  handleStartDraggingAdapter(
    event: StartDraggingEvent,
    props: ModeProps<FeatureCollection>
  ): ?GeoJsonEditAction {
    let editAction: ?GeoJsonEditAction = null;

    const selectedFeatureIndexes = this.getSelectedFeatureIndexes(props);

    const editHandle = getPickedIntermediateEditHandle(event.picks);
    if (selectedFeatureIndexes.length && editHandle) {
      const updatedData = this.getImmutableFeatureCollection()
        .addPosition(editHandle.featureIndex, editHandle.positionIndexes, event.mapCoords)
        .getObject();

      editAction = {
        updatedData,
        editType: 'addPosition',
        editContext: {
          featureIndexes: [editHandle.featureIndex],
          positionIndexes: editHandle.positionIndexes,
          position: event.mapCoords
        }
      };
    }

    return editAction;
  }

  handleStopDraggingAdapter(
    event: StopDraggingEvent,
    props: ModeProps<FeatureCollection>
  ): ?GeoJsonEditAction {
    let editAction: ?GeoJsonEditAction = null;

    const selectedFeatureIndexes = this.getSelectedFeatureIndexes(props);
    const editHandle = getPickedEditHandle(event.picks);
    if (selectedFeatureIndexes.length && editHandle) {
      const updatedData = this.getImmutableFeatureCollection()
        .replacePosition(editHandle.featureIndex, editHandle.positionIndexes, event.mapCoords)
        .getObject();

      editAction = {
        updatedData,
        editType: 'finishMovePosition',
        featureIndexes: [editHandle.featureIndex],
        editContext: {
          positionIndexes: editHandle.positionIndexes,
          position: event.mapCoords
        }
      };
    }

    return editAction;
  }

  getCursor(event: PointerMoveEvent): ?string {
    const picks = (event && event.picks) || [];

    const handlesPicked = getPickedEditHandles(picks);
    if (handlesPicked.length) {
      return 'cell';
    }
    return null;
  }
}
