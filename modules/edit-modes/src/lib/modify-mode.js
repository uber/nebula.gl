// @flow

import nearestPointOnLine from '@turf/nearest-point-on-line';
import { point, lineString as toLineString } from '@turf/helpers';
import {
  recursivelyTraverseNestedArrays,
  nearestPointOnProjectedLine,
  type NearestPointType
} from '../utils.js';
import type {
  Position,
  LineString,
  Point,
  FeatureCollection,
  FeatureOf
} from '../geojson-types.js';
import type {
  ModeProps,
  ClickEvent,
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  Viewport
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
import { ImmutableFeatureCollection } from './immutable-feature-collection.js';

export class ModifyMode extends BaseGeoJsonEditMode {
  getEditHandlesAdapter(
    picks: ?Array<Object>,
    mapCoords: ?Position,
    props: ModeProps<FeatureCollection>
  ): EditHandle[] {
    let handles = [];
    const { features } = props.data;

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
        let intermediatePoint: ?NearestPointType = null;
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
              referencePoint,
              props.modeConfig && props.modeConfig.viewport
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
  nearestPointOnLine(
    line: FeatureOf<LineString>,
    inPoint: FeatureOf<Point>,
    viewport: ?Viewport
  ): NearestPointType {
    const { coordinates } = line.geometry;
    if (coordinates.some(coord => coord.length > 2)) {
      if (viewport) {
        // This line has elevation, we need to use alternative algorithm
        return nearestPointOnProjectedLine(line, inPoint, viewport);
      }
      // eslint-disable-next-line no-console,no-undef
      console.log(
        'Editing 3D point but modeConfig.viewport not provided. Falling back to 2D logic.'
      );
    }

    return nearestPointOnLine(line, inPoint);
  }

  handleClickAdapter(event: ClickEvent, props: ModeProps<FeatureCollection>): ?GeoJsonEditAction {
    let editAction: ?GeoJsonEditAction = null;

    const pickedExistingHandle = getPickedExistingEditHandle(event.picks);
    const pickedIntermediateHandle = getPickedIntermediateEditHandle(event.picks);

    if (pickedExistingHandle) {
      let updatedData;
      try {
        updatedData = new ImmutableFeatureCollection(props.data)
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
      const updatedData = new ImmutableFeatureCollection(props.data)
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
    let editAction: ?GeoJsonEditAction = null;

    const editHandle = getPickedEditHandle(event.pointerDownPicks);

    if (event.isDragging && editHandle) {
      const updatedData = new ImmutableFeatureCollection(props.data)
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
      const updatedData = new ImmutableFeatureCollection(props.data)
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
      const updatedData = new ImmutableFeatureCollection(props.data)
        .replacePosition(editHandle.featureIndex, editHandle.positionIndexes, event.mapCoords)
        .getObject();

      editAction = {
        updatedData,
        editType: 'finishMovePosition',
        editContext: {
          featureIndexes: [editHandle.featureIndex],
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
