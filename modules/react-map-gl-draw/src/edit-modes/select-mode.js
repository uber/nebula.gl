// @flow

import type { FeatureCollection, StopDraggingEvent, PointerMoveEvent } from '@nebula.gl/edit-modes';
import type { ModeProps } from '../types';

import { EDIT_TYPE, ELEMENT_TYPE, GEOJSON_TYPE } from '../constants';
import BaseMode from './base-mode';
import { getFeatureCoordinates, isNumeric, updateRectanglePosition } from './utils';

export default class SelectMode extends BaseMode {
  handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>) {
    // replace point
    const pickedObject = event.picks && event.picks[0] && event.picks[0].object;
    if (!pickedObject || !isNumeric(pickedObject.featureIndex)) {
      return;
    }

    switch (pickedObject.type) {
      case ELEMENT_TYPE.FEATURE:
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
    // nothing clicked
    const { isDragging, pointerDownPicks, screenCoords } = event;
    const { lastPointerMoveEvent } = props;

    const clickedObject = pointerDownPicks && pointerDownPicks[0] && pointerDownPicks[0].object;
    if (!clickedObject || !isNumeric(clickedObject.featureIndex)) {
      return;
    }

    // not dragging
    let updatedData = null;
    const editType = isDragging ? EDIT_TYPE.MOVE_POSITION : EDIT_TYPE.FINISH_MOVE_POSITION;

    switch (clickedObject.type) {
      case ELEMENT_TYPE.FEATURE:
      case ELEMENT_TYPE.FILL:
      case ELEMENT_TYPE.SEGMENT:
      case ELEMENT_TYPE.EDIT_HANDLE:
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

  getGuides = (props: ModeProps<FeatureCollection>) => {
    const selectedFeature = this.getSelectedFeature(props);
    const selectedFeatureIndex = props.selectedIndexes && props.selectedIndexes[0];

    if (!selectedFeature || selectedFeature.geometry.type === GEOJSON_TYPE.POINT) {
      return null;
    }

    // feature editHandles
    const editHandles = this.getEditHandlesFromFeature(selectedFeature, selectedFeatureIndex) || [];

    return {
      editHandles: editHandles.length ? editHandles : null
    };
  };
}
