import nearestPointOnLine from '@turf/nearest-point-on-line';
import { point, lineString as toLineString } from '@turf/helpers';
import circle from '@turf/circle';
import distance from '@turf/distance';
import turfCenter from '@turf/center';
import {
  recursivelyTraverseNestedArrays,
  nearestPointOnProjectedLine,
  getPickedEditHandles,
  getPickedEditHandle,
  NearestPointType,
} from '../utils';
import { LineString, Point, FeatureCollection, FeatureOf } from '../geojson-types';
import {
  ModeProps,
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  DraggingEvent,
  Viewport,
  EditHandleFeature,
  GuideFeatureCollection,
} from '../types';
import { GeoJsonEditMode } from './geojson-edit-mode';
import { ImmutableFeatureCollection } from './immutable-feature-collection';

export class ResizeCircleMode extends GeoJsonEditMode {
  _selectedEditHandle: EditHandleFeature | null | undefined;
  _isResizing = false;

  getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection {
    const handles = [];
    const selectedFeatureIndexes = props.selectedIndexes;

    const { lastPointerMoveEvent } = props;
    const picks = lastPointerMoveEvent && lastPointerMoveEvent.picks;
    const mapCoords = lastPointerMoveEvent && lastPointerMoveEvent.mapCoords;

    // intermediate edit handle
    if (
      picks &&
      picks.length &&
      mapCoords &&
      selectedFeatureIndexes.length === 1 &&
      !this._isResizing
    ) {
      const featureAsPick = picks.find((pick) => !pick.isGuide);

      // is the feature in the pick selected
      if (
        featureAsPick &&
        featureAsPick.object.properties.shape &&
        featureAsPick.object.properties.shape.includes('Circle') &&
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

  handleDragging(event: DraggingEvent, props: ModeProps<FeatureCollection>): void {
    const editHandle = getPickedEditHandle(event.pointerDownPicks);

    if (editHandle) {
      // Cancel map panning if pointer went down on an edit handle
      event.cancelPan();

      const editHandleProperties = editHandle.properties;

      const feature = this.getSelectedFeature(props);
      const center = turfCenter(feature).geometry.coordinates;
      const numberOfSteps = Object.entries(feature.geometry.coordinates[0]).length - 1;
      const radius = Math.max(distance(center, event.mapCoords), 0.001);

      const { steps = numberOfSteps } = {};
      const options = { steps };
      const updatedFeature = circle(center, radius, options);
      const geometry = updatedFeature.geometry;

      const updatedData = new ImmutableFeatureCollection(props.data)
        .replaceGeometry(editHandleProperties.featureIndex, geometry)
        .getObject();

      props.onEdit({
        updatedData,
        editType: 'unionGeometry',
        editContext: {
          featureIndexes: [editHandleProperties.featureIndex],
        },
      });
    }
  }

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>): void {
    if (!this._isResizing) {
      const selectedEditHandle = getPickedEditHandle(event.picks);
      this._selectedEditHandle =
        selectedEditHandle && selectedEditHandle.properties.editHandleType === 'intermediate'
          ? selectedEditHandle
          : null;
    }

    const cursor = this.getCursor(event);
    props.onUpdateCursor(cursor);
  }

  handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>) {
    if (this._selectedEditHandle) {
      this._isResizing = true;
    }
  }

  handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>) {
    if (this._isResizing) {
      this._selectedEditHandle = null;
      this._isResizing = false;
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
