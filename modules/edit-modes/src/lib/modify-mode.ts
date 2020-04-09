import nearestPointOnLine from '@turf/nearest-point-on-line';
import { point, lineString as toLineString } from '@turf/helpers';
import {
  recursivelyTraverseNestedArrays,
  nearestPointOnProjectedLine,
  getEditHandlesForGeometry,
  getPickedEditHandles,
  getPickedEditHandle,
  getPickedExistingEditHandle,
  getPickedIntermediateEditHandle,
  NearestPointType,
} from '../utils';
import { LineString, Point, FeatureCollection, FeatureOf } from '../geojson-types';
import {
  ModeProps,
  ClickEvent,
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  DraggingEvent,
  Viewport,
  GuideFeatureCollection,
} from '../types';
import { GeoJsonEditMode } from './geojson-edit-mode';
import { ImmutableFeatureCollection } from './immutable-feature-collection';

export class ModifyMode extends GeoJsonEditMode {
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
      const featureAsPick = !existingEditHandle && picks.find((pick) => !pick.isGuide);

      // is the feature in the pick selected
      if (
        featureAsPick &&
        !featureAsPick.object.geometry.type.includes('Point') &&
        props.selectedIndexes.includes(featureAsPick.index)
      ) {
        let intermediatePoint: NearestPointType | null | undefined = null;
        let positionIndexPrefix = [];
        const referencePoint = point(mapCoords);
        // process all lines of the (single) feature
        recursivelyTraverseNestedArrays(
          featureAsPick.object.geometry.coordinates,
          [],
          (lineString, prefix) => {
            const lineStringFeature = toLineString(lineString);
            const candidateIntermediatePoint = this.nearestPointOnLine(
              // @ts-ignore
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
            properties: { index },
          } = intermediatePoint;
          handles.push({
            type: 'Feature',
            properties: {
              guideType: 'editHandle',
              editHandleType: 'intermediate',
              featureIndex: featureAsPick.index,
              positionIndexes: [...positionIndexPrefix, index + 1],
            },
            geometry: {
              type: 'Point',
              coordinates: position,
            },
          });
        }
      }
    }

    return {
      type: 'FeatureCollection',
      features: handles,
    };
  }

  // turf.js does not support elevation for nearestPointOnLine
  nearestPointOnLine(
    line: FeatureOf<LineString>,
    inPoint: FeatureOf<Point>,
    viewport: Viewport | null | undefined
  ): NearestPointType {
    const { coordinates } = line.geometry;
    if (coordinates.some((coord) => coord.length > 2)) {
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
      const { featureIndex, positionIndexes } = pickedExistingHandle.properties;

      let updatedData;
      try {
        updatedData = new ImmutableFeatureCollection(props.data)
          .removePosition(featureIndex, positionIndexes)
          .getObject();
      } catch (ignored) {
        // This happens if user attempts to remove the last point
      }

      if (updatedData) {
        props.onEdit({
          updatedData,
          editType: 'removePosition',
          editContext: {
            featureIndexes: [featureIndex],
            positionIndexes,
            position: pickedExistingHandle.geometry.coordinates,
          },
        });
      }
    } else if (pickedIntermediateHandle) {
      const { featureIndex, positionIndexes } = pickedIntermediateHandle.properties;

      const updatedData = new ImmutableFeatureCollection(props.data)
        .addPosition(featureIndex, positionIndexes, pickedIntermediateHandle.geometry.coordinates)
        .getObject();

      if (updatedData) {
        props.onEdit({
          updatedData,
          editType: 'addPosition',
          editContext: {
            featureIndexes: [featureIndex],
            positionIndexes,
            position: pickedIntermediateHandle.geometry.coordinates,
          },
        });
      }
    }
  }

  handleDragging(event: DraggingEvent, props: ModeProps<FeatureCollection>): void {
    const editHandle = getPickedEditHandle(event.pointerDownPicks);

    if (editHandle) {
      // Cancel map panning if pointer went down on an edit handle
      event.cancelPan();

      const editHandleProperties = editHandle.properties;

      const updatedData = new ImmutableFeatureCollection(props.data)
        .replacePosition(
          editHandleProperties.featureIndex,
          editHandleProperties.positionIndexes,
          event.mapCoords
        )
        .getObject();

      props.onEdit({
        updatedData,
        editType: 'movePosition',
        editContext: {
          featureIndexes: [editHandleProperties.featureIndex],
          positionIndexes: editHandleProperties.positionIndexes,
          position: event.mapCoords,
        },
      });
    }
  }

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>): void {
    const cursor = this.getCursor(event);
    props.onUpdateCursor(cursor);
  }

  handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>) {
    const selectedFeatureIndexes = props.selectedIndexes;

    const editHandle = getPickedIntermediateEditHandle(event.picks);
    if (selectedFeatureIndexes.length && editHandle) {
      const editHandleProperties = editHandle.properties;

      const updatedData = new ImmutableFeatureCollection(props.data)
        .addPosition(
          editHandleProperties.featureIndex,
          editHandleProperties.positionIndexes,
          event.mapCoords
        )
        .getObject();

      props.onEdit({
        updatedData,
        editType: 'addPosition',
        editContext: {
          featureIndexes: [editHandleProperties.featureIndex],
          positionIndexes: editHandleProperties.positionIndexes,
          position: event.mapCoords,
        },
      });
    }
  }

  handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>) {
    const selectedFeatureIndexes = props.selectedIndexes;
    const editHandle = getPickedEditHandle(event.picks);
    if (selectedFeatureIndexes.length && editHandle) {
      const editHandleProperties = editHandle.properties;

      const updatedData = new ImmutableFeatureCollection(props.data)
        .replacePosition(
          editHandleProperties.featureIndex,
          editHandleProperties.positionIndexes,
          event.mapCoords
        )
        .getObject();

      props.onEdit({
        updatedData,
        editType: 'finishMovePosition',
        editContext: {
          featureIndexes: [editHandleProperties.featureIndex],
          positionIndexes: editHandleProperties.positionIndexes,
          position: event.mapCoords,
        },
      });
    }
  }

  getCursor(event: PointerMoveEvent): string | null | undefined {
    const picks = (event && event.picks) || [];

    const handlesPicked = getPickedEditHandles(picks);
    if (handlesPicked.length) {
      return 'cell';
    }
    return null;
  }
}
