import { point, lineString as toLineString } from '@turf/helpers';
import { FeatureCollection, FeatureOf, LineString, Point, Polygon } from '../geojson-types';
import {
  ClickEvent,
  DraggingEvent,
  EditHandleFeature,
  GuideFeatureCollection,
  ModeProps,
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  Viewport,
} from '../types';
import {
  NearestPointType,
  getEditHandlesForGeometry,
  getPickedEditHandle,
  getPickedEditHandles,
  getPickedExistingEditHandle,
  getPickedIntermediateEditHandle,
  hasPolygonCrossingLines,
  nearestPointOnLine,
  nearestPointOnProjectedLine,
  recursivelyTraverseNestedArrays,
  updateRectanglePosition,
} from '../utils';
import { GeoJsonEditMode } from './geojson-edit-mode';
import { ImmutableFeatureCollection } from './immutable-feature-collection';

export class ModifyMode extends GeoJsonEditMode {
  private _featureCollectionBeforeDrag: FeatureCollection;
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
        !(
          props.modeConfig?.lockRectangles && featureAsPick.object.properties.shape === 'Rectangle'
        ) &&
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
            const candidateIntermediatePoint = this.getNearestPoint(
              // @ts-expect-error turf types too wide
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
  getNearestPoint(
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
    return nearestPointOnLine(line, inPoint, viewport);
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

      const feature = props.data.features[featureIndex];
      const canAddPosition = !(
        props.modeConfig?.lockRectangles && feature?.properties.shape === 'Rectangle'
      );

      if (canAddPosition) {
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
  }

  handleDragging(event: DraggingEvent, props: ModeProps<FeatureCollection>): void {
    const editHandle = getPickedEditHandle(event.pointerDownPicks);

    if (editHandle) {
      // Cancel map panning if pointer went down on an edit handle
      event.cancelPan();

      this._dragEditHandle('movePosition', props, editHandle, event);
    }
  }

  _dragEditHandle(
    editType: string,
    props: ModeProps<FeatureCollection>,
    editHandle: EditHandleFeature,
    event: StopDraggingEvent | DraggingEvent
  ) {
    const editHandleProperties = editHandle.properties;
    const editedFeature = props.data.features[editHandleProperties.featureIndex];

    let updatedData: FeatureCollection;
    if (props.modeConfig?.lockRectangles && editedFeature.properties.shape === 'Rectangle') {
      const coordinates = updateRectanglePosition(
        editedFeature as FeatureOf<Polygon>,
        editHandleProperties.positionIndexes[1],
        event.mapCoords
      );

      updatedData = new ImmutableFeatureCollection(props.data)
        .replaceGeometry(editHandleProperties.featureIndex, { coordinates, type: 'Polygon' })
        .getObject();
    } else {
      updatedData = new ImmutableFeatureCollection(props.data)
        .replacePosition(
          editHandleProperties.featureIndex,
          editHandleProperties.positionIndexes,
          event.mapCoords
        )
        .getObject();
    }

    props.onEdit({
      updatedData,
      editType,
      editContext: {
        featureIndexes: [editHandleProperties.featureIndex],
        positionIndexes: editHandleProperties.positionIndexes,
        position: event.mapCoords,
      },
    });
  }

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>): void {
    const cursor = this.getCursor(event);
    props.onUpdateCursor(cursor);
  }

  handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>) {
    // Stores previous state to revert to if drag ends with overlappingLines
    if (props?.modeConfig?.preventOverlappingLines) {
      this._featureCollectionBeforeDrag = new ImmutableFeatureCollection(props.data).getObject();
    }

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

    if (!editHandle || !selectedFeatureIndexes.length) {
      return;
    }

    if (
      this._featureCollectionBeforeDrag &&
      hasPolygonCrossingLines(
        (props.data.features[editHandle.properties.featureIndex].geometry as Polygon).coordinates[0]
      )
    ) {
      props.onEdit({
        updatedData: this._featureCollectionBeforeDrag,
        editType: 'finishMovePosition',
        editContext: {
          featureIndexes: [editHandle.properties.featureIndex],
          positionIndexes: editHandle.properties.positionIndexes,
          position: event.mapCoords,
        },
      });

      return;
    }

    this._dragEditHandle('finishMovePosition', props, editHandle, event);
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
