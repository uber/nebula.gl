// @flow

import type { ClickEvent, PointerMoveEvent, ModeProps } from '../types.js';
import type { Polygon, FeatureCollection, FeatureOf, Position } from '../geojson-types.js';
import { BaseGeoJsonEditMode } from './geojson-edit-mode.js';

export class TwoClickPolygonMode extends BaseGeoJsonEditMode {
  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
    this.addClickSequence(event);
    const clickSequence = this.getClickSequence();
    const tentativeFeature = this.getTentativeGuide(props);

    if (
      clickSequence.length > 1 &&
      tentativeFeature &&
      tentativeFeature.geometry.type === 'Polygon'
    ) {
      const editAction = this.getAddFeatureOrBooleanPolygonAction(tentativeFeature.geometry, props);

      this.resetClickSequence();

      if (editAction) {
        props.onEdit(editAction);
      }
    }
  }

  getGuides(props: ModeProps<FeatureCollection>): FeatureCollection {
    const { lastPointerMoveEvent, modeConfig } = props;
    const clickSequence = this.getClickSequence();

    const guides = {
      type: 'FeatureCollection',
      features: []
    };

    if (clickSequence.length === 0) {
      // nothing to do yet
      return guides;
    }

    const corner1 = clickSequence[0];
    const corner2 = lastPointerMoveEvent.mapCoords;

    const polygon = this.getTwoClickPolygon(corner1, corner2, modeConfig);
    if (polygon) {
      polygon.properties = polygon.properties || {};
      polygon.properties.guideType = 'tentative';

      guides.features.push(polygon);
    }

    return guides;
  }

  getTwoClickPolygon(coord1: Position, coord2: Position, modeConfig: any): ?FeatureOf<Polygon> {
    return null;
  }

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>) {
    props.onUpdateCursor('cell');
  }
}
