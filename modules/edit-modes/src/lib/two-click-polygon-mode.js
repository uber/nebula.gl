// @flow

import type { ClickEvent } from '../types.js';
import { BaseGeoJsonEditMode, type GeoJsonEditAction } from './geojson-edit-mode.js';

export class TwoClickPolygonMode extends BaseGeoJsonEditMode {
  onStateChanged() {
    this.onUpdateCursor('cell');
  }

  handleClickAdapter(event: ClickEvent): ?GeoJsonEditAction {
    super.handleClickAdapter(event);

    const tentativeFeature = this.getTentativeFeature();
    const clickSequence = this.getClickSequence();

    if (
      clickSequence.length > 1 &&
      tentativeFeature &&
      tentativeFeature.geometry.type === 'Polygon'
    ) {
      const editAction = this.getAddFeatureOrBooleanPolygonAction(tentativeFeature.geometry);
      this.resetClickSequence();
      this._setTentativeFeature(null);
      return editAction;
    }

    return null;
  }
}
