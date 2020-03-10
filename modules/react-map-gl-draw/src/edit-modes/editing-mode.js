// @flow

import type {
  Feature,
  FeatureCollection,
  ClickEvent,
  StopDraggingEvent,
  PointerMoveEvent,
  Position
} from '@nebula.gl/edit-modes';
import type { ModeProps } from '../types';

import { RENDER_TYPE, EDIT_TYPE, ELEMENT_TYPE, GEOJSON_TYPE, GUIDE_TYPE } from '../constants';
import BaseMode from './base-mode';
import {
  findClosestPointOnLineSegment,
  getFeatureCoordinates,
  isNumeric,
  updateRectanglePosition
} from './utils';

export default class EditingMode extends BaseMode {
  handleClick = (event: ClickEvent, props: ModeProps<FeatureCollection>) => {
    const pickedObject = event.picks && event.picks[0] && event.picks[0].object;
    const selectedFeatureIndex = props.selectedIndexes && props.selectedIndexes[0];
    if (!pickedObject || pickedObject.featureIndex !== selectedFeatureIndex) {
      return;
    }

    const { featureIndex, index } = pickedObject;
    const feature = this.getSelectedFeature(props, featureIndex);
    if (
      feature &&
      (feature.geometry.type === RENDER_TYPE.POLYGON ||
        feature.geometry.type === RENDER_TYPE.LINE_STRING) &&
      pickedObject.type === ELEMENT_TYPE.SEGMENT
    ) {
      const coordinates = getFeatureCoordinates(feature);
      if (!coordinates) {
        return;
      }
      const insertIndex = (index + 1) % coordinates.length;
      const positionIndexes =
        feature.geometry.type === RENDER_TYPE.POLYGON ? [0, insertIndex] : [insertIndex];
      const insertMapCoords = this._getPointOnSegment(feature, pickedObject, event.mapCoords);

      const updatedData = props.data
        .addPosition(featureIndex, positionIndexes, insertMapCoords)
        .getObject();

      props.onEdit({
        editType: EDIT_TYPE.ADD_POSITION,
        updatedData,
        editContext: [
          {
            featureIndex,
            editHandleIndex: insertIndex,
            screenCoords: props.viewport && props.viewport.project(insertMapCoords),
            mapCoords: insertMapCoords
          }
        ]
      });
    }
  };

  handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>) {
    // replace point
    const pickedObject = event.picks && event.picks[0] && event.picks[0].object;
    if (!pickedObject || !isNumeric(pickedObject.featureIndex)) {
      return;
    }

    switch (pickedObject.type) {
      case ELEMENT_TYPE.FEATURE:
      case ELEMENT_TYPE.FILL:
      case ELEMENT_TYPE.EDIT_HANDLE:
        this._handleDragging(event, props);
        break;
      default:
    }
  }

  _handleDragging = (
    event: PointerMoveEvent | StopDraggingEvent,
    props: ModeProps<FeatureCollection>
  ) => {
    const { onEdit } = props;
    const selectedFeature = this.getSelectedFeature(props);
    // nothing clicked
    const { isDragging, pointerDownPicks, screenCoords } = event;
    const { lastPointerMoveEvent } = props;

    const clickedObject = pointerDownPicks && pointerDownPicks[0] && pointerDownPicks[0].object;
    if (!clickedObject || !isNumeric(clickedObject.featureIndex)) {
      return;
    }

    const editHandleIndex = clickedObject.index;

    // not dragging
    let updatedData = null;
    const editType = isDragging ? EDIT_TYPE.MOVE_POSITION : EDIT_TYPE.FINISH_MOVE_POSITION;

    switch (clickedObject.type) {
      case ELEMENT_TYPE.FEATURE:
      case ELEMENT_TYPE.FILL:
      case ELEMENT_TYPE.SEGMENT:
        // dragging feature
        const dx = screenCoords[0] - lastPointerMoveEvent.screenCoords[0];
        const dy = screenCoords[1] - lastPointerMoveEvent.screenCoords[1];
        updatedData = this._updateFeature(props, 'feature', { dx, dy });
        onEdit({
          editType,
          updatedData,
          editContext: null
        });
        break;

      case ELEMENT_TYPE.EDIT_HANDLE:
        // dragging editHandle
        // dragging rectangle or other shapes
        const updateType =
          selectedFeature.properties.renderType === RENDER_TYPE.RECTANGLE
            ? 'rectangle'
            : 'editHandle';
        updatedData = this._updateFeature(props, updateType, {
          editHandleIndex,
          mapCoords: event.mapCoords
        });

        onEdit({
          editType,
          updatedData,
          editContext: null
        });
        break;

      default:
    }
  };

  handlePointerMove = (event: PointerMoveEvent, props: ModeProps<FeatureCollection>) => {
    // no selected feature
    const selectedFeature = this.getSelectedFeature(props);
    if (!selectedFeature) {
      return;
    }

    if (!event.isDragging) {
      return;
    }

    this._handleDragging(event, props);
  };

  // TODO - refactor
  _updateFeature = (props: ModeProps<FeatureCollection>, type: string, options: any = {}) => {
    const { data, selectedIndexes, viewport } = props;

    const featureIndex = selectedIndexes && selectedIndexes[0];
    const feature = this.getSelectedFeature(props, featureIndex);

    let geometry = null;
    const coordinates = getFeatureCoordinates(feature);
    if (!coordinates) {
      return null;
    }

    let newCoordinates = [...coordinates];

    switch (type) {
      case 'editHandle':
        const positionIndexes =
          feature.geometry.type === GEOJSON_TYPE.POLYGON
            ? [0, options.editHandleIndex]
            : [options.editHandleIndex];

        return data.replacePosition(featureIndex, positionIndexes, options.mapCoords).getObject();

      case 'feature':
        const { dx, dy } = options;
        newCoordinates = newCoordinates
          .map(mapCoords => {
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
            feature.geometry.type === GEOJSON_TYPE.POLYGON ? [newCoordinates] : newCoordinates
        };

        return data.replaceGeometry(featureIndex, geometry).getObject();

      case 'rectangle':
        // moved editHandleIndex and destination mapCoords
        newCoordinates = updateRectanglePosition(
          feature,
          options.editHandleIndex,
          options.mapCoords
        );

        geometry = {
          type: GEOJSON_TYPE.POLYGON,
          coordinates: newCoordinates
        };

        return data.replaceGeometry(featureIndex, geometry).getObject();

      default:
        return data && data.getObject();
    }
  };

  _getPointOnSegment(feature: Feature, pickedObject: any, pickedMapCoords: Position) {
    const coordinates = getFeatureCoordinates(feature);
    if (!coordinates) {
      return null;
    }
    const srcVertexIndex = pickedObject.index;
    const targetVertexIndex = pickedObject.index + 1;
    return findClosestPointOnLineSegment(
      coordinates[srcVertexIndex],
      coordinates[targetVertexIndex],
      pickedMapCoords
    );
  }

  _getCursorEditHandle = (event: PointerMoveEvent, feature: Feature) => {
    const { isDragging, picks } = event;
    // if not pick segment
    const pickedObject = picks && picks[0] && picks[0].object;
    if (
      !pickedObject ||
      !isNumeric(pickedObject.featureIndex) ||
      pickedObject.type !== ELEMENT_TYPE.SEGMENT
    ) {
      return null;
    }

    // if dragging or feature is neither polygon nor line string
    if (
      isDragging ||
      (feature.properties.renderType !== GEOJSON_TYPE.POLYGON &&
        feature.properties.renderType !== GEOJSON_TYPE.LINE_STRING)
    ) {
      return null;
    }

    const insertMapCoords = this._getPointOnSegment(feature, pickedObject, event.mapCoords);

    if (!insertMapCoords) {
      return null;
    }

    return {
      type: 'Feature',
      properties: {
        guideType: GUIDE_TYPE.CURSOR_EDIT_HANDLE,
        renderType: feature.properties.renderType,
        positionIndexes: [null]
      },
      geometry: {
        type: GEOJSON_TYPE.POINT,
        coordinates: [insertMapCoords]
      }
    };
  };

  getGuides = (props: ModeProps<FeatureCollection>) => {
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
      editHandles.push(this._getCursorEditHandle(event, selectedFeature));
    }

    return {
      editHandles: editHandles.length ? editHandles : null
    };
  };
}
