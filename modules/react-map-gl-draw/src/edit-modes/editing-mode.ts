import { ImmutableFeatureCollection } from '@nebula.gl/edit-modes';
import type {
  Feature,
  FeatureCollection,
  ClickEvent,
  StopDraggingEvent,
  PointerMoveEvent,
  Position,
} from '@nebula.gl/edit-modes';
import { ModeProps } from '../types';

import { SHAPE, EDIT_TYPE, ELEMENT_TYPE, GEOJSON_TYPE, GUIDE_TYPE } from '../constants';
import BaseMode from './base-mode';
import {
  findClosestPointOnLineSegment,
  getFeatureCoordinates,
  isNumeric,
  updateRectanglePosition,
} from './utils';

export default class EditingMode extends BaseMode {
  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
    const picked = event.picks && event.picks[0];
    const selectedFeatureIndex = props.selectedIndexes && props.selectedIndexes[0];
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'featureIndex' does not exist on type 'Pi... Remove this comment to see the full error message
    if (!picked || !picked.object || picked.featureIndex !== selectedFeatureIndex) {
      return;
    }

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Pick'.
    const { type: objectType, featureIndex, index } = picked;
    const feature = this.getSelectedFeature(props, featureIndex);

    if (
      feature &&
      (feature.geometry.type === GEOJSON_TYPE.POLYGON ||
        feature.geometry.type === GEOJSON_TYPE.LINE_STRING) &&
      objectType === ELEMENT_TYPE.SEGMENT
    ) {
      const coordinates = getFeatureCoordinates(feature);
      if (!coordinates) {
        return;
      }
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'length' does not exist on type 'number |... Remove this comment to see the full error message
      const insertIndex = (index + 1) % coordinates.length;
      const positionIndexes =
        feature.geometry.type === SHAPE.POLYGON ? [0, insertIndex] : [insertIndex];
      const insertMapCoords = this._getPointOnSegment(feature, picked, event.mapCoords);

      const updatedData = new ImmutableFeatureCollection(props.data)
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'number[]' is not assignable to p... Remove this comment to see the full error message
        .addPosition(featureIndex, positionIndexes, insertMapCoords)
        .getObject();

      props.onEdit({
        editType: EDIT_TYPE.ADD_POSITION,
        updatedData,
        editContext: [
          {
            featureIndex,
            editHandleIndex: insertIndex,
            // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
            screenCoords: props.viewport && props.viewport.project(insertMapCoords),
            mapCoords: insertMapCoords,
          },
        ],
      });
    }
  }

  handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>) {
    // replace point
    const picked = event.picks && event.picks[0];

    // @ts-expect-error ts-migrate(2551) FIXME: Property 'Object' does not exist on type 'Pick'. D... Remove this comment to see the full error message
    if (!picked || !picked.Object || !isNumeric(picked.featureIndex)) {
      return;
    }

    const pickedObject = picked.object;
    switch (pickedObject.type) {
      case ELEMENT_TYPE.FEATURE:
      case ELEMENT_TYPE.FILL:
      case ELEMENT_TYPE.EDIT_HANDLE:
        this._handleDragging(event, props);

        break;
      default:
    }
  }

  _handleDragging(
    event: PointerMoveEvent | StopDraggingEvent,
    props: ModeProps<FeatureCollection>
  ) {
    const { onEdit } = props;
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    const selectedFeature = this.getSelectedFeature(props);
    // nothing clicked
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'isDragging' does not exist on type 'Poin... Remove this comment to see the full error message
    const { isDragging, pointerDownPicks, screenCoords } = event;
    const { lastPointerMoveEvent } = props;

    const clicked = pointerDownPicks && pointerDownPicks[0];
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'featureIndex' does not exist on type 'Pi... Remove this comment to see the full error message
    if (!clicked || !clicked.object || !isNumeric(clicked.featureIndex)) {
      return;
    }

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Pick'.
    const { type: objectType, index: editHandleIndex } = clicked;

    // not dragging
    let updatedData = null;
    const editType = isDragging ? EDIT_TYPE.MOVE_POSITION : EDIT_TYPE.FINISH_MOVE_POSITION;

    switch (objectType) {
      case ELEMENT_TYPE.FEATURE:
      case ELEMENT_TYPE.FILL:
      case ELEMENT_TYPE.SEGMENT:
        if (!props.featuresDraggable) {
          break;
        } // dragging feature

        const dx = screenCoords[0] - lastPointerMoveEvent.screenCoords[0];
        const dy = screenCoords[1] - lastPointerMoveEvent.screenCoords[1];
        updatedData = this._updateFeature(props, 'feature', { dx, dy });
        onEdit({
          editType,
          updatedData,
          editContext: null,
        });
        break;

      case ELEMENT_TYPE.EDIT_HANDLE:
        // dragging editHandle
        // dragging rectangle or other shapes
        const updateType =
          selectedFeature.properties.shape === SHAPE.RECTANGLE ? 'rectangle' : 'editHandle';
        updatedData = this._updateFeature(props, updateType, {
          editHandleIndex,
          mapCoords: event.mapCoords,
        });
        onEdit({
          editType,
          updatedData,
          editContext: null,
        });
        break;

      default:
    }
  }

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>) {
    // no selected feature
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    const selectedFeature = this.getSelectedFeature(props);
    if (!selectedFeature) {
      return;
    }
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'isDragging' does not exist on type 'Poin... Remove this comment to see the full error message
    if (!event.isDragging) {
      return;
    }

    this._handleDragging(event, props);
  }

  // TODO - refactor
  _updateFeature(props: ModeProps<FeatureCollection>, type: string, options: any = {}) {
    const { data, selectedIndexes, viewport } = props;

    const featureIndex = selectedIndexes && selectedIndexes[0];
    const feature = this.getSelectedFeature(props, featureIndex);

    let geometry = null;
    const coordinates = getFeatureCoordinates(feature);
    if (!coordinates) {
      return null;
    }

    // @ts-expect-error ts-migrate(2548) FIXME: Type 'number | [number, number] | [number, number,... Remove this comment to see the full error message
    let newCoordinates = [...coordinates];

    switch (type) {
      case 'editHandle':
        const positionIndexes =
          feature.geometry.type === GEOJSON_TYPE.POLYGON
            ? [0, options.editHandleIndex]
            : [options.editHandleIndex];

        return new ImmutableFeatureCollection(data)
          .replacePosition(featureIndex, positionIndexes, options.mapCoords)
          .getObject();

      case 'feature':
        const { dx, dy } = options;

        newCoordinates = newCoordinates
          .map((mapCoords) => {
            const pixels = viewport && viewport.project(mapCoords);
            if (pixels) {
              pixels[0] += dx;
              pixels[1] += dy;
              return viewport && viewport.unproject(pixels);
            }
            return null;
          })
          .filter(Boolean);
        geometry = {
          type: feature.geometry.type,
          coordinates:
            feature.geometry.type === GEOJSON_TYPE.POLYGON
              ? [newCoordinates]
              : feature.geometry.type === GEOJSON_TYPE.POINT
              ? newCoordinates[0]
              : newCoordinates,
        };

        return new ImmutableFeatureCollection(data)
          .replaceGeometry(featureIndex, geometry)
          .getObject();

      case 'rectangle':
        // moved editHandleIndex and destination mapCoords
        newCoordinates = updateRectanglePosition(
          // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'Feature' is not assignable to pa... Remove this comment to see the full error message
          feature,
          options.editHandleIndex,
          options.mapCoords
        );
        geometry = {
          type: GEOJSON_TYPE.POLYGON,
          coordinates: newCoordinates,
        };

        return new ImmutableFeatureCollection(data)
          .replaceGeometry(featureIndex, geometry)
          .getObject();

      default:
        return data && new ImmutableFeatureCollection(data).getObject();
    }
  }

  _getPointOnSegment(feature: Feature, picked: any, pickedMapCoords: Position) {
    const coordinates = getFeatureCoordinates(feature);
    if (!coordinates) {
      return null;
    }
    const srcVertexIndex = picked.index;
    const targetVertexIndex = picked.index + 1;
    return findClosestPointOnLineSegment(
      coordinates[srcVertexIndex],
      coordinates[targetVertexIndex],
      pickedMapCoords
    );
  }

  _getCursorEditHandle(event: PointerMoveEvent, feature: Feature) {
    // event can be null when the user has not interacted with the map whatsoever
    // and therefore props.lastPointerMoveEvent is still null
    // returning null here means we can e.g. set a featureIndex without requiring an event
    if (!event) {
      return null;
    }

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'isDragging' does not exist on type 'Poin... Remove this comment to see the full error message
    const { isDragging, picks } = event;
    // if not pick segment
    const picked = picks && picks[0];
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'featureIndex' does not exist on type 'Pi... Remove this comment to see the full error message
    if (!picked || !isNumeric(picked.featureIndex) || picked.type !== ELEMENT_TYPE.SEGMENT) {
      return null;
    }

    // if dragging or feature is neither polygon nor line string
    if (
      isDragging ||
      (feature.geometry.type !== GEOJSON_TYPE.POLYGON &&
        feature.geometry.type !== GEOJSON_TYPE.LINE_STRING)
    ) {
      return null;
    }

    const insertMapCoords = this._getPointOnSegment(feature, picked, event.mapCoords);

    if (!insertMapCoords) {
      return null;
    }

    return {
      type: 'Feature',
      properties: {
        guideType: GUIDE_TYPE.CURSOR_EDIT_HANDLE,
        shape: feature.properties.shape,
        positionIndexes: [-1],
        editHandleType: 'intermediate',
      },
      geometry: {
        type: GEOJSON_TYPE.POINT,
        coordinates: insertMapCoords,
      },
    };
  }
  // @ts-expect-error ts-migrate(2416) FIXME: Property 'getGuides' in type 'EditingMode' is not ... Remove this comment to see the full error message
  getGuides(props: ModeProps<FeatureCollection>) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    const selectedFeature = this.getSelectedFeature(props);
    const selectedFeatureIndex = props.selectedIndexes && props.selectedIndexes[0];

    if (!selectedFeature || selectedFeature.geometry.type === GEOJSON_TYPE.POINT) {
      return null;
    }

    const event = props.lastPointerMoveEvent;

    // feature editHandles
    const editHandles = this.getEditHandlesFromFeature(selectedFeature, selectedFeatureIndex) || [];

    // cursor editHandle
    const cursorEditHandle = this._getCursorEditHandle(event, selectedFeature);
    if (cursorEditHandle) {
      editHandles.push(cursorEditHandle);
    }

    return {
      type: 'FeatureCollection',
      features: editHandles.length ? editHandles : null,
    };
  }
}
