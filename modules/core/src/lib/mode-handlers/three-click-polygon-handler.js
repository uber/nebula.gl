// @flow

import type { Polygon } from '../../geojson-types.js';
import type { ClickEvent } from '../event-types.js';
import type { EditAction } from './mode-handler.js';
import { ModeHandler } from './mode-handler.js';

export class ThreeClickPolygonHandler extends ModeHandler {
  handleClick(event: ClickEvent): ?EditAction {
    super.handleClick(event);

    const tentativeFeature = this.getTentativeFeature();
    const featureCollection = this.getImmutableFeatureCollection();
    const clickSequence = this.getClickSequence();

    if (
      clickSequence.length > 2 &&
      tentativeFeature &&
      tentativeFeature.geometry.type === 'Polygon'
    ) {
      const geometry: Polygon = tentativeFeature.geometry;
      this.resetClickSequence();

      const updatedData = featureCollection
        .addFeature({
          type: 'Feature',
          properties: {},
          geometry
        })
        .getObject();

      return {
        updatedData,
        editType: 'addFeature',
        featureIndex: updatedData.features.length - 1,
        positionIndexes: null,
        position: null
      };
    }

    return null;
  }
}
