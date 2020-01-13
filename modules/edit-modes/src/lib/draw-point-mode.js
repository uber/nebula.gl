// @flow

import type { ClickEvent, PointerMoveEvent, ModeProps } from '../types.js';
import type { FeatureCollection } from '../geojson-types.js';
import { BaseGeoJsonEditMode } from './geojson-edit-mode.js';

export class DrawPointMode extends BaseGeoJsonEditMode {
  handleClick({ mapCoords }: ClickEvent, props: ModeProps<FeatureCollection>): void {
    const geometry = {
      type: 'Point',
      coordinates: mapCoords
    };

    props.onEdit(this.getAddFeatureAction(geometry, props.data));
  }

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>) {
    props.onUpdateCursor('cell');
  }
}
