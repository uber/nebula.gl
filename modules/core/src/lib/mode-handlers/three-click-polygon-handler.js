// @flow

import type { Polygon } from '../../geojson-types.js';
import type { ClickEvent } from '../event-types.js';
import { ModeHandler, getAddFeatureAction } from './mode-handler.js';
import type { EditAction } from './mode-handler.js';

export class ThreeClickPolygonHandler extends ModeHandler {
  handleClick(event: ClickEvent): ?EditAction {
    super.handleClick(event);

    const tentativeFeature = this.getTentativeFeature();
    const clickSequence = this.getClickSequence();

    if (
      clickSequence.length > 2 &&
      tentativeFeature &&
      tentativeFeature.geometry.type === 'Polygon'
    ) {
      const geometry: Polygon = tentativeFeature.geometry;
      this.resetClickSequence();

      return getAddFeatureAction(this.getImmutableFeatureCollection(), geometry);
    }

    return null;
  }
}
