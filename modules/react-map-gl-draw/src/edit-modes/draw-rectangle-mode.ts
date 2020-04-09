import { Feature, ClickEvent, FeatureCollection } from '@nebula.gl/edit-modes';
import uuid from 'uuid/v1';
import { ModeProps } from '../types';

import { EDIT_TYPE, GEOJSON_TYPE, GUIDE_TYPE, RENDER_TYPE } from '../constants';
import BaseMode from './base-mode';
import { getFeatureCoordinates, updateRectanglePosition } from './utils';

export default class DrawRectangleMode extends BaseMode {
  handleClick = (event: ClickEvent, props: ModeProps<FeatureCollection>) => {
    const tentativeFeature = this.getTentativeFeature();
    if (!tentativeFeature) {
      this._initTentativeFeature(event, props);
    } else {
      this._commitTentativeFeature(event, props);
    }
  };

  getEditHandlesFromFeature = (feature: Feature, featureIndex: number | null | undefined) => {
    const coordinates = getFeatureCoordinates(feature);
    return (
      coordinates &&
      // @ts-ignore
      coordinates.map((coord, i) => {
        return {
          type: 'Feature',
          properties: {
            // TODO remove renderType
            renderType: RENDER_TYPE.RECTANGLE,
            guideType: GUIDE_TYPE.CURSOR_EDIT_HANDLE,
            featureIndex,
            positionIndexes: [i],
          },
          geometry: {
            type: GEOJSON_TYPE.POINT,
            coordinates: [coord],
          },
        };
      })
    );
  };
  // @ts-ignore
  getGuides = (props: ModeProps<FeatureCollection>) => {
    let tentativeFeature = this.getTentativeFeature();
    const coordinates = getFeatureCoordinates(tentativeFeature);

    if (!coordinates) {
      return null;
    }

    const event = props.lastPointerMoveEvent;
    // update tentative feature
    const newCoordinates = updateRectanglePosition(tentativeFeature, 2, event.mapCoords);

    tentativeFeature = {
      type: 'Feature',
      properties: {
        // TODO deprecate id and renderType
        id: uuid(),
        guideType: GUIDE_TYPE.TENTATIVE,
        renderType: RENDER_TYPE.RECTANGLE,
      },
      geometry: {
        // @ts-ignore
        type: GEOJSON_TYPE.LINE_STRING,
        coordinates: newCoordinates,
      },
    };
    // @ts-ignore
    const editHandles = this.getEditHandlesFromFeature(tentativeFeature);

    return {
      tentativeFeature,
      editHandles,
    };
  };

  _commitTentativeFeature = (event: ClickEvent, props: ModeProps<FeatureCollection>) => {
    // close rectangle and commit
    const { data } = props;
    let tentativeFeature = this.getTentativeFeature();
    if (tentativeFeature) {
      // clear guides
      this.setTentativeFeature(null);

      let coordinates = updateRectanglePosition(tentativeFeature, 2, event.mapCoords);
      if (!coordinates) {
        return;
      }

      // close rectangle
      coordinates = [...coordinates, coordinates[0]];

      tentativeFeature = {
        ...tentativeFeature,
        properties: {
          // TODO deprecate id
          id: tentativeFeature.properties.id,
          renderType: RENDER_TYPE.RECTANGLE,
        },
        geometry: {
          // @ts-ignore
          type: GEOJSON_TYPE.POLYGON,
          coordinates: [coordinates],
        },
      };
      // @ts-ignore
      const updatedData = data.addFeature(tentativeFeature).getObject();

      // commit rectangle
      props.onEdit({
        editType: EDIT_TYPE.ADD_FEATURE,
        updatedData,
        editContext: null,
      });
    }
  };

  _initTentativeFeature = (event: ClickEvent, props: ModeProps<FeatureCollection>) => {
    this.setTentativeFeature({
      type: 'Feature',
      properties: {
        // TODO deprecate id
        id: uuid(),
        renderType: RENDER_TYPE.RECTANGLE,
        guideType: GUIDE_TYPE.TENTATIVE,
      },
      geometry: {
        type: 'LineString',
        coordinates: [event.mapCoords, event.mapCoords, event.mapCoords, event.mapCoords],
      },
    });
  };
}
