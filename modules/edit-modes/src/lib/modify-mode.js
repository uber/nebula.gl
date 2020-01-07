// @flow

import nearestPointOnLine from '@turf/nearest-point-on-line';
import { point, lineString as toLineString } from '@turf/helpers';
import {
  recursivelyTraverseNestedArrays,
  nearestPointOnProjectedLine,
  getEditHandlesForGeometry,
  type NearestPointType
} from '../utils.js';
import type { LineString, Point, FeatureCollection, FeatureOf } from '../geojson-types.js';
import type {
  ModeProps,
  ClickEvent,
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  Viewport,
  GuideFeatureCollection
} from '../types.js';
import {
  BaseGeoJsonEditMode,
  getPickedEditHandle,
  getPickedEditHandles,
  getPickedExistingEditHandle,
  getPickedIntermediateEditHandle,
  type GeoJsonEditAction
} from './geojson-edit-mode.js';
import { ImmutableFeatureCollection } from './immutable-feature-collection.js';

export class ModifyMode extends BaseGeoJsonEditMode {
  getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection {
    const handles = [];

    const { data, lastPointerMoveEvent } = props;
    const { features } = data;
    const picks = lastPointerMoveEvent && lastPointerMoveEvent.picks;
    const mapCoords = lastPointerMoveEvent && lastPointerMoveEvent.mapCoords;

    for (const index of props.selectedIndexes) {
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
        props.selectedIndexes.includes(featureAsPick.index)
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
          handles.push({
            type: 'Feature',
            properties: {
              guideType: 'editHandle',
              editHandleType: 'intermediate',
              featureIndex: featureAsPick.index,
              positionIndexes: [...positionIndexPrefix, index + 1]
            },
            geometry: {
              type: 'Point',
              coordinates: position
            }
          });
        }
      }
    }

    return {
      type: 'FeatureCollection',
      features: handles
    };
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

  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
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
        props.onEdit({
          updatedData,
          editType: 'removePosition',
          editContext: {
            featureIndexes: [pickedExistingHandle.featureIndex],
            positionIndexes: pickedExistingHandle.positionIndexes,
            position: pickedExistingHandle.position
          }
        });
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
        props.onEdit({
          updatedData,
          editType: 'addPosition',
          editContext: {
            featureIndexes: [pickedIntermediateHandle.featureIndex],
            positionIndexes: pickedIntermediateHandle.positionIndexes,
            position: pickedIntermediateHandle.position
          }
        });
      }
    }
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

  handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>) {
    const selectedFeatureIndexes = props.selectedIndexes;

    const editHandle = getPickedIntermediateEditHandle(event.picks);
    if (selectedFeatureIndexes.length && editHandle) {
      const updatedData = new ImmutableFeatureCollection(props.data)
        .addPosition(editHandle.featureIndex, editHandle.positionIndexes, event.mapCoords)
        .getObject();

      props.onEdit({
        updatedData,
        editType: 'addPosition',
        editContext: {
          featureIndexes: [editHandle.featureIndex],
          positionIndexes: editHandle.positionIndexes,
          position: event.mapCoords
        }
      });
    }
  }

  handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>) {
    const selectedFeatureIndexes = props.selectedIndexes;
    const editHandle = getPickedEditHandle(event.picks);
    if (selectedFeatureIndexes.length && editHandle) {
      const updatedData = new ImmutableFeatureCollection(props.data)
        .replacePosition(editHandle.featureIndex, editHandle.positionIndexes, event.mapCoords)
        .getObject();

      props.onEdit({
        updatedData,
        editType: 'finishMovePosition',
        editContext: {
          featureIndexes: [editHandle.featureIndex],
          positionIndexes: editHandle.positionIndexes,
          position: event.mapCoords
        }
      });
    }
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
