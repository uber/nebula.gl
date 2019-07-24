// @flow
import type { ClickEvent, FeatureCollection } from '@nebula.gl/edit-modes';
import uuid from 'uuid/v1';

import type { ModeProps } from '../types';
import { EDIT_TYPE, GEOJSON_TYPE, GUIDE_TYPE, RENDER_TYPE } from '../constants';
import { getFeatureCoordinates } from './utils';
import BaseMode from './base-mode';

export default class DrawPolygonMode extends BaseMode {
  handleClick = (event: ClickEvent, props: ModeProps<FeatureCollection>) => {
    const picked = event.picks && event.picks[0];
    const { data } = props;

    // update tentative feature
    let tentativeFeature = this.getTentativeFeature();

    // add position to tentativeFeature
    // if click the first editHandle, commit tentativeFeature to featureCollection
    if (tentativeFeature) {
      const pickedObject = picked && picked.object;
      // clicked an editHandle of a tentative feature
      if (pickedObject && pickedObject.index === 0) {
        this.setTentativeFeature(null);

        // append point to the tail, close the polygon
        const coordinates = getFeatureCoordinates(tentativeFeature);
        if (!coordinates) {
          return;
        }

        coordinates.push(coordinates[0]);

        tentativeFeature = {
          type: 'Feature',
          properties: {
            // TODO deprecate id
            id: tentativeFeature.properties.id,
            renderType: RENDER_TYPE.POLYGON
          },
          geometry: {
            type: GEOJSON_TYPE.POLYGON,
            coordinates: [coordinates]
          }
        };

        const updatedData = data.addFeature(tentativeFeature).getObject();

        props.onEdit({
          editType: EDIT_TYPE.ADD_FEATURE,
          updatedData,
          editContext: null
        });
      } else {
        // update tentativeFeature
        tentativeFeature = {
          ...tentativeFeature,
          geometry: {
            type: GEOJSON_TYPE.LINE_STRING,
            coordinates: [...tentativeFeature.geometry.coordinates, event.mapCoords]
          }
        };
        this.setTentativeFeature(tentativeFeature);
      }
    } else {
      // create a tentativeFeature
      tentativeFeature = {
        type: 'Feature',
        properties: {
          // TODO deprecate id
          id: uuid(),
          renderType: RENDER_TYPE.POLYGON,
          guideType: GUIDE_TYPE.TENTATIVE
        },
        geometry: {
          type: GEOJSON_TYPE.POINT,
          coordinates: [event.mapCoords]
        }
      };

      this.setTentativeFeature(tentativeFeature);
    }
  };

  getGuides = (props: ModeProps<FeatureCollection>) => {
    let tentativeFeature = this.getTentativeFeature();
    const coordinates = getFeatureCoordinates(tentativeFeature);

    if (!coordinates) {
      return null;
    }

    const event = props.lastPointerMoveEvent;

    // existing editHandles + cursorEditHandle
    const editHandles = this.getEditHandlesFromFeature(tentativeFeature) || [];
    const cursorEditHandle = {
      type: 'Feature',
      properties: {
        guideType: GUIDE_TYPE.CURSOR_EDIT_HANDLE,
        // TODO remove renderType
        renderType: RENDER_TYPE.POLYGON,
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
      ...tentativeFeature,
      geometry: {
        type: GEOJSON_TYPE.LINE_STRING,
        coordinates: [...coordinates, event.mapCoords]
      }
    };

    return {
      tentativeFeature,
      editHandles
    };
  };
}
