// @flow

import uuid from 'uuid/v1';

import type { ClickEvent, FeatureCollection } from '@nebula.gl/edit-modes';
import type { ModeProps } from '../types';

import { EDIT_TYPE, GEOJSON_TYPE, GUIDE_TYPE, RENDER_TYPE } from '../constants';
import BaseMode from './base-mode';
import { getFeatureCoordinates } from './utils';

export default class DrawLineStringMode extends BaseMode {
  handleClick = (event: ClickEvent, props: ModeProps<FeatureCollection>) => {
    const selectedFeature = this.getSelectedFeature(props);
    const tentativeFeature = this.getTentativeFeature();

    if (selectedFeature) {
      // add position to a selectedFeature
      this._updateFeature(event, props);
    } else if (tentativeFeature) {
      // commit tentativeFeature to featureCollection
      this._commitTentativeFeature(event, props);
    } else {
      this._initTentativeFeature(event, props);
    }
  };

  handleDblClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
    const selectedFeature = this.getSelectedFeature(props);
    if (!selectedFeature) {
      return;
    }

    this._updateFeature(event, props);

    props.onSelect({
      selectedFeature: null,
      selectedFeatureIndex: null,
      selectedEditHandleIndex: null,
      screenCoords: event.screenCoords,
      mapCoords: event.mapCoords
    });
  }

  getGuides = (props: ModeProps<FeatureCollection>) => {
    const selectedFeature = this.getSelectedFeature(props);
    let tentativeFeature = this.getTentativeFeature();

    const feature = selectedFeature || tentativeFeature;
    const coordinates = getFeatureCoordinates(feature);

    if (!coordinates) {
      return null;
    }

    const event = props.lastPointerMoveEvent;

    // existing editHandles + cursorEditHandle
    const editHandles = this.getEditHandlesFromFeature(feature) || [];
    const cursorEditHandle = {
      type: 'Feature',
      properties: {
        guideType: GUIDE_TYPE.CURSOR_EDIT_HANDLE,
        // TODO remove renderType
        renderType: RENDER_TYPE.LINE_STRING,
        positionIndexes: [editHandles.length]
      },
      geometry: {
        type: GEOJSON_TYPE.POINT,
        coordinates: [event.mapCoords]
      }
    };
    editHandles.push(cursorEditHandle);

    // tentativeFeature
    tentativeFeature = {
      type: 'Feature',
      properties: {
        // TODO deprecate id and renderType
        id: uuid(),
        guideType: GUIDE_TYPE.TENTATIVE,
        renderType: RENDER_TYPE.LINE_STRING
      },
      geometry: {
        type: GEOJSON_TYPE.LINE_STRING,
        coordinates: [coordinates[coordinates.length - 1], event.mapCoords]
      }
    };

    return {
      tentativeFeature,
      editHandles
    };
  };

  _updateFeature = (event: ClickEvent, props: ModeProps<FeatureCollection>) => {
    const { data, selectedIndexes } = props;
    const selectedFeature = this.getSelectedFeature(props);
    const selectedFeatureIndex = selectedIndexes[0];
    const positionIndexes = [selectedFeature.geometry.coordinates.length];

    const updatedData = data
      .addPosition(selectedFeatureIndex, positionIndexes, event.mapCoords)
      .getObject();

    props.onEdit({
      editType: EDIT_TYPE.ADD_POSITION,
      updatedData,
      editContext: [
        {
          featureIndex: selectedFeatureIndex,
          editHandleIndex: positionIndexes[0],
          screenCoords: event.screenCoords,
          mapCoords: event.mapCoords
        }
      ]
    });
  };

  _commitTentativeFeature = (event: ClickEvent, props: ModeProps<FeatureCollection>) => {
    const tentativeFeature = this.getTentativeFeature();
    if (!tentativeFeature) {
      return;
    }

    const { data } = props;
    const selectedFeature = this.getSelectedFeature(props);
    this.setTentativeFeature(null);

    const feature = {
      type: 'Feature',
      properties: {
        id: tentativeFeature.properties.id,
        // todo deprecate renderType
        renderType: RENDER_TYPE.LINE_STRING
      },
      geometry: {
        type: GEOJSON_TYPE.LINE_STRING,
        coordinates: [tentativeFeature.geometry.coordinates[0], event.mapCoords]
      }
    };

    const updatedData = data.addFeature(feature).getObject();
    const featureIndex = updatedData.features.length - 1;

    props.onEdit({
      editType: EDIT_TYPE.ADD_FEATURE,
      updatedData,
      editContext: null
    });

    props.onSelect({
      selectedFeature,
      selectedFeatureIndex: featureIndex,
      selectedEditHandleIndex: null,
      screenCoords: event.screenCoords,
      mapCoords: event.mapCoords
    });
  };

  _initTentativeFeature = (event: ClickEvent, props: ModeProps<FeatureCollection>) => {
    this.setTentativeFeature({
      type: 'Feature',
      properties: {
        // TODO deprecate id & renderType
        id: uuid(),
        renderType: RENDER_TYPE.LINE_STRING,
        guideType: GUIDE_TYPE.TENTATIVE
      },
      geometry: {
        type: GEOJSON_TYPE.POINT,
        coordinates: [event.mapCoords]
      }
    });
  };
}
