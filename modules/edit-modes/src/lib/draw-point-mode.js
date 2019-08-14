// @flow

import type { ClickEvent, ModeProps } from '../types.js';
import type { FeatureCollection } from '../geojson-types.js';
import { BaseGeoJsonEditMode, type GeoJsonEditAction } from './geojson-edit-mode.js';

export class DrawPointMode extends BaseGeoJsonEditMode {
  handleClickAdapter(
    { mapCoords }: ClickEvent,
    props: ModeProps<FeatureCollection>
  ): ?GeoJsonEditAction {
    const geometry = {
      type: 'Point',
      coordinates: mapCoords
    };

    return this.getAddFeatureAction(geometry, props.data);
  }

  getCursorAdapter() {
    return 'cell';
  }
}
