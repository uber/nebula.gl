// @flow

import type { ClickEvent } from '../types.js';
import { BaseGeoJsonEditMode, type GeoJsonEditAction } from './geojson-edit-mode.js';

export class DrawPointMode extends BaseGeoJsonEditMode {
  onStateChanged() {
    this.onUpdateCursor('cell');
  }

  handleClickAdapter({ mapCoords }: ClickEvent): ?GeoJsonEditAction {
    const geometry = {
      type: 'Point',
      coordinates: mapCoords
    };

    return this.getAddFeatureAction(geometry);
  }
}
