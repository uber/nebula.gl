import uuid from 'uuid/v1';

import { ClickEvent, FeatureCollection } from '@nebula.gl/edit-modes';
import { ModeProps } from '../types';

import { EDIT_TYPE, GEOJSON_TYPE, RENDER_TYPE } from '../constants';
import BaseMode from './base-mode';

export default class DrawPointMode extends BaseMode {
  handleClick = (event: ClickEvent, props: ModeProps<FeatureCollection>) => {
    const feature = {
      type: 'Feature',
      properties: {
        id: uuid(),
        renderType: RENDER_TYPE.POINT,
      },
      geometry: {
        type: GEOJSON_TYPE.POINT,
        coordinates: [event.mapCoords],
      },
    };
    // @ts-ignore
    const updatedData = props.data.addFeature(feature).getObject();

    props.onEdit({
      editType: EDIT_TYPE.ADD_FEATURE,
      updatedData,
      editContext: null,
    });
  };
}
