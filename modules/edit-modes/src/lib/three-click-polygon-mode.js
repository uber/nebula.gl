// @flow

import type { ClickEvent, PointerMoveEvent, ModeProps, GuideFeatureCollection } from '../types.js';
import type { Position, Polygon, FeatureOf, FeatureCollection } from '../geojson-types.js';
import { BaseGeoJsonEditMode } from './geojson-edit-mode.js';

export class ThreeClickPolygonMode extends BaseGeoJsonEditMode {
  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
    this.addClickSequence(event);
    const clickSequence = this.getClickSequence();
    const tentativeFeature = this.getTentativeGuide(props);

    if (
      clickSequence.length > 2 &&
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

  getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection {
    const { lastPointerMoveEvent, modeConfig } = props;
    const clickSequence = this.getClickSequence();

    const guides: GuideFeatureCollection = {
      type: 'FeatureCollection',
      features: []
    };

    if (clickSequence.length === 0) {
      // nothing to do yet
      return guides;
    }

    const hoveredCoord = lastPointerMoveEvent.mapCoords;

    if (clickSequence.length === 1) {
      guides.features.push({
        type: 'Feature',
        properties: {
          guideType: 'tentative'
        },
        geometry: {
          type: 'LineString',
          coordinates: [clickSequence[0], hoveredCoord]
        }
      });
    } else {
      const polygon = this.getThreeClickPolygon(
        clickSequence[0],
        clickSequence[1],
        hoveredCoord,
        modeConfig
      );
      if (polygon) {
        guides.features.push({
          type: 'Feature',
          properties: {
            guideType: 'tentative'
          },
          geometry: polygon.geometry
        });
      }
    }

    return guides;
  }

  getThreeClickPolygon(
    coord1: Position,
    coord2: Position,
    coord3: Position,
    modeConfig: any
  ): ?FeatureOf<Polygon> {
    return null;
  }

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>) {
    props.onUpdateCursor('cell');
  }
}
